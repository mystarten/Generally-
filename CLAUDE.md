# Cerveau — règles pour Claude Code

Un cerveau vivant est stocké dans `brain/` (markdown, un fait par ligne, liens `[[...]]`).
L'interface graphe se lance avec `node server.js` (http://localhost:3000) et se met à jour en direct.

## Règles

1. **Consulte avant de répondre.** Avant de répondre à une question qui me concerne
   (projets, objectifs, clients, agents IA, études, sport), lance
   `node brain.js search "<mot>"` et appuie-toi sur ce que tu trouves.
   Pour le détail d'un élément : `node brain.js show <nom>`.

2. **Écris dès que je donne une information durable.** Objectif, décision, projet,
   personne, outil, agent IA → écris-la immédiatement avec `node brain.js add`,
   sans me demander la permission, puis dis-moi en **une seule ligne** ce que tu as ajouté.

3. **Ne note que ce que j'ai dit moi-même.** Pas de déductions, pas d'interprétations,
   pas de reformulations qui ajoutent du sens. Si tu n'es pas sûr d'avoir compris,
   note la phrase telle que je l'ai dite.

4. **Relie.** Quand un nouvel élément concerne un élément déjà présent, ajoute le lien
   `[[...]]` (via `--link`), dans les deux sens si c'est utile.

5. **Publie.** Juste apres avoir ecrit dans le cerveau, lance `node brain.js publish`.
   Ca regenere `cerveau/data.json` et pousse sur GitHub : la page en ligne se met a jour
   toute seule une minute plus tard. Si rien n'a change, la commande ne fait rien.

6. **Jamais de secrets.** Aucun numéro de carte, identifiant, mot de passe, clé d'API
   ou token dans `brain/`. (`brain.js` refuse déjà ces lignes, ne le contourne pas.)

## Commandes

```bash
node brain.js add --type area --name starten --fact "..." --link zenithia,capafy
node brain.js search "gendarmerie"
node brain.js show starten
node brain.js import ./notes
node brain.js list
node brain.js publish
node server.js
```

`--type` : `profile` · `area` (domaine, projet) · `person` · `topic` (sujet, objectif) · `agent` (agent IA).
Le fichier est créé s'il n'existe pas, sinon la ligne est ajoutée — jamais en double.
