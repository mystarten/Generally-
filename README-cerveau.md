# Cerveau

Graphe interactif (façon nuage Obsidian) de tout ce que je dis de durable.
Les notes vivent dans `brain/`, le graphe se met à jour **en direct** dès qu'un fichier change.

## Lancer

```bash
node server.js
```

→ http://localhost:3000 (port modifiable : `PORT=4000 node server.js`)

Le serveur surveille `brain/` en récursif et pousse le graphe au navigateur
par Server-Sent Events (`/events`). Aucun polling, aucune dépendance npm
(d3 v7 est servi depuis `lib/d3.min.js`).

## Capturer

```bash
node brain.js add --type area  --name starten --fact "Starten lance une offre B2B" --link zenithia
node brain.js add --type agent --name zenithia --fact "ZénithIA tourne sur Opus" --link starten
node brain.js add --type topic --name "5 km sous 20 min" --fact "Dernier temps : 21:40"
```

`--type` : `profile` · `area` · `person` · `topic` · `agent`
Options : `--fact` `--link a,b` `--description "..."` `--alias x,y` `--tag stated`

Le fichier est créé s'il n'existe pas, sinon la ligne est ajoutée — jamais en double.
Les lignes qui ressemblent à un numéro de carte, un identifiant ou un mot de passe sont **refusées**.

## Consulter

```bash
node brain.js search "gendarmerie"
node brain.js show starten
node brain.js list
```

## Importer

```bash
node brain.js import ./notes          # un dossier
node brain.js import ./export.md      # un fichier
```

Accepte le même format. Fusionne : complète la description et les aliases manquants,
ajoute les faits absents, **n'écrase jamais** un fait déjà présent.

## Format d'un fichier

```markdown
---
name: Starten
description: Projet entrepreneurial de Mats
aliases: [starten]
---

[stated] Starten est un projet de [[Mats]]
```

Un fait par ligne, préfixé par `[stated]` (ce que j'ai dit moi-même).
`[[nom]]` crée un lien explicite.

## Structure

```
brain/profile.md      moi
brain/areas/          domaines, projets, entreprises
brain/people/         personnes
brain/topics/         sujets, objectifs
brain/agents/         agents IA
```

## API

| Route | Réponse |
|---|---|
| `GET /` | l'interface (`brain-ui/index.html`) |
| `GET /events` | flux SSE, un message `graph` à chaque changement |
| `GET /api/graph` | le graphe complet |
| `GET /api/search?q=...` | noeuds correspondants + extraits |
| `GET /api/node/:nom` | un noeud, ses faits et ses voisins |

## Liens du graphe

- **explicite** — un `[[lien]]` écrit à la main (trait net)
- **mention** — le nom ou un alias d'un noeud apparaît dans le texte d'un autre
- **faible** — de chaque noeud vers le profil (pointillé)

## Interface

Zoom, déplacement, glisser des noeuds. Couleur par type, taille selon le nombre de liens.
Survol : surligne les voisins. Clic : panneau avec faits, date et voisins cliquables.
Recherche (`/` pour y aller) et cases de filtre par type.
Un nouveau noeud apparaît près de ses voisins, un noeud modifié pulse une fois.

## Claude Code

`CLAUDE.md` contient les règles : consulter `brain/` avant de répondre, écrire
immédiatement toute information durable, ne rien déduire, relier, ne jamais stocker de secret.
Un hook `Stop` (`.claude/settings.json`) rappelle la vérification à chaque fin de tour.
