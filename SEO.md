# Generally — stratégie de référencement

Document de travail. Il décrit ce qui est **en place**, ce qui est **recommandé**,
et les limites honnêtes de l'exercice.

> **Avertissement sur les volumes de recherche.** Aucun chiffre de volume n'est
> donné dans ce document. Les outils fiables (Google Keyword Planner, Ahrefs,
> Semrush) n'ont pas été consultés. Les priorités ci-dessous reposent sur
> l'**intention de recherche** et sur l'observation des pages qui se positionnent
> réellement, pas sur des volumes supposés. Toute estimation chiffrée serait
> inventée, donc inutilisable.

---

## 1. Audit de départ

| Point | État avant | État après |
|---|---|---|
| `robots.txt` | absent | créé |
| `sitemap.xml` | absent | créé, 8 URL |
| `<link rel="canonical">` | absent | sur toutes les pages |
| Page 404 | absente | créée, `noindex, follow` |
| Balises `h1` | **5 dans le même document** | 1 par page |
| Contenu indexable | **aucun** — les 888 questions vivent dans des fichiers `.js` | 7 pages HTML statiques |
| Données structurées | aucune | WebSite, WebApplication, BreadcrumbList, Article, FAQPage |
| `og:url`, `og:image` absolue | absentes / relative | présentes |
| Liens internes vers du contenu | aucun | pied de page de l'accueil |

### Le problème central

Pour un moteur, le site était **une seule page intitulée « Generally »**, sans
contenu. Les 888 questions et leurs explications — le véritable actif éditorial —
n'existaient que dans des tableaux JavaScript. Google sait exécuter du JavaScript,
mais il n'y avait de toute façon **aucune URL distincte** à proposer pour
« quiz histoire » ou « questions de culture générale ».

### Deux limites structurelles qui subsistent

**Le nom de domaine.** `mystarten.github.io/Generally-/` est un sous-répertoire
d'un sous-domaine partagé. C'est un handicap réel : pas de domaine propre à faire
mûrir, une URL peu engageante dans les résultats, et un tiret final disgracieux.
**Acheter un domaine (10–15 €/an) est l'action au meilleur rapport effort/impact
de toute cette liste.** Tant que ce n'est pas fait, le reste plafonne.

**La concurrence.** Le créneau français du quiz de culture générale est occupé par
des sites installés : quizo.fr, evalquiz.com, culture-generale.fr, quizz.biz,
laculturegenerale.com. Viser « quiz culture générale » en requête principale à
court terme n'est pas réaliste. La traîne longue, elle, est atteignable.

---

## 2. Carte des mots-clés

Colonne **État** : `fait` = page en ligne, `phase 2` / `phase 3` = recommandé.

### A. Recherche de quiz — intention transactionnelle

| Requête | Intention | Page cible | Priorité | Type | Lien au jeu | État |
|---|---|---|---|---|---|---|
| quiz culture générale | jouer | `/quiz/culture-generale/` | haute | page pilier | direct | fait |
| quiz culture générale gratuit | jouer | `/quiz/culture-generale/` | haute | page pilier | direct | fait |
| quiz histoire | jouer | `/quiz/histoire/` | haute | page thème | `?quiz=histoire` | fait |
| quiz géographie | jouer | `/quiz/geographie/` | haute | page thème | `?quiz=geographie` | fait |
| quiz sciences | jouer | `/quiz/sciences/` | haute | page thème | `?quiz=sciences` | fait |
| quiz sport | jouer | `/quiz/sport/` | moyenne | page thème | `?quiz=sport` | phase 2 |
| quiz astronomie | jouer | `/quiz/astronomie/` | moyenne | page thème | `?quiz=astronomie` | phase 2 |
| quiz art et culture | jouer | `/quiz/arts/` | moyenne | page thème | `?quiz=arts` | phase 2 |
| quiz en ligne à plusieurs | jouer | `/quiz/multijoueur/` | moyenne | page produit | salon en ligne | phase 2 |

### B. Recherche de questions — intention de consultation

C'est le format qui se positionne le mieux aujourd'hui dans ce créneau : des
pages qui **affichent réellement les questions et les réponses** en HTML.

