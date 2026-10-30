# Cerveau — règles pour Claude Code

Le cerveau de Mats vit dans `brain/` : une fiche markdown par élément, un fait par ligne, des liens `[[...]]`.
Il est visible en 3D sur https://mystarten.github.io/Generally-/cerveau/ et en direct en local avec `node server.js`.

## Structure

- Le profil `brain/profile.md` est le centre.
- Cinq axes (les gros nœuds, dans `brain/hubs/`) : `gign`, `sport`, `entrepreneuriat`, `etudes-audencia`, `developpement-perso`.
- Toute autre fiche appartient à un axe (`axis:` dans le frontmatter) et forme un petit nuage autour de lui.
- Types : `hub` (axe), `area` (domaine), `project`, `person`, `topic` (sujet, objectif, record, outil, lieu, voyage), `agent` (agent IA).

## Règles

1. **Consulte avant de répondre.** Avant de répondre à une question qui concerne Mats (projets, objectifs,
   clients, sport, concours, agents), lance `node brain.js search "<mot>"`, et `node brain.js show <nom>` pour le détail.

2. **Écris tout de suite.** Dès que Mats donne une information durable (objectif, décision, projet, personne,
   outil, agent IA, record, date, voyage), écris-la avec `node brain.js add`, sans lui demander, puis dis-lui
   en **une seule ligne** ce que tu as ajouté.
   La commande publie seule : commit, push, page en ligne. Vérifie que sa sortie dit
   `publie sur ... + main (page en ligne)`. Si elle dit `ECRIT MAIS PAS PUBLIE`, dis-le à Mats, ne l'ignore pas.

3. **Ne note que ce que Mats a dit lui-même.** Pas de déduction, pas d'interprétation.

4. **Range et relie.** Donne toujours un axe (`--axis`) et au moins un lien vers un élément existant (`--link`).
   Complète une fiche existante (même `--name`) plutôt que d'en créer une presque pareille.
   Mais quand un sujet mérite d'être vu (une personne, un projet, un record, un voyage), crée-lui son propre
   petit nœud : le graphe doit rester détaillé.

5. **Une info qui change s'ajoute, datée.** Nouveau record : `--fact "Novembre 2026 : 38 tractions strictes"`.
   Ne supprime pas l'ancien fait sauf si Mats le demande. Une contradiction va dans « À vérifier »
   (`--tag verify`), tu ne tranches pas.

6. **Ne supprime que sur demande** : `node brain.js remove <nom exact>`.

7. **Jamais de secrets** : numéro de carte, identifiant, adresse e-mail, mot de passe, clé d'API.
   `brain.js` refuse déjà ces lignes, ne le contourne pas.

8. Après une série d'ajouts, `node brain.js check` : aucun lien cassé, aucun nœud isolé.

## Commandes

```bash
node brain.js add --type topic --name tractions --axis sport --fact "..." --link street-workout,chipster
node brain.js search "gendarmerie"
node brain.js show concours-sog
node brain.js remove "nom exact"
node brain.js import ./notes
node brain.js list
node brain.js check
node brain.js publish
node server.js
```

`add`, `remove` et `import` publient d'eux-mêmes. `--no-push` (ou `BRAIN_NO_PUSH=1`) pour ne rien envoyer,
par exemple dans un test.
