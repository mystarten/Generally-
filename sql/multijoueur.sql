-- =============================================================================
-- Generally — le multijoueur, cote serveur.
--
-- POURQUOI CE FICHIER. Tout le multijoueur — trois tables, dix fonctions —
-- n'existait que dans le projet Supabase heberge, sans aucune copie ici. Le
-- perdre, c'etait perdre le multijoueur du jeu ET celui de la zone
-- d'entrainement, sans rien pour le reconstruire. Ce fichier est le relevé de
-- ce qui tourne reellement : il a ete produit depuis la base, pas ecrit de
-- memoire.
--
-- CE N'EST PAS UNE MIGRATION. Le rejouer en entier sur une base vide recree
-- l'ensemble ; sur la base existante, les CREATE OR REPLACE remplacent les
-- fonctions sans toucher aux donnees. Tenez-le a jour quand vous modifiez une
-- fonction, sinon il redevient une fiction.
--
-- SECURITE. La cle publiable du client n'ecrit jamais en direct : les tables
-- sont en RLS sans politique d'ecriture, et tout passe par ces fonctions, qui
-- sont SECURITY DEFINER et verifient le jeton de l'appelant. Un joueur ne peut
-- donc regler ou lancer que le salon dont il est l'hote, et ne peut repondre
-- qu'une fois par manche.
--
-- DEUX CLIENTS, UN PROTOCOLE. index.html (le jeu) et training/salon.js (la
-- zone d'entrainement) appellent les memes fonctions. Un changement ici les
-- concerne tous les deux.
-- =============================================================================

-- ------------------------------------------------------------------ tables

create table if not exists public.generally_salons (
  code          text primary key,
  hote_jeton    uuid        not null,
  etat          text        not null default 'attente',
  categorie     text        not null default 'toutes',
  niveau        integer     not null default 0,
  questions     jsonb       not null default '[]'::jsonb,
  cree_le       timestamptz not null default now(),
  demarre_le    timestamptz,
  mode          text        not null default 'libre',
  nb_questions  integer     not null default 12,
  secondes      integer     not null default 20,
  manche        integer     not null default -1,
  manche_debut  timestamptz,
  constraint generally_salons_etat_check
    check (etat = any (array['attente', 'en_cours', 'termine'])),
  -- « duel » a ete ajoute apres coup : le premier a repondre juste prend la
  -- manche, et une mauvaise reponse coute des points.
  constraint generally_salons_mode_ok
    check (mode = any (array['libre', 'course', 'duel']))
);
create index if not exists generally_salons_cree_idx on public.generally_salons (cree_le);

create table if not exists public.generally_joueurs (
  id          bigint generated always as identity primary key,
  salon       text        not null references public.generally_salons(code),
  jeton       uuid        not null,
  nom         text        not null,
  score       integer     not null default 0,
  avancement  integer     not null default 0,
  bonnes      integer     not null default 0,
  fini        boolean     not null default false,
  rejoint_le  timestamptz not null default now(),
  vu_le       timestamptz not null default now(),
  est_hote    boolean     not null default false
);
create unique index if not exists generally_joueurs_salon_jeton_key
  on public.generally_joueurs (salon, jeton);
create index if not exists generally_joueurs_salon_idx
  on public.generally_joueurs (salon);

create table if not exists public.generally_reponses (
  salon    text        not null,
  jeton    uuid        not null,
  manche   integer     not null,
  juste    boolean     not null,
  ms       integer     not null,
  points   integer     not null default 0,
  cree_le  timestamptz not null default now(),
  primary key (salon, jeton, manche)
);
create index if not exists generally_reponses_manche
  on public.generally_reponses (salon, manche);

alter table public.generally_salons   enable row level security;
alter table public.generally_joueurs  enable row level security;
alter table public.generally_reponses enable row level security;

-- =============================================================================
-- LA NOTATION, EN CLAIR
--
-- Mode LIBRE — chacun avance a son rythme sur les memes questions. Le score
-- est pousse par le client via generally_maj_score, qui l'ecrete a zero.
--
-- Mode COURSE — tout le monde voit la meme question en meme temps.
--     points = prime de RANG + prime de VITESSE
--     rang parmi les bonnes reponses : 1er 100, 2e 70, 3e 50, 4e 35, puis 25
--     vitesse : 100 x (temps restant / temps total)^2
-- Le carre est le coeur du reglage : a mi-temps la prime ne vaut plus qu'un
-- quart, aux trois quarts du temps presque rien. Avant, elle etait lineaire et
-- repondre tard rapportait encore beaucoup.
--     20 s de manche :  0 s → 200   2 s → 181   5 s → 156
--                      10 s → 125  14 s → 109  18 s → 101   (pour un 1er)
-- Une mauvaise reponse ne coute rien, mais ne rapporte rien.
--
-- Mode DUEL — le premier a repondre juste prend la manche, qui se ferme
-- aussitot.
--     premier juste  : 100 + jusqu'a 50 selon la rapidite
--     juste ensuite  : 0 — la manche etait deja prise
--     juste hors temps : 0, et non une penalite : on sanctionne l'erreur,
--                        pas la lenteur
--     faux           : -50, et le score peut passer sous zero
--     pas de reponse : 0 — ne pas repondre n'est pas se tromper
-- Une seule tentative par manche (cle primaire salon+jeton+manche) : c'est ce
-- qui donne du poids a la penalite, sinon il suffirait de tout essayer.
-- =============================================================================

-- ----------------------------------------------------------------- fonctions
-- Relevees depuis la base avec pg_get_functiondef, puis recopiees ici telles
-- quelles. Toutes sont SECURITY DEFINER avec un search_path fige : c'est ce
-- qui permet de les exposer a la cle publiable sans ouvrir les tables.

-- Un code de salon libre : six caracteres sans I, O, 0 ni 1, pour qu'il se
-- dicte a voix haute sans ambiguite.
CREATE OR REPLACE FUNCTION public.generally_code_libre()
 RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  essai text;
  i int;
begin
  for tentative in 1..40 loop
    essai := '';
    for i in 1..6 loop
      essai := essai || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    if not exists (select 1 from public.generally_salons s where s.code = essai) then
      return essai;
    end if;
  end loop;
  raise exception 'impossible de generer un code libre';
end;
$function$;

CREATE OR REPLACE FUNCTION public.generally_creer_salon(p_jeton uuid, p_nom text, p_categorie text, p_niveau integer, p_questions jsonb)
 RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_code text;
begin
  if p_nom is null or length(btrim(p_nom)) = 0 then raise exception 'nom manquant'; end if;
  if jsonb_typeof(p_questions) <> 'array' or jsonb_array_length(p_questions) = 0 then
    raise exception 'aucune question';
  end if;
  delete from public.generally_salons where cree_le < now() - interval '6 hours';
  v_code := public.generally_code_libre();
  insert into public.generally_salons (code, hote_jeton, categorie, niveau, questions)
  values (v_code, p_jeton, coalesce(p_categorie,'toutes'), coalesce(p_niveau,0), p_questions);
  insert into public.generally_joueurs (salon, jeton, nom, est_hote)
  values (v_code, p_jeton, left(btrim(p_nom), 24), true);
  return v_code;
end;
$function$;

CREATE OR REPLACE FUNCTION public.generally_rejoindre(p_code text, p_jeton uuid, p_nom text)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_salon public.generally_salons%rowtype; v_nb int; v_deja boolean;
begin
  select * into v_salon from public.generally_salons where code = upper(btrim(p_code));
  if not found then raise exception 'salon introuvable'; end if;

  select exists (select 1 from public.generally_joueurs j
                  where j.salon = v_salon.code and j.jeton = p_jeton) into v_deja;

  if v_salon.etat <> 'attente' and not v_deja then
    raise exception 'la partie a deja commence';
  end if;

  select count(*) into v_nb from public.generally_joueurs j where j.salon = v_salon.code;
  if v_nb >= 12 and not v_deja then raise exception 'salon complet'; end if;

  insert into public.generally_joueurs (salon, jeton, nom)
  values (v_salon.code, p_jeton, left(btrim(coalesce(p_nom,'Joueur')), 24))
  on conflict (salon, jeton) do update set nom = excluded.nom, vu_le = now();

  return jsonb_build_object(
    'code', v_salon.code, 'etat', v_salon.etat, 'categorie', v_salon.categorie,
    'niveau', v_salon.niveau, 'questions', v_salon.questions,
    'mode', v_salon.mode, 'secondes', v_salon.secondes,
    'manche', v_salon.manche, 'manche_debut', v_salon.manche_debut,
    'hote', (v_salon.hote_jeton = p_jeton));
end;
$function$;

CREATE OR REPLACE FUNCTION public.generally_reglages(p_code text, p_jeton uuid, p_categorie text, p_niveau integer, p_mode text, p_nb integer, p_secondes integer, p_questions jsonb)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_nb int;
begin
  if coalesce(p_mode,'libre') not in ('libre','course','duel') then
    raise exception 'mode inconnu';
  end if;
  if jsonb_typeof(p_questions) <> 'array' or jsonb_array_length(p_questions) = 0 then
    raise exception 'aucune question';
  end if;
  v_nb := jsonb_array_length(p_questions);
  update public.generally_salons
     set categorie    = coalesce(p_categorie, 'toutes'),
         niveau       = coalesce(p_niveau, 0),
         mode         = coalesce(p_mode, 'libre'),
         nb_questions = v_nb,
         secondes     = least(60, greatest(5, coalesce(p_secondes, 20))),
         questions    = p_questions
   where code = upper(btrim(p_code))
     and hote_jeton = p_jeton
     and etat = 'attente';
  if not found then raise exception 'seul l hote peut regler le salon'; end if;
end;
$function$;

-- ATTENTION : cette fonction n'ouvre la premiere manche que pour « course ».
-- Le duel, ajoute apres, passerait donc par generally_ouvrir_manches juste en
-- dessous. La correction naturelle serait d'ecrire ici
--     manche = case when v_mode in ('course','duel') then 0 else -1 end
-- et de supprimer la fonction compagnon ainsi que son appel dans index.html.
CREATE OR REPLACE FUNCTION public.generally_demarrer(p_code text, p_jeton uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_code text := upper(btrim(p_code)); v_mode text;
begin
  select mode into v_mode from public.generally_salons
   where code = v_code and hote_jeton = p_jeton and etat = 'attente';
  if not found then raise exception 'seul l hote peut lancer la partie'; end if;

  delete from public.generally_reponses where salon = v_code;
  update public.generally_joueurs
     set score = 0, avancement = 0, bonnes = 0, fini = false, vu_le = now()
   where salon = v_code;

  update public.generally_salons
     set etat = 'en_cours', demarre_le = now(),
         manche = case when v_mode = 'course' then 0 else -1 end,
         manche_debut = case when v_mode = 'course' then now() else null end
   where code = v_code;
end;
$function$;

-- Ouvre la premiere manche d'un salon en duel. Idempotente (manche < 0) et
-- reservee a l'hote. Disparaitra le jour ou generally_demarrer connaitra le
-- mode duel.
CREATE OR REPLACE FUNCTION public.generally_ouvrir_manches(p_code text, p_jeton uuid)
 RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_code text := upper(btrim(p_code));
begin
  update public.generally_salons
     set manche = 0, manche_debut = now()
   where code = v_code and hote_jeton = p_jeton
     and etat = 'en_cours' and mode = 'duel' and manche < 0;
  if not found then return -1; end if;
  return 0;
end;
$function$;

-- Le coeur de la notation. Voir le pave « LA NOTATION, EN CLAIR » plus haut.
CREATE OR REPLACE FUNCTION public.generally_repondre(p_code text, p_jeton uuid, p_manche integer, p_juste boolean)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_code text := upper(btrim(p_code));
  s public.generally_salons%rowtype;
  v_ms int; v_limite int; v_points int := 0;
  v_reste numeric; v_rang int; v_prime_rang int;
  v_dans_le_temps boolean; v_bonne boolean; v_annoncee_juste boolean;
  v_deja public.generally_reponses%rowtype;
begin
  select * into s from public.generally_salons where code = v_code for update;
  if not found then raise exception 'salon introuvable'; end if;
  if s.etat <> 'en_cours' or s.mode not in ('course','duel') then
    raise exception 'partie non en cours';
  end if;
  if p_manche <> s.manche then raise exception 'manche depassee'; end if;

  select * into v_deja from public.generally_reponses
   where salon = v_code and jeton = p_jeton and manche = p_manche;
  if found then
    return jsonb_build_object('ms', v_deja.ms, 'points', v_deja.points,
                              'juste', v_deja.juste, 'deja', true);
  end if;

  v_ms := greatest(0, (extract(epoch from (now() - s.manche_debut)) * 1000)::int);
  v_limite := s.secondes * 1000;
  v_dans_le_temps := v_ms <= v_limite;
  v_annoncee_juste := coalesce(p_juste, false);
  v_bonne := v_annoncee_juste and v_dans_le_temps;
  v_reste := greatest(0, v_limite - v_ms)::numeric / greatest(1, v_limite);

  select count(*) + 1 into v_rang from public.generally_reponses r
   where r.salon = v_code and r.manche = p_manche and r.juste;

  if s.mode = 'duel' then
    if v_bonne and v_rang = 1 then
      v_points := 100 + round(50 * v_reste)::int;   -- le premier prend la manche
    elsif v_annoncee_juste then
      v_points := 0;                                -- juste, mais trop tard
    else
      v_points := -50;                              -- reellement faux : ca coute
    end if;
  else
    if v_bonne then
      v_prime_rang := case v_rang
                        when 1 then 100 when 2 then 70
                        when 3 then 50  when 4 then 35
                        else 25 end;
      v_points := v_prime_rang + round(100 * v_reste * v_reste)::int;
    else
      v_points := 0;
    end if;
  end if;

  insert into public.generally_reponses (salon, jeton, manche, juste, ms, points)
  values (v_code, p_jeton, p_manche, v_annoncee_juste, v_ms, v_points);

  update public.generally_joueurs
     set score = score + v_points,
         bonnes = bonnes + case when v_bonne then 1 else 0 end,
         avancement = p_manche + 1,
         vu_le = now()
   where salon = v_code and jeton = p_jeton;

  return jsonb_build_object('ms', v_ms, 'points', v_points,
                            'juste', v_annoncee_juste,
                            'rang', case when v_bonne then v_rang else null end,
                            'deja', false);
end;
$function$;

-- Fait avancer la manche. En duel, elle se ferme des qu'une bonne reponse est
-- tombee : attendre les autres n'aurait aucun sens, ils ne peuvent plus rien
-- marquer. Les trois secondes de battement laissent voir la correction.
CREATE OR REPLACE FUNCTION public.generally_avancer(p_code text, p_manche integer)
 RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_code text := upper(btrim(p_code));
  s public.generally_salons%rowtype;
  v_total int; v_rep int; v_ferme timestamptz; v_bonne timestamptz;
begin
  select * into s from public.generally_salons where code = v_code for update;
  if not found then return -1; end if;
  if s.etat <> 'en_cours' or s.mode not in ('course','duel') or s.manche <> p_manche then
    return s.manche;
  end if;

  select count(*) into v_total from public.generally_joueurs where salon = v_code;
  select count(*) into v_rep   from public.generally_reponses
   where salon = v_code and manche = p_manche;

  if v_rep >= v_total and v_total > 0 then
    select max(cree_le) into v_ferme from public.generally_reponses
     where salon = v_code and manche = p_manche;
  else
    v_ferme := s.manche_debut + make_interval(secs => s.secondes);
  end if;

  if s.mode = 'duel' then
    select min(cree_le) into v_bonne from public.generally_reponses
     where salon = v_code and manche = p_manche and juste;
    if v_bonne is not null and v_bonne < v_ferme then v_ferme := v_bonne; end if;
  end if;

  if now() < v_ferme + interval '3 seconds' then return s.manche; end if;

  if p_manche + 1 >= jsonb_array_length(s.questions) then
    update public.generally_salons
       set etat = 'termine', manche = p_manche + 1, manche_debut = null
     where code = v_code;
    update public.generally_joueurs set fini = true where salon = v_code;
    return p_manche + 1;
  end if;

  update public.generally_salons
     set manche = p_manche + 1, manche_debut = now()
   where code = v_code;
  return p_manche + 1;
end;
$function$;

-- Mode libre uniquement : le client pousse son score, qui est ecrete a zero.
-- La course et le duel ne passent pas par ici — c'est generally_repondre qui
-- compte, et c'est pourquoi un score de duel peut etre negatif.
CREATE OR REPLACE FUNCTION public.generally_maj_score(p_code text, p_jeton uuid, p_score integer, p_avancement integer, p_bonnes integer, p_fini boolean)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
begin
  update public.generally_joueurs
     set score = greatest(0, coalesce(p_score,0)),
         avancement = greatest(0, coalesce(p_avancement,0)),
         bonnes = greatest(0, coalesce(p_bonnes,0)),
         fini = coalesce(p_fini,false), vu_le = now()
   where salon = upper(btrim(p_code)) and jeton = p_jeton;
end;
$function$;

-- Un salon vide disparait : sans cela, les codes s'accumuleraient.
CREATE OR REPLACE FUNCTION public.generally_quitter(p_code text, p_jeton uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
begin
  delete from public.generally_joueurs
   where salon = upper(btrim(p_code)) and jeton = p_jeton;
  delete from public.generally_salons s
   where s.code = upper(btrim(p_code))
     and not exists (select 1 from public.generally_joueurs j where j.salon = s.code);
end;
$function$;