| Requête | Intention | Page cible | Priorité | Type | Lien au jeu | État |
|---|---|---|---|---|---|---|
| questions culture générale avec réponses | lire | `/questions/culture-generale-avec-reponses/` | haute | liste Q/R | appel vers le jeu | fait |
| questions de culture générale | lire | `/questions/culture-generale-avec-reponses/` | haute | liste Q/R | appel vers le jeu | fait |
| 20 questions culture générale | lire | `/questions/20-questions-culture-generale/` | moyenne | liste courte | appel | phase 2 |
| questions culture générale difficiles | lire | `/questions/culture-generale-difficiles/` | moyenne | liste niveau 3 | `?quiz=toutes` | phase 2 |
| questions réponses histoire de France | lire | `/questions/histoire-de-france/` | moyenne | liste Q/R | `?quiz=histoire` | phase 3 |

### C. Recherche d'apprentissage — intention informationnelle

Créneau dominé par des blogs généralistes (Indeed, ELLE, Sherpas) aux conseils
interchangeables. **Generally a un angle qu'ils n'ont pas : un outil réel.**

| Requête | Intention | Page cible | Priorité | Type | Lien au jeu | État |
|---|---|---|---|---|---|---|
| comment améliorer sa culture générale | apprendre | `/guides/comment-ameliorer-sa-culture-generale/` | haute | guide | défi du jour | fait |
| avoir une bonne culture générale | apprendre | idem | haute | guide | défi du jour | fait |
| réviser la culture générale | apprendre | `/guides/reviser-la-culture-generale/` | moyenne | guide | révision | phase 2 |
| comment mémoriser des informations | apprendre | `/guides/comment-memoriser/` | moyenne | guide | révision | phase 3 |
| culture générale concours | apprendre | `/guides/culture-generale-concours/` | moyenne | guide | niveau expert | phase 3 |

### D. Recherche thématique — traîne longue

C'est là que les gains sont les plus accessibles.

| Requête | Intention | Page cible | Priorité | Type | Lien au jeu | État |
|---|---|---|---|---|---|---|
| quiz capitales du monde | jouer | `/quiz/geographie/capitales/` | haute | sous-thème | `?quiz=geographie` | phase 2 |
| quiz histoire de France | jouer | `/quiz/histoire/france/` | haute | sous-thème | `?quiz=histoire` | phase 2 |
| quiz drapeaux | jouer | `/quiz/geographie/` | basse | — | — | sans objet |
| quiz système solaire | jouer | `/quiz/astronomie/` | moyenne | page thème | `?quiz=astronomie` | phase 2 |
| quiz seconde guerre mondiale | jouer | `/quiz/histoire/` | moyenne | section | `?quiz=histoire` | phase 3 |

> **Note sur « quiz drapeaux » :** le type de question « drapeau » a été retiré du
> jeu (Windows ne fournit pas les emojis correspondants). Créer une page sur ce
> thème serait promettre un contenu inexistant.

### E. Recherche informationnelle pure — à ne PAS viser pour l'instant

Requêtes du type « quelle est la capitale de l'Australie ? ». Elles sont traitées
directement par les moteurs dans un encadré de réponse. Créer **une page par
question** produirait des centaines de pages très courtes et très similaires :
c'est le profil exact que les systèmes anti-contenu-pauvre de Google ciblent.

**Recommandation : ne pas le faire.** L'alternative retenue — regrouper les
questions par thème sur des pages substantielles — capte la même intention sans
le risque. À revoir seulement si une page thématique démontre une traction réelle.

---

## 3. Architecture

```
/                                              le jeu (application JavaScript)
├── quiz/                                      hub des thèmes
│   ├── culture-generale/                      ◄ page pilier
│   ├── histoire/
│   ├── geographie/
│   └── sciences/
├── questions/
│   └── culture-generale-avec-reponses/
├── guides/
│   └── comment-ameliorer-sa-culture-generale/
├── robots.txt
├── sitemap.xml
├── 404.html
└── pages.css                                  style partagé des pages de contenu
```

**Règle tenue :** une URL = un sujet principal. Aucune page ne mélange un thème
de quiz et des conseils d'apprentissage.

