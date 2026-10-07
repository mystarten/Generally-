/* =============================================================================
   Zone d'entraînement — salons multijoueurs.

   Permet de s'entraîner à plusieurs : un hôte crée un salon, partage un code
   à six caractères, chacun rejoint, et tout le monde joue EXACTEMENT la même
   chose. Classement en direct, podium à la fin.

   ------------------------------------------------------------ LE PROTOCOLE
   C'est celui du jeu principal, sans rien y changer. Les mêmes fonctions
   serveur (generally_creer_salon, generally_rejoindre, generally_reglages,
   generally_demarrer, generally_maj_score, generally_quitter), les mêmes
   tables, le même code à six caractères. Deux clients, un seul protocole.

   Pourquoi un second client plutôt qu'un module partagé : la zone
   d'entraînement est délibérément isolée du jeu — elle ne lit ses fichiers
   qu'en lecture seule et n'écrit que sous le préfixe « training_ ».
   Factoriser le salon obligerait à toucher index.html, donc à risquer le jeu
   pour un ajout qui ne le concerne pas. Le prix de ce choix est connu : si le
   protocole change un jour, les deux clients doivent suivre. C'est pourquoi
   rien n'est inventé ici — chaque appel est celui du jeu.

   ------------------------------------------------- COMMENT « LA MÊME CHOSE »
   Deux cas, et deux solutions différentes :

     — Culture SOG : les cartes ont un identifiant stable. L'hôte tire la
       liste une fois et la transmet dans le salon. Aucun hasard à partager.

     — Les épreuves : leur contenu est fabriqué à la volée, il ne se transmet
       pas. L'hôte tire donc une GRAINE, et chacun sème son tirage avec elle
       avant de lancer l'épreuve (TZ.semer). Mêmes questions, mêmes leurres,
       même ordre.

   ------------------------------------------------------------------ LE MODE
   On reprend le mode « libre » du jeu : chacun joue à son rythme, le
   classement se met à jour en direct, et le podium tombe quand tout le monde
   a fini. C'est le seul mode qui convienne à TOUTES les épreuves — une course
   question par question n'a pas de sens sur un Stroop ou un jeu de Kim, qui
   ne se découpent pas en manches.

   ------------------------------------------------------------- INDÉPENDANCE
   Ce fichier se charge sur training.html et sur sog.html. Il s'adapte à ce
   que la page sait faire jouer et ne suppose rien d'autre. Le supprimer rend
   les deux pages strictement solo, sans rien casser.
   ============================================================================= */
