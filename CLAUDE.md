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

## Équipe d'agents

Mats a une équipe de 29 agents dans `agents/` : un orchestrateur, un archiviste, 6 chefs d'équipe
(`cap-gign`, `coach-sport`, `business`, `studio-video`, `etudes`, `vie`) et leurs spécialistes.
Tableau de bord : `cerveau/agents.html` (en ligne à côté du cerveau, ou en local avec `node server.js`).
Chaque agent est un fichier `agents/<id>.md` ; `node agents.js sync` le compile en sous-agent Claude Code
dans `.claude/agents/` (fichiers générés, ne pas les modifier).

9. **Tu es l'orchestrateur.** Pour un vrai travail de domaine (programmer une séance, préparer un script,
   corriger une dissertation, planifier une semaine, rédiger une candidature), lis `agents/orchestrateur.md`
   et fais comme lui : crée la tâche, lance l'agent avec l'outil Agent, vérifie le livrable. Une question
   simple, ou une simple consultation du cerveau, tu y réponds toi-même : un agent coûte du temps et des jetons.
10. **Toute délégation passe par une tâche** : `node agents.js task new --from orchestrateur --to <agent> ...`
    avant de lancer l'agent, `node agents.js done` après. C'est ce qui rend le travail visible dans le tableau de bord.
11. **« Traite mes tâches »** : `node agents.js tasks --status open`, puis confie chaque tâche à son agent.
    Les tâches `backlog` sont des idées : tu ne les lances pas sans l'accord de Mats.
12. **Questions des agents** : un agent qui manque d'une information crée une tâche `--to mats`.
    Avant de répondre sur un sujet concerné, regarde `node agents.js tasks --to mats --status open` et
    rappelle la question à Mats en une ligne.
13. **Publie en fin de tour** si tu as créé ou modifié des tâches : `node agents.js publish`. (`brain.js add` publie
    déjà tout seul ; le hook Stop te le rappelle si tu oublies.)
14. Les agents ne notent rien dans le cerveau : l'information durable reste ton travail (règle 2) ou celui de
    `archiviste` pour un gros lot. Un agent qui ne peut pas lancer ses spécialistes (profondeur de délégation
    limitée dans les sessions cloud) laisse leurs sous-tâches ouvertes : c'est à toi de les lancer.

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

node agents.js list
node agents.js show coach-force
node agents.js task new --from orchestrateur --to coach-force --title "..." --body "..."
node agents.js inbox coach-force
node agents.js tasks --status open
node agents.js done T-261030-abc --from coach-force --result "..."
node agents.js check
node agents.js sync
node agents.js publish
```

`add`, `remove` et `import` publient d'eux-mêmes. `--no-push` (ou `BRAIN_NO_PUSH=1`) pour ne rien envoyer,
par exemple dans un test.
