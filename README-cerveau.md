# Cerveau

Le cerveau de Mats en 3D : un noyau, cinq grands axes, et autour de chacun un nuage de petits nœuds
(projets, personnes, records, voyages, outils), tous reliés entre eux.
Les notes vivent dans `brain/`. Chaque information ajoutée est publiée aussitôt.

## Voir le cerveau

**En ligne, rien à lancer** : https://mystarten.github.io/Generally-/cerveau/

Page non référencée (`noindex`, absente du sitemap, aucun lien depuis le site).
Elle reste **techniquement publique** : qui a le lien peut lire.
Elle lit `cerveau/data.json`, régénéré et poussé à chaque écriture. Compter environ 1 minute après le push.

**En local, en direct** : double-clic sur `demarrer-cerveau.command` (macOS) ou `demarrer-cerveau.bat` (Windows).
Ou bien :

```bash
node server.js
```

Puis http://localhost:3000. La même page sert les deux usages : si un serveur répond, elle passe en direct
par Server-Sent Events ; sinon elle affiche le dernier instantané publié.

## Se déplacer

| Action | Souris / clavier | Tactile |
|---|---|---|
| Tourner autour | glisser | 1 doigt |
| Zoomer | molette | pincer |
| Déplacer la vue | clic droit + glisser, ou Maj + glisser | 2 doigts |
| Voler librement | ZQSD (WASD en QWERTY), flèches | |
| Monter / descendre | Espace / Maj | |
| Ouvrir un nœud | clic | toucher |
| Déplacer un nœud | glisser le nœud | glisser le nœud |
| Vue d'ensemble | double-clic dans le vide, ou « Recentrer » | « Recentrer » |
| Rechercher | `/` | barre de recherche |

**Explorer** lance une visite animée : le noyau, puis chaque axe et ses nœuds les plus reliés, avec une
légende. Flèches pour avancer ou reculer, Espace pour la pause, Échap pour sortir.

Les calques (à gauche) masquent un axe ou un type de nœud. Survoler un nœud surligne ses voisins ;
un nœud ajouté apparaît près de ses voisins, un nœud modifié pulse.

## Capturer

```bash
node brain.js add --type topic --name tractions --axis sport --fact "Novembre 2026 : 38 strictes" --link street-workout
node brain.js add --type person --name "Prénom" --axis entrepreneuriat --fact "..." --link starten
node brain.js remove "nom exact"
```

Types : `hub` (axe), `area`, `project`, `person`, `topic`, `agent`.
Options : `--axis` `--fact` `--link a,b` `--description` `--alias x,y` `--tag verify` `--no-push`.

La fiche est créée si elle n'existe pas, sinon le fait est ajouté, jamais en double.
Les lignes qui ressemblent à un numéro de carte, une adresse e-mail, un identifiant ou un mot de passe
sont **refusées**.

## Publication automatique

`add`, `remove` et `import` régénèrent `cerveau/data.json`, commitent et poussent sur la branche courante.
Si cette branche n'est pas `main`, ils poussent aussi sur `main` (c'est elle que GitHub Pages publie),
mais seulement en avance rapide : `main` n'est jamais écrasée.

Si quelqu'un a poussé entre-temps (une autre machine, une autre session), `brain.js` récupère ses
changements avant de pousser. Les fiches `brain/*.md` fusionnent en gardant les lignes des deux côtés
(`merge=union` dans `.gitattributes`) et `data.json` est régénéré. Un vrai conflit annule le rebase :
le dépôt n'est jamais laissé à moitié rebasé.

Sans réseau, le fait est écrit, la commande sort avec le code 3 et l'indique.
`node brain.js publish` rattrape ensuite le retard.

## Consulter

```bash
node brain.js search "gendarmerie"
node brain.js show concours-sog
node brain.js list
node brain.js check        # liens cassés, nœuds sans axe ou isolés
```

## Importer

```bash
node brain.js import ./notes
node brain.js import ./export.md
```

Même format. Fusionne : complète description, aliases et axe manquants, ajoute les faits absents,
**n'écrase jamais** un fait présent.

## Format d'une fiche

```markdown
---
name: Chipster
description: Pote et partenaire d'entraînement, partage l'objectif GIGN
aliases: [binôme]
axis: gign
---

[stated] Pote et partenaire d'entraînement de Mats, partage l'objectif GIGN
[stated] Son niveau : record de 15 tractions et 40 pompes
[links] [[gign]] [[prepa-physique-gign]] [[dashboard-gign-projet]]
```

`[stated]` : ce que Mats a dit lui-même. `[verify]` : une incohérence à trancher.
`[links]` : les liens de la fiche (non affichés comme faits).

## Structure

```
brain/profile.md      le noyau
brain/hubs/           les 5 axes
brain/areas/          domaines
brain/projects/       projets
brain/people/         personnes
brain/topics/         sujets, objectifs, records, outils, voyages
brain/agents/         agents IA
```

## Liens du graphe

- **explicite** : un `[[lien]]` écrit dans une fiche
- **mention** : le nom ou un alias d'un nœud apparaît dans le texte d'un autre
- **faible** : de chaque nœud vers le profil

L'axe d'un nœud vient de `axis:`, sinon du hub le plus proche par les liens.

## API

| Route | Réponse |
|---|---|
| `GET /` | l'interface (`cerveau/index.html`) |
| `GET /events` | flux SSE, un message `graph` à chaque changement |
| `GET /api/graph` | le graphe complet |
| `GET /api/search?q=...` | nœuds correspondants et extraits |
| `GET /api/node/:nom` | un nœud, son axe, ses faits et ses voisins |
| `GET /api/agents` | l'équipe d'agents, les tâches et les messages |
| `POST /api/agents/task` | crée une tâche de la part de Mats (machine locale uniquement) |
| `POST /api/agents/task/:id/status` · `/message` | change le statut, ou répond sur une tâche (machine locale uniquement) |

## Les agents

À côté de la mémoire, une **équipe de 29 agents** (orchestrateur, archiviste, 6 chefs d'équipe et leurs
spécialistes : coach force, coach course, copywriting, monteur, etc.). Ils se passent le travail par des
tâches et des messages écrits dans `agents/tasks/`, et un tableau de bord les montre en direct :
`cerveau/agents.html` (bouton « Agents » en haut de la page du cerveau).

Tout est détaillé dans [`agents/README.md`](agents/README.md) : comment ça marche, comment dépose tes `.md` dans
`agents/knowledge/<agent>/`, comment changer les consignes d'un agent ou en ajouter un.

```bash
node agents.js list                   # l'équipe en arbre
node agents.js tasks --status open    # ce qui est à faire
node agents.js check                  # tout vérifier
node agents.js publish                # compile, met la page en ligne à jour, pousse
```

## Claude Code

`CLAUDE.md` contient les règles : consulter le cerveau avant de répondre, écrire immédiatement toute
information durable, ne rien déduire, ranger dans un axe et relier, ne jamais stocker de secret.
Le hook `Stop` (`.claude/settings.json`) bloque la fin d'un tour si des changements du cerveau ou des agents
ne sont pas poussés, puis rappelle de vérifier s'il reste une information à noter.
Claude Code y joue aussi l'orchestrateur de l'équipe d'agents.
