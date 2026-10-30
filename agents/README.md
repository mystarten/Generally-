# Équipe d'agents

Le cerveau (`brain/`) est la **mémoire** de Mats. Ce dossier est son **équipe** : des agents spécialisés
qui se passent le travail, avec un tableau de bord pour tout voir.

- Tableau de bord : `cerveau/agents.html` (page « Agents », à côté de « Cerveau »).
- En local, en direct, avec création de tâches : double-clic sur `demarrer-cerveau.command` ou `.bat`.

## Comment ça marche

```
Mats → orchestrateur → chef d'équipe → spécialiste
                 └→ archiviste (seul à écrire dans le cerveau)
```

- Tu parles à **Claude Code** : il joue l'orchestrateur (c'est écrit dans `CLAUDE.md`).
- Pour un vrai travail, il crée une **tâche** (`agents/tasks/T-….md`) puis lance l'agent concerné.
- L'agent lit le cerveau, travaille, dépose ses livrables dans `agents/outputs/<tâche>/`, ferme la tâche.
- S'il lui manque une information que toi seul as, il ne devine pas : il te pose une **question** (une tâche
  adressée à `mats`), visible dans le bouton « Questions » du tableau de bord.
- Les agents « communiquent » par ces tâches et leurs messages : tout est écrit, versionné, visible.

## Les agents

| Équipe | Chef d'équipe | Spécialistes |
|---|---|---|
| Noyau | `orchestrateur` | `archiviste` |
| GIGN | `cap-gign` | `prepa-epreuves`, `parcours-gendarmerie`, `culture-sog` |
| Sport | `coach-sport` | `coach-force`, `coach-course`, `coach-recuperation` |
| Business | `business` | `marketing`, `copywriting`, `prospection`, `automatisation`, `suivi-finances` |
| Vidéo | `studio-video` | `scenariste`, `maquettiste`, `monteur`, `visuels`, `calendrier-editorial` |
| Études | `etudes` | `projets-ecole`, `stage-canada` |
| Vie | `vie` | `planning`, `voyages`, `bilan-hebdo` |

## Les personnaliser

**1. Donner tes propres documents.** Dépose tes `.md` dans `agents/knowledge/<agent>/` (ou `_shared/` pour
toute l'équipe). Chaque agent les lit avant de produire quoi que ce soit. Par exemple tes méthodes de montage
dans `agents/knowledge/monteur/`.

**2. Changer ses consignes.** Ouvre `agents/<agent>.md` : le texte sous le bandeau est ce que l'agent lit.
Le bandeau du haut règle son rôle, son équipe et ses outils :

```yaml
name: coach-force            # = nom du fichier
title: Coach force           # affiché dans le tableau de bord
role: specialist             # orchestrator | memory | lead | specialist
domain: sport                # la couleur : gign, sport, entrepreneuriat, etudes-audencia, developpement-perso
parent: coach-sport          # à qui il rapporte
talks_to: [coach-course]     # qui il peut solliciter hors de sa ligne
reads: [tractions, pompes]   # fiches du cerveau qu'il consulte
tools: Read, Grep, Glob, Bash, Write, Edit
model: sonnet
description: ...             # une ligne : c'est ce qui décide quand Claude Code l'appelle
```

**3. Ajouter un agent.** Copie un fichier existant, change `name` (et le nom du fichier), `title`, `parent`,
les consignes. Puis :

```bash
node agents.js check     # hiérarchie, outils, fiches du cerveau
node agents.js publish   # compile vers .claude/agents/ et met la page en ligne à jour
```

Les règles communes à toute l'équipe sont dans `_protocole.md` : elles sont ajoutées à chaque agent à la compilation.

## Ce que les agents ne font pas

Ils **n'envoient rien** (e-mail, DM, publication), ne dépensent rien, ne se connectent à aucun compte, ne
citent aucun barème ou règlement de mémoire (ils cherchent une source), et n'écrivent pas dans le cerveau.
Ils préparent, tu envoies.

## Limite à connaître : la profondeur de délégation

Dans Claude Code sur ton ordinateur, un chef d'équipe peut lancer ses spécialistes (3 niveaux au total).
Dans les **sessions cloud** (l'app Claude, claude.ai/code), la profondeur est limitée à 1 : le chef d'équipe ne
peut pas lancer de spécialiste. Dans ce cas il crée quand même leurs tâches et les laisse ouvertes, et
l'orchestrateur les lance lui-même. Le résultat est le même, mais en deux temps.

## Commandes

```bash
node agents.js list                   # l'équipe en arbre
node agents.js show coach-force       # un agent, ses tâches
node agents.js tasks --status open    # ce qui est à faire
node agents.js inbox coach-force      # la boîte d'un agent
node agents.js task new --from mats --to coach-force --title "..." --body "..."
node agents.js check                  # tout vérifier
node agents.js sync                   # compiler vers .claude/agents/
node agents.js publish                # sync + export + commit + push
```