**Maillage :** l'accueil renvoie vers les 7 pages (pied de page) ; le pilier
renvoie vers les thèmes et le guide ; chaque thème renvoie vers les autres thèmes,
le pilier et le guide ; le guide renvoie vers les quiz.

---

## 4. Ce qui est implémenté

| Fichier | Nature |
|---|---|
| `robots.txt` | nouveau |
| `sitemap.xml` | nouveau — 8 URL |
| `404.html` | nouveau |
| `pages.css` | nouveau — reprend les jetons de design du jeu |
| `SEO.md` | nouveau — ce document |
| `quiz/index.html` | nouveau |
| `quiz/culture-generale/index.html` | nouveau — pilier, ~1 050 mots |
| `quiz/histoire/index.html` | nouveau — ~1 040 mots, 22 questions réelles |
| `quiz/geographie/index.html` | nouveau — ~960 mots, 22 questions réelles |
| `quiz/sciences/index.html` | nouveau — ~1 010 mots, 22 questions réelles |
| `questions/culture-generale-avec-reponses/index.html` | nouveau — ~1 690 mots, 40 questions |
| `guides/comment-ameliorer-sa-culture-generale/index.html` | nouveau — ~810 mots, FAQ |
| `index.html` | modifié — canonical, og:url, JSON-LD, un seul `h1`, pied de liens, `?quiz=` |
| `sw.js` | modifié — **correction d'un bug** (voir ci-dessous) |

### Un bug corrigé au passage

Le service worker mettait **toute** réponse de navigation en cache sous la clé
`./index.html`. Avec une seule page, sans conséquence. Avec sept pages de contenu,
visiter `/quiz/histoire/` remplaçait le jeu dans le cache : hors connexion,
l'utilisateur obtenait la page histoire à la place du jeu. Corrigé, et version du
cache passée à `generally-v2`.

### Contenu : d'où il vient

Les questions affichées sur les pages sont **extraites de la vraie banque** par un
script (`seo_contenu.py`, dans le dossier de travail de session). Rien n'est
inventé : chaque question, réponse et explication existe dans le jeu. Les pages se
régénèrent en relançant le script après un ajout de questions.

Les types « carte » (cliquer un pays, placer un point) sont exclus de ces pages :
ils ne se lisent pas en texte.

---

## 5. Google

### Fondamentaux couverts
Crawlabilité (liens HTML réels), indexabilité (pages statiques), architecture
d'URL propre, maillage interne, un `h1` par page, hiérarchie `h2`/`h3`, données
structurées conformes au contenu visible, HTML sémantique (`header`, `nav`,
`main`, `article`, `footer`).

### Checklist Search Console — à faire manuellement