(function (global) {
  'use strict';

  /* Les mêmes identifiants que le jeu : c'est le même service, et la clé est
     publique par conception — elle n'autorise que l'appel de fonctions qui
     vérifient le jeton de l'appelant. */
  var SB_URL = 'https://fgaknciktmvywycrxtyz.supabase.co';
  var SB_CLE = 'sb_publishable_vB3-kOqMWGbyyrgS2yLZFQ_xu5IWQJq';
  var MAX_JOUEURS = 12;

  var TZ = global.TZ || null;
  var sb = null;
  var salon = null;

  /* ------------------------------------------------- petits utilitaires
     Recopiés plutôt qu'empruntés au moteur : ce fichier doit fonctionner sur
     sog.html, où le moteur n'est pas chargé. */
  function el(balise, classe, texte) {
    var n = document.createElement(balise);
    if (classe) n.className = classe;
    if (texte != null) n.textContent = texte;
    return n;
  }
  function vide(n) { while (n && n.firstChild) n.removeChild(n.firstChild); return n; }
  function q(sel) { return document.querySelector(sel); }

  /* Stockage : préfixe « training_ », comme tout le reste de la zone. */
  function lire(cle, defaut) {
    try {
      var v = localStorage.getItem('training_' + cle);
      return v == null ? defaut : JSON.parse(v);
    } catch (e) { return defaut; }
  }
  function ecrire(cle, valeur) {
    try { localStorage.setItem('training_' + cle, JSON.stringify(valeur)); } catch (e) {}
  }

  /* Un jeton propre à la zone. On ne réutilise pas celui du jeu : rejoindre
     un salon d'entraînement et une partie de culture générale en même temps
     doit rester possible. */
  function jeton() {
    var j = lire('salon_jeton', null);
    if (!j) {
      j = (global.crypto && crypto.randomUUID) ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });
      ecrire('salon_jeton', j);
    }
    return j;
  }

  function chargerSupabase() {
    if (sb) return Promise.resolve(sb);
    return import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
      .then(function (mod) {
        sb = mod.createClient(SB_URL, SB_CLE, {
          auth: { persistSession: false },
          realtime: { params: { eventsPerSecond: 5 } }
        });
        return sb;
      });
  }

  /* Les messages du serveur sont techniques : on les traduit. */
  function erreurLisible(e) {
    var m = (e && (e.message || e.error_description)) || '';
    if (/introuvable/i.test(m)) return 'Aucun salon ne porte ce code.';
    if (/deja commence/i.test(m)) return 'La partie a déjà commencé dans ce salon.';
    if (/complet/i.test(m)) return 'Ce salon est complet (douze joueurs).';
    if (/hote/i.test(m)) return 'Seul l’hôte peut régler ou lancer la partie.';
    if (/nom manquant/i.test(m)) return 'Choisissez un pseudo avant de continuer.';
    if (/aucune question/i.test(m)) return 'Rien à jouer avec ce réglage.';
    if (/Failed to fetch|NetworkError|load failed|dynamically imported/i.test(m)) {
      return 'Connexion impossible. Vérifiez votre accès à Internet.';
    }
    return m || 'Une erreur est survenue.';
  }

  /* ===================================================== ce que la page sait jouer
     Une « activité » est ce qu'un salon peut lancer. La page en déclare la
     liste : les épreuves sur training.html, les cartes sur sog.html. Le reste
     du module ne connaît que cette interface. */
  function activites() {
    var liste = [];

    if (TZ && TZ.app && TZ.app.epreuvesVisibles) {
      var cats = {};
      (TZ.app.CATEGORIES || []).forEach(function (c) { cats[c.id] = c.nom; });
      TZ.app.epreuvesVisibles().forEach(function (ep) {
        /* Une épreuve qui demande la carte du monde peut être indisponible :
           la proposer dans un salon ferait échouer la moitié des joueurs. */
        if (ep.requiert === 'carte' && TZ.carte && !TZ.carte.preparer()) return;
        liste.push({
          id: 'ep:' + ep.id,
          nom: ep.nom,
          groupe: cats[ep.categorie] || ep.categorie,
          reglable: true
        });
      });
    }

    if (global.TZ_SOG) {
      liste.push({
        id: 'sog', nom: 'Culture SOG', groupe: 'Révision',
        reglable: false
      });
    }
    return liste;
  }

  function activiteParId(id) {
    var l = activites();
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return l[0] || null;
  }

  /* --------------------------------------------------- réglages d'un salon
     Ils voyagent dans « categorie », qui est un champ texte libre côté
     serveur. On versionne le format (« tz1 ») : un client plus ancien qui
     tomberait sur un format inconnu le dira, au lieu de jouer autre chose
     que les autres. */
  function encoderReglages(r) {
    return ['tz1', r.activite, r.niveau || '-', r.stress || '-',
            String(r.graine || 0), String(r.taille || 0)].join('|');
  }

  function decoderReglages(texte) {
    var m = String(texte || '').split('|');
    if (m[0] !== 'tz1') return null;
    return { activite: m[1], niveau: m[2] === '-' ? null : m[2],
             stress: m[3] === '-' ? null : m[3],
             graine: parseInt(m[4], 10) || 0, taille: parseInt(m[5], 10) || 0 };
  }

  var NIVEAUX = ['decouverte', 'standard', 'confirme', 'expert'];
  var STRESS = [['calme', 'Calme'], ['modere', 'Modéré'], ['intense', 'Intense']];

  function libelleNiveau(activite, idNiveau) {
    if (activite && activite.indexOf('ep:') === 0 && TZ && TZ.app && TZ.app.libelleNiveau) {
      return TZ.app.libelleNiveau(activite.slice(3), idNiveau);
    }
    return idNiveau;
  }

  /* Ce qui part dans « questions ». Le serveur exige un tableau non vide :
     pour le SOG ce sont les cartes à réviser, pour une épreuve un simple
     jeton — le contenu, lui, se reconstitue à partir de la graine. */
  function chargeUtile(reglages) {
    if (reglages.activite === 'sog' && global.TZ_SOG) {
      return global.TZ_SOG.lotDefi(reglages.taille || 20);
    }
    return ['defi'];
  }

  /* ==================================================== l'écran du salon
     Construit à la demande, et inséré dans l'enveloppe de la page. Les deux
     pages ont des écrans différents (« tz-ecran » ici, « sog-ecran » là) :
     on masque les uns et les autres sans rien savoir de leur contenu. */
  var ecranSalon = null;

  function ecran() {
    if (ecranSalon) return ecranSalon;
    ecranSalon = el('section', 'tz-ecran tz-salon-ecran');
    ecranSalon.id = 'tz-ecran-salon';
    ecranSalon.hidden = true;
    var enveloppe = q('.tz-enveloppe') || document.body;
    enveloppe.appendChild(ecranSalon);
    return ecranSalon;
  }

  function montrerSalon(oui) {
    var e = ecran();
    Array.prototype.forEach.call(
      document.querySelectorAll('.tz-ecran, .sog-ecran'), function (s) {
        if (s !== e) s.hidden = !!oui;
      });
    e.hidden = !oui;
    if (oui) global.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function retourPage() {
    montrerSalon(false);
    if (TZ && TZ.app) { TZ.app.accueil(); TZ.app.ecran('accueil'); }
    else if (global.TZ_SOG && global.TZ_SOG.accueil) global.TZ_SOG.accueil();
  }

  function dire(texte, souci) {
    var z = q('#tz-salon-etat');
    if (!z) return;
    z.textContent = texte || '';
    z.className = 'tz-salon-etat' + (souci ? ' tz-souci' : '');
  }

  /* Une couleur stable par pseudo, reprise du jeu : le même joueur garde la
     sienne d'un rafraîchissement à l'autre, sans qu'il faille la stocker. */
  var TEINTES = ['#F5A623', '#4EA3F5', '#F27BA9', '#3ECF9B',
                 '#8B7BE8', '#2FC7C7', '#E8875A', '#A2578F'];
  function couleurDeNom(nom) {
    var s = 0, t = String(nom || '');
    for (var i = 0; i < t.length; i++) s = (s * 31 + t.charCodeAt(i)) >>> 0;
    return TEINTES[s % TEINTES.length];
  }

  function pseudo() {
    var champ = q('#tz-salon-pseudo');
    var v = champ ? (champ.value || '').trim() : '';
    if (!v) v = lire('salon_pseudo', '') || '';
    return v.trim();
  }

  /* ================================================ panneau sur l'accueil */
  function panneau(hote, repeindre) {
    var bloc = el('section', 'tz-panneau');
    bloc.appendChild(el('span', 'tz-etiquette', 'S’entraîner à plusieurs'));
    bloc.appendChild(el('p', null,
      'Créez un salon, partagez le code, et jouez tous la même épreuve : '
      + 'mêmes questions, mêmes réglages, classement en direct. '
      + 'Jusqu’à ' + MAX_JOUEURS + ' joueurs.'));

    var rangee = el('div', 'tz-salon-entree');

    var champPseudo = el('input', 'tz-salon-champ');
    champPseudo.id = 'tz-salon-pseudo';
    champPseudo.type = 'text';
    champPseudo.maxLength = 24;
    champPseudo.placeholder = 'Votre pseudo';
    champPseudo.value = lire('salon_pseudo', '') || '';
    rangee.appendChild(champPseudo);

    var champCode = el('input', 'tz-salon-champ tz-salon-code-saisie');
    champCode.id = 'tz-salon-code';
    champCode.type = 'text';
    champCode.maxLength = 6;
    champCode.placeholder = 'Code à 6 lettres';
    champCode.addEventListener('input', function () {
      champCode.value = champCode.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });
    rangee.appendChild(champCode);
    bloc.appendChild(rangee);

    var actions = el('div', 'tz-rangee');
    var bCreer = el('button', 'tz-btn', 'Créer un salon');
    bCreer.type = 'button';
    bCreer.addEventListener('click', function () { creer(); });
    actions.appendChild(bCreer);

    var bRejoindre = el('button', 'tz-btn tz-fantome', 'Rejoindre');
    bRejoindre.type = 'button';
    bRejoindre.addEventListener('click', function () { rejoindre(); });
    actions.appendChild(bRejoindre);
    bloc.appendChild(actions);

    bloc.appendChild(el('p', 'tz-salon-etat', ''));
    bloc.querySelector('.tz-salon-etat').id = 'tz-salon-etat';

    hote.appendChild(bloc);
    panneau.repeindre = repeindre || null;
  }

  /* ======================================================== salle d'attente */
  function peindreAttente() {
    if (!salon) { retourPage(); return; }
    var e = vide(ecran());

    var entete = el('div', 'tz-panneau');
    entete.appendChild(el('span', 'tz-etiquette', 'Salon'));

    var ligneCode = el('div', 'tz-salon-code');
    ligneCode.appendChild(el('b', null, salon.code));
    var bCopier = el('button', 'tz-btn tz-fantome tz-mini', 'Copier le code');
    bCopier.type = 'button';
    bCopier.addEventListener('click', function () {
      copier(salon.code, bCopier, 'Copier le code');
    });
    ligneCode.appendChild(bCopier);
    entete.appendChild(ligneCode);
    entete.appendChild(el('p', 'tz-vide',
      'Partagez ce code : les autres le saisissent dans « Rejoindre ».'));
    e.appendChild(entete);

    /* --- joueurs --- */
    var bJoueurs = el('div', 'tz-panneau');
    var presents = salon.joueurs || [];
    bJoueurs.appendChild(el('span', 'tz-etiquette',
      'Joueurs — ' + presents.length + ' sur ' + MAX_JOUEURS));
    var liste = el('div', 'tz-salon-joueurs');
    var moi = jeton();
    presents.forEach(function (j) {
      var d = el('div', 'tz-salon-joueur' + (j.jeton === moi ? ' tz-moi' : ''));
      var a = el('span', 'tz-salon-avatar',
                 String(j.nom || '?').trim().charAt(0).toUpperCase());
      a.style.background = couleurDeNom(j.nom);
      d.appendChild(a);
      d.appendChild(el('span', 'tz-salon-nom', j.nom));
      if (j.est_hote) d.appendChild(el('span', 'tz-salon-badge', 'hôte'));
      else if (j.jeton === moi) d.appendChild(el('span', 'tz-salon-badge', 'vous'));
      liste.appendChild(d);
    });
    for (var v = presents.length; v < Math.min(presents.length + 2, MAX_JOUEURS); v++) {
      var libre = el('div', 'tz-salon-joueur tz-salon-libre');
      libre.appendChild(el('span', 'tz-salon-avatar', '+'));
      libre.appendChild(el('span', 'tz-salon-nom', 'En attente…'));
      liste.appendChild(libre);
    }
    bJoueurs.appendChild(liste);
    e.appendChild(bJoueurs);

    /* --- réglages --- */
    e.appendChild(salon.hote ? reglagesHote() : reglagesInvite());

    /* --- actions --- */
    var pied = el('div', 'tz-panneau');
    pied.appendChild(el('p', 'tz-salon-etat', ''));
    pied.querySelector('.tz-salon-etat').id = 'tz-salon-etat';

    var r = el('div', 'tz-rangee');
    if (salon.hote) {
      var bLancer = el('button', 'tz-btn', 'Lancer la partie');
      bLancer.type = 'button';
      bLancer.disabled = presents.length < 2;
      bLancer.addEventListener('click', lancer);
      r.appendChild(bLancer);
    }
    var bQuitter = el('button', 'tz-btn tz-fantome', 'Quitter le salon');
    bQuitter.type = 'button';
    bQuitter.addEventListener('click', function () { quitter(); });
    r.appendChild(bQuitter);
    pied.appendChild(r);
    e.appendChild(pied);

    dire(salon.hote
      ? (presents.length < 2 ? 'En attente d’au moins un autre joueur…'
                             : 'Vous pouvez lancer la partie.')
      : 'En attente que l’hôte lance la partie…');

    montrerSalon(true);
  }

  function resumeReglages(r) {
    if (!r) return 'Réglages en cours de transmission…';
    var a = activiteParId(r.activite);
    var nom = a ? a.nom : r.activite;
    if (r.activite === 'sog') return nom + ' · ' + (r.taille || 20) + ' cartes';
    var bouts = [nom];
    if (r.niveau) bouts.push(libelleNiveau(r.activite, r.niveau));
    if (r.stress) {
      var s = STRESS.filter(function (x) { return x[0] === r.stress; })[0];
      bouts.push(s ? s[1] : r.stress);
    }
    return bouts.join(' · ');
  }

  function reglagesInvite() {
    var bloc = el('div', 'tz-panneau');
    bloc.appendChild(el('span', 'tz-etiquette', 'Épreuve choisie par l’hôte'));
    bloc.appendChild(el('p', null, resumeReglages(salon.reglages)));
    if (salon.reglages && !activiteParId(salon.reglages.activite)) {
      bloc.appendChild(el('p', 'tz-salon-souci',
        'Cette épreuve n’existe pas dans votre version de la page. '
        + 'Rechargez, ou demandez à l’hôte d’en choisir une autre.'));
    }
    return bloc;
  }

  function reglagesHote() {
    var bloc = el('div', 'tz-panneau');
    bloc.appendChild(el('span', 'tz-etiquette', 'Ce que vous allez jouer'));

    var r = salon.reglages || {};
    var dispo = activites();

    /* choix de l'épreuve, groupé par catégorie */
    var select = el('select', 'tz-salon-select');
    var groupes = {};
    dispo.forEach(function (a) {
      if (!groupes[a.groupe]) {
        groupes[a.groupe] = el('optgroup');
        groupes[a.groupe].label = a.groupe;
        select.appendChild(groupes[a.groupe]);
      }
      var o = el('option', null, a.nom);
      o.value = a.id;
      if (a.id === r.activite) o.selected = true;
      groupes[a.groupe].appendChild(o);
    });
    select.addEventListener('change', function () {
      pousserReglages({ activite: select.value });
    });
    bloc.appendChild(select);

    var courante = activiteParId(r.activite);

    if (courante && courante.reglable) {
      bloc.appendChild(el('span', 'tz-etiquette', 'Difficulté'));
      var segN = el('div', 'tz-segment');
      NIVEAUX.forEach(function (n) {
        var b = el('button', null, libelleNiveau(r.activite, n));
        b.type = 'button';
        b.setAttribute('aria-pressed', n === r.niveau ? 'true' : 'false');
        b.addEventListener('click', function () { pousserReglages({ niveau: n }); });
        segN.appendChild(b);
      });
      bloc.appendChild(segN);

      bloc.appendChild(el('span', 'tz-etiquette', 'Niveau de stress'));
      var segS = el('div', 'tz-segment');
      STRESS.forEach(function (s) {
        var b = el('button', null, s[1]);
        b.type = 'button';
        b.setAttribute('aria-pressed', s[0] === r.stress ? 'true' : 'false');
        b.addEventListener('click', function () { pousserReglages({ stress: s[0] }); });
        segS.appendChild(b);
      });
      bloc.appendChild(segS);
    } else if (r.activite === 'sog') {
      bloc.appendChild(el('span', 'tz-etiquette', 'Nombre de cartes'));
      var segT = el('div', 'tz-segment');
      [10, 20, 30].forEach(function (t) {
        var b = el('button', null, String(t));
        b.type = 'button';
        b.setAttribute('aria-pressed', t === (r.taille || 20) ? 'true' : 'false');
        b.addEventListener('click', function () { pousserReglages({ taille: t }); });
        segT.appendChild(b);
      });
      bloc.appendChild(segT);
    }

    bloc.appendChild(el('p', 'tz-vide',
      'Tout le monde joue le même tirage, aux mêmes réglages. '
      + 'Chacun à son rythme : le classement se met à jour en direct.'));
    return bloc;
  }

  function copier(texte, bouton, libelle) {
    function fini() {
      if (!bouton) return;
      bouton.textContent = 'Copié ✓';
      setTimeout(function () { bouton.textContent = libelle; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(fini, fini);
      return;
    }
    var t = document.createElement('textarea');
    t.value = texte; document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(t);
    fini();
  }

  /* ============================================================== actions */
  function reglagesParDefaut() {
    var premiere = activites()[0];
    return {
      activite: premiere ? premiere.id : 'sog',
      niveau: 'standard', stress: 'calme',
      graine: TZ && TZ.nouvelleGraine ? TZ.nouvelleGraine()
            : (Math.floor(Math.random() * 0x7FFFFFFF) || 1),
      taille: 20
    };
  }

  function creer() {
    var nom = pseudo();
    if (!nom) { dire('Choisissez un pseudo avant de créer un salon.', true); return; }
    dire('Création du salon…');
    ecrire('salon_pseudo', nom);

    var reglages = reglagesParDefaut();
    chargerSupabase().then(function () {
      return sb.rpc('generally_creer_salon', {
        p_jeton: jeton(), p_nom: nom,
        p_categorie: encoderReglages(reglages),
        p_niveau: NIVEAUX.indexOf(reglages.niveau),
        p_questions: chargeUtile(reglages)
      });
    }).then(function (r) {
      if (r.error) throw r.error;
      salon = { code: r.data, hote: true, reglages: reglages,
                joueurs: [], lance: false, charge: null };
      peindreAttente();
      ecouter();
      rafraichir();
    }).catch(function (e) { dire(erreurLisible(e), true); });
  }

  function rejoindre(codeDonne) {
    var nom = pseudo();
    var champ = q('#tz-salon-code');
    var code = (codeDonne || (champ ? champ.value : '') || '').trim().toUpperCase();
    if (!nom) { dire('Choisissez un pseudo avant de rejoindre.', true); return; }
    if (code.length !== 6) { dire('Un code comporte six caractères.', true); return; }
    dire('Connexion au salon…');
    ecrire('salon_pseudo', nom);

    chargerSupabase().then(function () {
      return sb.rpc('generally_rejoindre',
                    { p_code: code, p_jeton: jeton(), p_nom: nom });
    }).then(function (r) {
      if (r.error) throw r.error;
      var d = r.data;
      salon = { code: d.code, hote: !!d.hote,
                reglages: decoderReglages(d.categorie),
                joueurs: [], lance: false, charge: d.questions || null };
      peindreAttente();
      ecouter();
      rafraichir();
      if (d.etat === 'en_cours') demarrerPartie();
    }).catch(function (e) { dire(erreurLisible(e), true); });
  }

  /* L'hôte modifie un réglage : on l'applique localement d'abord, pour que
     l'écran réponde tout de suite, puis on le pousse. Changer d'épreuve
     retire la graine précédente — sinon deux parties de suite sur la même
     épreuve seraient identiques. */
  function pousserReglages(modif) {
    if (!salon || !salon.hote) return;
    var r = salon.reglages || reglagesParDefaut();
    Object.keys(modif).forEach(function (k) { r[k] = modif[k]; });
    if (modif.activite) {
      r.graine = TZ && TZ.nouvelleGraine ? TZ.nouvelleGraine()
               : (Math.floor(Math.random() * 0x7FFFFFFF) || 1);
    }
    salon.reglages = r;
    peindreAttente();
    dire('Réglages enregistrés…');

    sb.rpc('generally_reglages', {
      p_code: salon.code, p_jeton: jeton(),
      p_categorie: encoderReglages(r),
      p_niveau: Math.max(0, NIVEAUX.indexOf(r.niveau)),
      p_mode: 'libre', p_nb: 1, p_secondes: 20,
      p_questions: chargeUtile(r)
    }).then(function (res) {
      if (res.error) throw res.error;
      dire('');
    }).catch(function (e) { dire(erreurLisible(e), true); });
  }

  function lancer() {
    if (!salon || !salon.hote) return;
    dire('Lancement…');
    sb.rpc('generally_demarrer', { p_code: salon.code, p_jeton: jeton() })
      .then(function (r) { if (r.error) throw r.error; })
      .catch(function (e) { dire(erreurLisible(e), true); });
  }

  function quitter(silencieux) {
    if (!salon) return;
    var code = salon.code;
    clearInterval(salon.minuterie);
    if (salon.canal && sb) { try { sb.removeChannel(salon.canal); } catch (e) {} }
    salon = null;
    if (sb) sb.rpc('generally_quitter', { p_code: code, p_jeton: jeton() })
              .then(function () {}, function () {});
    if (!silencieux) retourPage();
  }

  /* ================================= écoute temps réel, avec repli régulier */
  function ecouter() {
    if (!salon || !sb) return;
    var code = salon.code;
    if (salon.canal) { try { sb.removeChannel(salon.canal); } catch (e) {} }

    salon.canal = sb.channel('salon-' + code)
      .on('postgres_changes',
          { event: '*', schema: 'public', table: 'generally_joueurs',
            filter: 'salon=eq.' + code },
          function () { rafraichir(); })
      .on('postgres_changes',
          { event: '*', schema: 'public', table: 'generally_salons',
            filter: 'code=eq.' + code },
          function (charge) {
            var n = charge && charge.new;
            if (!n) return;
            appliquerEtatSalon(n);
          })
      .subscribe();

    /* Le temps réel peut être bloqué par un pare-feu : on interroge aussi
       toutes les trois secondes, ce qui garantit que rien ne reste figé. */
    clearInterval(salon.minuterie);
    salon.minuterie = setInterval(rafraichir, 3000);
  }

  function appliquerEtatSalon(d) {
    if (!salon) return;
    /* Les réglages ne redescendent qu'aux INVITÉS. Chez l'hôte, qui vient de
       les modifier, ce rappel écraserait son choix avec la valeur encore en
       base au moment du sondage — et son réglage s'annulerait tout seul. */
    if (d.etat === 'attente' && !salon.hote) {
      var r = decoderReglages(d.categorie);
      if (r) salon.reglages = r;
      if (d.questions) salon.charge = d.questions;
      if (ecranSalon && !ecranSalon.hidden && !salon.lance) peindreAttente();
    } else if (d.questions && !salon.charge) {
      salon.charge = d.questions;
    }
    if (d.etat === 'en_cours' && !salon.lance) demarrerPartie();
  }

  function rafraichir() {
    if (!salon || !sb) return;
    var code = salon.code;

    sb.from('generally_joueurs')
      .select('jeton,nom,score,avancement,bonnes,fini,est_hote')
      .eq('salon', code).order('rejoint_le')
      .then(function (r) {
        if (!salon || salon.code !== code || r.error) return;
        salon.joueurs = r.data || [];
        if (salon.lance) peindreClassement();
        else if (ecranSalon && !ecranSalon.hidden) peindreAttente();
      });

    sb.from('generally_salons').select('etat,categorie,questions')
      .eq('code', code).maybeSingle()
      .then(function (r) {
        if (!salon || salon.code !== code || r.error || !r.data) return;
        appliquerEtatSalon(r.data);
      });
  }

  /* ============================================================ la partie */
  function demarrerPartie() {
    if (!salon || salon.lance) return;
    var r = salon.reglages;
    if (!r) { dire('Réglages illisibles : demandez à l’hôte de relancer.', true); return; }
    var a = activiteParId(r.activite);
    if (!a || a.id !== r.activite) {
      dire('Cette épreuve n’existe pas dans votre version de la page.', true);
      return;
    }
    salon.lance = true;
    salon.debut = Date.now();
    montrerSalon(false);

    if (r.activite === 'sog') {
      lancerSog(r);
    } else {
      lancerEpreuve(r);
    }
  }

  function lancerEpreuve(r) {
    if (!TZ || !TZ.app || !TZ.app.lancerDefi) { finirPartie(0, null); return; }
    var ok = TZ.app.lancerDefi(r.activite.slice(3), {
      niveau: r.niveau, stress: r.stress, graine: r.graine
    }, function (score, brut, hote) {
      finirPartie(score, hote);
    });
    if (!ok) { dire('Épreuve introuvable.', true); finirPartie(0, null); }
  }

  function lancerSog(r) {
    var ids = Array.isArray(salon.charge) ? salon.charge : [];
    if (!global.TZ_SOG || !ids.length) { finirPartie(0, null); return; }
    var ok = global.TZ_SOG.lancerDefi(ids, 'Défi · salon ' + salon.code,
      function (bilan, hote) { finirPartie(bilan.note, hote); });
    if (!ok) { dire('Cartes introuvables.', true); finirPartie(0, null); }
  }

  /* On pousse le score, puis on montre le classement. Le serveur garde le
     score tel qu'il est envoyé : c'est une note sur 100, la même pour tous,
     donc comparable. */
  function finirPartie(score, hoteBilan) {
    if (!salon) return;
    var secondes = Math.round((Date.now() - (salon.debut || Date.now())) / 1000);
    salon.monScore = score;
    salon.monTemps = secondes;

    if (sb) {
      sb.rpc('generally_maj_score', {
        p_code: salon.code, p_jeton: jeton(),
        p_score: Math.round(score) || 0, p_avancement: 1,
        p_bonnes: Math.round(score) || 0, p_fini: true
      }).then(function () { rafraichir(); }, function () {});
    }

    /* Le bilan de l'épreuve reste à l'écran : on y accroche un bouton plutôt
       que de l'effacer. Le joueur veut d'abord voir SON résultat. */
    if (hoteBilan) {
      var r = el('div', 'tz-rangee');
      var b = el('button', 'tz-btn', 'Voir le classement');
      b.type = 'button';
      b.addEventListener('click', peindreClassement);
      r.appendChild(b);
      hoteBilan.appendChild(r);
      setTimeout(function () {
        if (salon && salon.lance && !salon.classementVu) peindreClassement();
      }, 4000);
    } else {
      peindreClassement();
    }
  }

  function peindreClassement() {
    if (!salon) return;
    salon.classementVu = true;
    var e = vide(ecran());
    var moi = jeton();
    var lot = (salon.joueurs || []).slice()
      .sort(function (a, b) { return b.score - a.score; });
    var tousFinis = lot.length > 0 && lot.every(function (j) { return j.fini; });

    var bloc = el('div', 'tz-panneau');
    bloc.appendChild(el('span', 'tz-etiquette',
      (tousFinis ? 'Classement final' : 'Classement en direct')
      + ' · salon ' + salon.code));
    bloc.appendChild(el('p', null, resumeReglages(salon.reglages)));

    var ol = el('ol', 'tz-salon-classement');
    lot.forEach(function (j, i) {
      var li = el('li', (j.jeton === moi ? 'tz-moi ' : '')
                      + (j.fini ? 'tz-fini' : 'tz-encours'));
      li.appendChild(el('span', 'tz-salon-rang', String(i + 1)));
      var a = el('span', 'tz-salon-avatar',
                 String(j.nom || '?').trim().charAt(0).toUpperCase());
      a.style.background = couleurDeNom(j.nom);
      li.appendChild(a);
      li.appendChild(el('span', 'tz-salon-nom', j.nom));
      li.appendChild(el('span', 'tz-salon-score',
        j.fini ? j.score + ' / 100' : 'en cours…'));
      ol.appendChild(li);
    });
    bloc.appendChild(ol);

    if (!tousFinis) {
      bloc.appendChild(el('p', 'tz-vide',
        'Le classement se complète à mesure que les autres terminent.'));
    }
    e.appendChild(bloc);

    var pied = el('div', 'tz-panneau');
    var r = el('div', 'tz-rangee');
    if (salon.hote) {
      var bRelancer = el('button', 'tz-btn', 'Rejouer dans ce salon');
      bRelancer.type = 'button';
      bRelancer.addEventListener('click', relancer);
      r.appendChild(bRelancer);
    }
    var bQuitter = el('button', 'tz-btn tz-fantome', 'Quitter le salon');
    bQuitter.type = 'button';
    bQuitter.addEventListener('click', function () { quitter(); });
    r.appendChild(bQuitter);
    pied.appendChild(r);
    pied.appendChild(el('p', 'tz-salon-etat', ''));
    pied.querySelector('.tz-salon-etat').id = 'tz-salon-etat';
    e.appendChild(pied);

    montrerSalon(true);
  }

  /* Rejouer : le serveur n'offre pas de remise à zéro, et en inventer une
     obligerait à toucher la base du jeu. On quitte donc proprement et on
     recrée un salon — le code change, mais rien d'autre. */
  function relancer() {
    if (!salon || !salon.hote) return;
    var reglages = salon.reglages;
    quitter(true);
    chargerSupabase().then(function () {
      var r = reglages || reglagesParDefaut();
      r.graine = TZ && TZ.nouvelleGraine ? TZ.nouvelleGraine()
               : (Math.floor(Math.random() * 0x7FFFFFFF) || 1);
      return sb.rpc('generally_creer_salon', {
        p_jeton: jeton(), p_nom: lire('salon_pseudo', 'Hôte'),
        p_categorie: encoderReglages(r),
        p_niveau: Math.max(0, NIVEAUX.indexOf(r.niveau)),
        p_questions: chargeUtile(r)
      }).then(function (res) {
        if (res.error) throw res.error;
        salon = { code: res.data, hote: true, reglages: r,
                  joueurs: [], lance: false, charge: null };
        peindreAttente();
        ecouter();
        rafraichir();
      });
    }).catch(function (e) {
      retourPage();
      global.alert(erreurLisible(e));
    });
  }

  /* On prévient le serveur en partant : un salon qui garde des joueurs
     fantômes n'est jamais complet pour personne. */
  global.addEventListener('beforeunload', function () {
    if (salon && sb) {
      try {
        sb.rpc('generally_quitter', { p_code: salon.code, p_jeton: jeton() });
      } catch (e) {}
    }
  });

  /* ======================================== greffe automatique sur sog.html
     Sur training.html, c'est l'accueil qui appelle TZ.salon.panneau() au bon
     endroit. Sur sog.html, l'accueil est construit par tz-sog.js, qui ne
     connaît pas ce module : on pose donc le panneau nous-mêmes, à la suite de
     l'écran d'accueil, hors du conteneur que tz-sog.js repeint. Sinon il
     disparaîtrait au premier retour au menu. */
  function greffer() {
    if (TZ && TZ.app) return;                 /* training.html s'en charge */
    if (!global.TZ_SOG) return;               /* ni l'une ni l'autre page */
    var accueil = q('#sog-ecran-accueil');
    if (!accueil || accueil.querySelector('.tz-salon-greffe')) return;
    var boite = el('div', 'tz-salon-greffe');
    panneau(boite, null);
    accueil.appendChild(boite);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', greffer);
  } else { greffer(); }

  TZ_SALON_PUBLIC();
  function TZ_SALON_PUBLIC() {
    var api = {
      panneau: panneau,
      ouvrir: function () { if (salon) peindreAttente(); },
      rejoindre: rejoindre,
      actif: function () { return !!salon; }
    };
    if (TZ) TZ.salon = api;
    global.TZ_SALON = api;
  }

})(window);