1. Ouvrir [Google Search Console](https://search.google.com/search-console) et
   ajouter la propriété **préfixe d'URL** `https://mystarten.github.io/Generally-/`.
   *(La validation par DNS est impossible : le domaine appartient à GitHub.)*
2. Valider par **balise HTML** — elle est à coller dans le `<head>` de `index.html`.
3. Soumettre le sitemap : `sitemap.xml`.
4. Inspecter les 7 URL une par une, puis **demander l'indexation**.
5. Revenir au bout de deux à quatre semaines consulter le rapport *Performances* :
   ce sont les requêtes réellement affichées qui guideront la phase 2, pas les
   suppositions de ce document.

---

## 6. Bing et Copilot

Bing alimente Copilot, et son indexation est souvent plus rapide que celle de
Google sur les sites jeunes.

1. [Bing Webmaster Tools](https://www.bing.com/webmasters) → **importer depuis
   Google Search Console** (le plus simple, une fois l'étape 5 ci-dessus faite).
2. Soumettre le sitemap.
3. **IndexNow** : Bing accepte une notification immédiate de publication. Pour un
   site statique sur GitHub Pages, il faut déposer un fichier de clé à la racine
   et appeler une URL à chaque mise à jour. **Recommandé en phase 2**, pas
   indispensable tant que le rythme de publication est faible.

---

## 7. Recherche assistée par IA

### Ce qui a été fait
- `robots.txt` autorise explicitement `OAI-SearchBot` (recherche ChatGPT),
  `PerplexityBot`, `ClaudeBot`, `Google-Extended` et `GPTBot`.
- Chaque page est **autonome** : elle se comprend sans avoir à lancer une partie,
  sans contexte extérieur, et sans JavaScript.
- Les informations importantes sont **explicites dans le HTML**, pas calculées au
  chargement.
- La réponse à la question posée par le titre arrive **dès le premier paragraphe**
  (exemple : le guide commence par « La réponse courte : … »).
- Les faits sont vérifiables et les entités nommées de façon cohérente.

### Ce qui n'a pas été fait, volontairement
Aucun texte destiné à influencer un modèle. Aucune instruction cachée, aucun
bloc « à destination des IA », aucune répétition artificielle du nom de marque.
Ces pratiques sont détectables, contraires aux consignes des éditeurs, et sans
effet durable.

### Attente réaliste
Être cité par un assistant dépend d'abord d'être **indexé et jugé fiable** par le
moteur sous-jacent. Il n'existe aucun levier direct. Les bonnes pratiques
ci-dessus augmentent la probabilité ; elles ne la garantissent pas.

### Note sur `GPTBot`
Il sert à l'**entraînement** de modèles, ce qui est une décision distincte du
référencement. Il est autorisé par défaut ; le retirer de `robots.txt` n'aurait
aucun effet négatif sur la visibilité dans ChatGPT Search, qui utilise
`OAI-SearchBot`.

---

## 8. Mesure

**Rien n'a été installé**, et c'est délibéré : en France, un traqueur publicitaire
ou Google Analytics impose une bannière de consentement conforme au RGPD. En
installer un sans cette bannière serait une non-conformité.

**Recommandation** : commencer par **Cloudflare Web Analytics** ou **Plausible**,
qui fonctionnent sans cookie et ne déclenchent donc pas l'obligation de
consentement. Google Analytics devient pertinent plus tard, avec un gestionnaire
de consentement.

Indicateurs à suivre, dans l'ordre d'importance :
1. impressions et clics par requête (Search Console) ;
2. pages d'entrée organiques ;
3. clics depuis une page de contenu vers le jeu (`?quiz=`, `?lancer=`) ;
4. parties terminées.

---

## 9. Feuille de route

### Phase 1 — Fondations *(faite)*
Technique SEO, page pilier, trois pages de thème, page de questions, guide,
maillage, liens profonds vers le jeu.
**Dépendance restante :** inscription à Search Console et Bing Webmaster Tools.

### Phase 2 — Élargir *(1 à 2 mois)*
- Acheter un nom de domaine et le brancher. **Priorité absolue.**
- Pages de thème manquantes : sport, astronomie, arts, politique, géopolitique.
- Sous-thèmes à forte intention : `/quiz/geographie/capitales/`,
  `/quiz/histoire/france/`.
- Page produit : `/quiz/multijoueur/` — le salon à code d'invitation est un
  argument que peu de concurrents ont.
- Guide `/guides/reviser-la-culture-generale/`.
- IndexNow pour Bing.
- Image de partage dédiée (1200 × 630) : l'icône carrée actuelle fait un aperçu
  médiocre sur les réseaux.

**Déclencheur :** n'écrire ces pages qu'après avoir lu le rapport *Performances*
de Search Console. Il dira quelles requêtes ramènent réellement du monde.

### Phase 3 — Autorité *(3 à 6 mois)*
- Guides d'apprentissage supplémentaires, un par mois, pas davantage.
- Sous-thèmes historiques et géographiques selon les données réelles.
- Liens entrants : annuaires de jeux éducatifs, forums d'enseignants, communautés
  de préparation aux concours. C'est le facteur le plus lent et le plus décisif.

---

## 10. Ce qu'il ne faut pas faire

- Générer une page par question (centaines de pages pauvres et similaires).
- Multiplier les pages de thème sans contenu réellement distinct.
- Répéter les mots-clés au-delà de ce que la langue exige.
- Promettre une position. Personne ne la contrôle.

---

## 11. Régénérer les pages

Les pages de contenu sont produites par script à partir de la banque de questions.
Après un ajout de questions, les régénérer pour que les compteurs et les
échantillons restent exacts. Les scripts se trouvent dans le dossier de travail de
session ; les recopier dans le dépôt s'ils doivent durer.
