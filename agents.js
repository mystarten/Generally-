#!/usr/bin/env node
'use strict';

/*
 * agents.js — l'equipe d'agents de Mats : definitions, taches, messages, compilation.
 * Zero dependance. Charge par server.js et par brain.js (publication commune).
 *
 *   agents/<id>.md              un agent : frontmatter + consignes (source de verite)
 *   agents/_protocole.md        regles communes, ajoutees a chaque agent a la compilation
 *   agents/knowledge/<id>/      les .md de reference que Mats depose pour cet agent
 *   agents/tasks/T-*.md         une tache par fichier, avec son journal de messages
 *   agents/outputs/<tache>/     les livrables d'une tache
 *   .claude/agents/<id>.md      GENERE : les sous-agents que Claude Code sait lancer
 *   cerveau/agents.json         GENERE : l'instantane lu par la page « Agents »
 *
 * Les agents « communiquent » par des taches et des messages ecrits dans ces
 * fichiers : tout est lisible, versionne, et visible dans le tableau de bord.
 */

const fs = require('fs');
const path = require('path');
const brain = require('./brain.js');

const ROOT = brain.ROOT;
const abs = (env, def) => (process.env[env] ? path.resolve(process.env[env]) : def);
const AGENTS_DIR = abs('AGENTS_DIR', path.join(ROOT, 'agents'));
const TASKS_DIR = path.join(AGENTS_DIR, 'tasks');
const OUTPUTS_DIR = path.join(AGENTS_DIR, 'outputs');
const KNOWLEDGE_DIR = path.join(AGENTS_DIR, 'knowledge');
const CLAUDE_AGENTS_DIR = abs('CLAUDE_AGENTS_DIR', path.join(ROOT, '.claude', 'agents'));
const DATA_FILE = abs('AGENTS_DATA_FILE', path.join(ROOT, 'cerveau', 'agents.json'));

const ROLES = ['orchestrator', 'memory', 'lead', 'specialist'];
const STATUSES = ['backlog', 'open', 'doing', 'blocked', 'done'];
const PRIORITIES = ['low', 'normal', 'high'];
const MODELS = ['sonnet', 'opus', 'haiku', 'fable', 'inherit'];
const KNOWN_TOOLS = ['Agent', 'Read', 'Grep', 'Glob', 'Bash', 'Write', 'Edit', 'WebSearch', 'WebFetch', 'NotebookEdit', 'TodoWrite'];
const HUMAN = 'mats';
const GENERATED_MARK = '<!-- Genere par « node agents.js sync »';

// ---------------------------------------------------------------- utilitaires

const nowIso = () => new Date().toISOString();
const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
const titleize = s => String(s || '').split(/[-_\s]+/).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
const listOf = v => (Array.isArray(v) ? v : (typeof v === 'string' && v.trim() ? v.split(',') : [])).map(x => String(x).trim()).filter(Boolean);
const oneLine = s => String(s || '').replace(/\s+/g, ' ').trim();

/** Decoupe « Agent(a, b), Read, Bash » sur les virgules hors parentheses. */
function parseTools(raw) {
  const out = []; let depth = 0, cur = '';
  for (const ch of String(raw || '')) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}
const toolName = t => t.replace(/\(.*$/, '').trim();

function readdirSafe(dir) { try { return fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return []; } }
function filesIn(dir) {
  return readdirSafe(dir).filter(e => e.isFile() && !e.name.startsWith('.')).map(e => e.name).sort();
}
function writeIfChanged(file, content) {
  let before = null;
  try { before = fs.readFileSync(file, 'utf8'); } catch (_) {}
  if (before === content) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  return true;
}

// ----------------------------------------------------------------- les agents

function knowledgeOf(id) {
  return filesIn(path.join(KNOWLEDGE_DIR, id)).map(f => 'agents/knowledge/' + id + '/' + f);
}

function loadAgents() {
  return readdirSafe(AGENTS_DIR)
    .filter(e => e.isFile() && e.name.endsWith('.md') && !e.name.startsWith('_') && e.name.toLowerCase() !== 'readme.md')
    .map(e => e.name).sort()
    .map(file => {
      const id = path.basename(file, '.md');
      const { data, body } = brain.parseFrontmatter(fs.readFileSync(path.join(AGENTS_DIR, file), 'utf8'));
      const str = k => (typeof data[k] === 'string' ? data[k].trim() : '');
      return {
        id,
        name: str('name') || id,
        title: str('title') || titleize(id),
        role: str('role') || 'specialist',
        domain: str('domain') || 'noyau',
        parent: str('parent') || null,
        talks_to: listOf(data.talks_to),
        reads: listOf(data.reads),
        toolsRaw: str('tools'),
        tools: parseTools(str('tools')),
        model: str('model') || 'sonnet',
        color: str('color'),
        description: oneLine(str('description')),
        prompt: body.trim(),
        file: 'agents/' + file,
        knowledge: knowledgeOf(id)
      };
    });
}

function loadProtocol() {
  try { return fs.readFileSync(path.join(AGENTS_DIR, '_protocole.md'), 'utf8').trim(); } catch (_) { return ''; }
}

function childrenOf(agents, id) { return agents.filter(a => a.parent === id); }

function validateAgents(agents) {
  const errors = [], warnings = [];
  const ids = new Set(agents.map(a => a.id));
  const byId = new Map(agents.map(a => [a.id, a]));
  const orchestrators = agents.filter(a => a.role === 'orchestrator');
  if (agents.length && orchestrators.length !== 1) errors.push('il faut exactement 1 orchestrateur, il y en a ' + orchestrators.length);

  let resolve = () => null;
  try { resolve = brain.buildResolver(brain.readAllNodes()); } catch (_) {}

  for (const a of agents) {
    const at = a.file + ' : ';
    if (!/^[a-z0-9][a-z0-9-]*$/.test(a.id)) errors.push(at + 'identifiant invalide (minuscules, chiffres, tirets)');
    if (a.name !== a.id) errors.push(at + 'name « ' + a.name + ' » doit etre egal au nom du fichier « ' + a.id + ' »');
    if (!ROLES.includes(a.role)) errors.push(at + 'role inconnu « ' + a.role + ' » (' + ROLES.join(', ') + ')');
    if (!a.description) errors.push(at + 'description vide (Claude Code s\'en sert pour decider de deleguer)');
    if (!MODELS.includes(a.model) && !/^claude-/.test(a.model)) errors.push(at + 'model inconnu « ' + a.model + ' »');
    if (a.prompt.length < 120) warnings.push(at + 'consignes tres courtes');
    if (a.role !== 'orchestrator') {
      if (!a.parent) errors.push(at + 'pas de parent');
      else if (!ids.has(a.parent)) errors.push(at + 'parent introuvable « ' + a.parent + ' »');
    }
    for (const t of a.talks_to) {
      if (!ids.has(t)) errors.push(at + 'talks_to introuvable « ' + t + ' »');
      if (t === a.id) errors.push(at + 'talks_to : un agent ne se parle pas a lui-meme');
    }
    for (const t of a.tools) if (!KNOWN_TOOLS.includes(toolName(t))) warnings.push(at + 'outil inconnu « ' + t + ' »');
    const hasKids = childrenOf(agents, a.id).length > 0;
    const canSpawn = a.tools.some(t => toolName(t) === 'Agent');
    if (hasKids && !canSpawn) errors.push(at + 'a des sous-agents mais pas l\'outil Agent');
    if (!hasKids && canSpawn && a.role !== 'orchestrator') warnings.push(at + 'a l\'outil Agent sans sous-agent');
    for (const r of a.reads) if (!resolve(r)) warnings.push(at + 'reads : « ' + r + ' » introuvable dans le cerveau');
    // cycles
    const seen = new Set([a.id]); let p = a.parent;
    while (p && byId.has(p)) {
      if (seen.has(p)) { errors.push(at + 'cycle dans la hierarchie'); break; }
      seen.add(p); p = byId.get(p).parent;
    }
  }
  return { errors, warnings };
}

// ------------------------------------------------------------------ les taches

const TASK_ID = /^T-\d{6}-[a-z0-9]{3,4}$/;
const taskFile = id => path.join(TASKS_DIR, id + '.md');

function parseTask(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, body } = brain.parseFrontmatter(raw);
  const str = k => (typeof data[k] === 'string' ? data[k].trim() : '');
  const sections = {};
  let name = null;
  for (const line of body.split(/\r?\n/)) {
    const h = /^## (.+?)\s*$/.exec(line);
    if (h) { name = h[1]; sections[name] = []; continue; }
    if (name) sections[name].push(line);
  }
  const text = n => (sections[n] || []).join('\n').trim();

  const journal = [];
  for (const line of (sections['Journal'] || [])) {
    const m = /^- (\S+) \| (\S+) → (\S+) \| (.*)$/.exec(line);
    if (m) journal.push({ t: m[1], from: m[2], to: m[3], text: m[4] });
    else if (/^ {2}\S/.test(line) && journal.length) journal[journal.length - 1].text += '\n' + line.slice(2);
  }
  const id = path.basename(file, '.md');
  return {
    id,
    title: str('title') || id,
    from: str('from'),
    to: str('to'),
    status: str('status') || 'open',
    priority: str('priority') || 'normal',
    parent: str('parent') || null,
    created: str('created'),
    updated: str('updated'),
    body: text('Demande'),
    result: text('Résultat'),
    journal,
    outputs: filesIn(path.join(OUTPUTS_DIR, id)).map(f => 'agents/outputs/' + id + '/' + f)
  };
}

function renderTask(t) {
  const journal = t.journal.map(j => '- ' + j.t + ' | ' + j.from + ' → ' + j.to + ' | ' + j.text.replace(/\n/g, '\n  ')).join('\n');
  return [
    '---',
    'id: ' + t.id,
    'title: ' + oneLine(t.title),
    'from: ' + t.from,
    'to: ' + t.to,
    'status: ' + t.status,
    'priority: ' + t.priority,
    'parent: ' + (t.parent || ''),
    'created: ' + t.created,
    'updated: ' + t.updated,
    '---',
    '',
    '## Demande',
    '',
    t.body || '(aucun detail)',
    '',
    '## Journal',
    '',
    journal,
    '',
    '## Résultat',
    '',
    t.result || '',
    ''
  ].join('\n');
}

function loadTasks() {
  return filesIn(TASKS_DIR).filter(f => /^T-.*\.md$/.test(f)).map(f => {
    try { return parseTask(path.join(TASKS_DIR, f)); } catch (_) { return null; }
  }).filter(Boolean).sort((a, b) => (a.created || '').localeCompare(b.created || '') || a.id.localeCompare(b.id));
}

function getTask(id) {
  if (!TASK_ID.test(String(id))) throw new Error('identifiant de tache invalide : « ' + id + ' » (forme T-AAMMJJ-xxx)');
  if (!fs.existsSync(taskFile(id))) throw new Error('tache introuvable : ' + id);
  return parseTask(taskFile(id));
}

function actorCheck(label, id, agents) {
  if (!id) throw new Error(label + ' est requis');
  if (id !== HUMAN && !agents.some(a => a.id === id)) {
    throw new Error(label + ' « ' + id + ' » : agent inconnu (agents.js list pour la liste, ou « ' + HUMAN + ' »)');
  }
}

function newTaskId() {
  const d = new Date();
  const ymd = String(d.getUTCFullYear()).slice(2) + String(d.getUTCMonth() + 1).padStart(2, '0') + String(d.getUTCDate()).padStart(2, '0');
  for (let i = 0; i < 50; i++) {
    const id = 'T-' + ymd + '-' + Math.random().toString(36).slice(2, 5).padEnd(3, '0');
    if (!fs.existsSync(taskFile(id))) return id;
  }
  throw new Error('impossible de trouver un identifiant libre');
}

function createTask(o) {
  const agents = loadAgents();
  actorCheck('from', o.from, agents);
  actorCheck('to', o.to, agents);
  const title = oneLine(o.title);
  if (!title) throw new Error('title est requis');
  if (title.length > 160) throw new Error('title trop long (160 caracteres max)');
  const status = o.status || 'open';
  const priority = o.priority || 'normal';
  if (!STATUSES.includes(status)) throw new Error('status inconnu « ' + status + ' » (' + STATUSES.join(', ') + ')');
  if (!PRIORITIES.includes(priority)) throw new Error('priority inconnue « ' + priority + ' » (' + PRIORITIES.join(', ') + ')');
  if (o.parent) getTask(o.parent);
  const body = String(o.body || '').trim();
  if (body.length > 20000) throw new Error('demande trop longue (20 000 caracteres max)');
  if (brain.looksSecret(title + '\n' + body)) throw new Error('refus : la tache ressemble a un secret (carte, identifiant, e-mail, mot de passe)');

  const t0 = nowIso();
  const task = {
    id: newTaskId(), title, from: o.from, to: o.to, status, priority,
    parent: o.parent || null, created: t0, updated: t0, body, result: '',
    journal: [{ t: t0, from: o.from, to: o.to, text: 'Tâche créée : ' + title }]
  };
  fs.mkdirSync(TASKS_DIR, { recursive: true });
  fs.writeFileSync(taskFile(task.id), renderTask(task), 'utf8');
  return task;
}

function saveTask(task) {
  task.updated = nowIso();
  fs.writeFileSync(taskFile(task.id), renderTask(task), 'utf8');
  return task;
}

function addMessage(id, o) {
  const agents = loadAgents();
  actorCheck('from', o.from, agents);
  actorCheck('to', o.to, agents);
  const text = String(o.text || '').trim();
  if (!text) throw new Error('text est requis');
  if (text.length > 5000) throw new Error('message trop long (5 000 caracteres max)');
  if (brain.looksSecret(text)) throw new Error('refus : le message ressemble a un secret (carte, identifiant, e-mail, mot de passe)');
  const task = getTask(id);
  task.journal.push({ t: nowIso(), from: o.from, to: o.to, text });
  return saveTask(task);
}

function setStatus(id, status, o = {}) {
  if (!STATUSES.includes(status)) throw new Error('status inconnu « ' + status + ' » (' + STATUSES.join(', ') + ')');
  const agents = loadAgents();
  const actor = o.from || HUMAN;
  actorCheck('from', actor, agents);
  const task = getTask(id);
  const before = task.status;
  task.status = status;
  const note = oneLine(o.note);
  if (note && brain.looksSecret(note)) throw new Error('refus : la note ressemble a un secret');
  task.journal.push({ t: nowIso(), from: actor, to: actor === task.to ? task.from : task.to, text: 'Statut : ' + before + ' → ' + status + (note ? ' (' + note + ')' : '') });
  return saveTask(task);
}

function completeTask(id, o) {
  const agents = loadAgents();
  actorCheck('from', o.from, agents);
  const result = String(o.result || '').trim();
  if (!result) throw new Error('result est requis (ce que tu as fait, en quelques lignes)');
  if (brain.looksSecret(result)) throw new Error('refus : le resultat ressemble a un secret');
  const task = getTask(id);
  task.status = 'done';
  task.result = result;
  task.journal.push({ t: nowIso(), from: o.from, to: task.from, text: 'Terminé : ' + oneLine(result).slice(0, 200) });
  return saveTask(task);
}

function deleteTask(id) {
  getTask(id);
  fs.unlinkSync(taskFile(id));
  return id;
}

// --------------------------------------------------------- compilation Claude Code

function teamBlock(agent, agents) {
  const byId = new Map(agents.map(a => [a.id, a]));
  const lines = ['## Ton équipe', '', 'Ton identifiant d\'agent : `' + agent.id + '` (c\'est ce que tu mets dans `--from`).'];
  const parent = agent.parent && byId.get(agent.parent);
  if (agent.role === 'orchestrator') lines.push('Tu es le point d\'entrée : tu réponds à Mats lui-même.');
  else if (parent) lines.push('Tu rapportes à **' + parent.title + '** (`' + parent.id + '`). C\'est lui qui reçoit ton rapport final.');
  const kids = childrenOf(agents, agent.id);
  if (kids.length) {
    lines.push('', 'Tes sous-agents. Tu peux les lancer avec l\'outil Agent, **uniquement ceux-là** :');
    for (const k of kids) lines.push('- `' + k.id + '` : ' + k.title + '. ' + k.description);
  }
  const talk = agent.talks_to.map(t => byId.get(t)).filter(Boolean);
  if (talk.length) {
    lines.push('', 'Agents que tu peux solliciter hors de ta ligne hiérarchique (par une tâche, voir le protocole) :');
    for (const t of talk) lines.push('- `' + t.id + '` : ' + t.title);
  }
  return lines.join('\n');
}

function compileAgent(agent, agents, protocol) {
  const parts = [GENERATED_MARK + ' à partir de ' + agent.file + '. Ne pas modifier ici : modifier la source. -->', '', agent.prompt, '', teamBlock(agent, agents)];
  if (protocol) parts.push('', protocol);
  if (agent.reads.length) {
    parts.push('', '## À consulter dans le cerveau avant d\'agir', '');
    for (const r of agent.reads) parts.push('- `node brain.js show "' + r + '"`');
  }
  parts.push('', '## Tes fichiers de référence', '',
    'Mats y dépose ses propres documents (méthodes, exemples, modèles). Lis-les avant de produire quoi que ce soit :',
    '- `agents/knowledge/' + agent.id + '/` : spécifique à ton poste',
    '- `agents/knowledge/_shared/` : commun à toute l\'équipe');
  const fm = [
    '---',
    'name: ' + agent.id,
    'description: ' + JSON.stringify(agent.description),
    'tools: ' + agent.toolsRaw,
    'model: ' + agent.model,
    '---',
    ''
  ];
  return fm.join('\n') + parts.join('\n') + '\n';
}

/** Ecrit .claude/agents/<id>.md pour chaque agent, et retire ceux qu'on a generes pour un agent disparu. */
function sync() {
  const agents = loadAgents();
  const protocol = loadProtocol();
  const written = [], removed = [];
  fs.mkdirSync(CLAUDE_AGENTS_DIR, { recursive: true });
  for (const a of agents) {
    if (writeIfChanged(path.join(CLAUDE_AGENTS_DIR, a.id + '.md'), compileAgent(a, agents, protocol))) written.push(a.id);
  }
  const ids = new Set(agents.map(a => a.id));
  for (const f of filesIn(CLAUDE_AGENTS_DIR)) {
    if (!f.endsWith('.md') || ids.has(path.basename(f, '.md'))) continue;
    const file = path.join(CLAUDE_AGENTS_DIR, f);
    if (fs.readFileSync(file, 'utf8').includes(GENERATED_MARK)) { fs.unlinkSync(file); removed.push(path.basename(f, '.md')); }
  }
  return { agents: agents.length, written, removed };
}

// ------------------------------------------------------------ instantane (tableau de bord)

function readPreviousState() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch (_) { return null; }
}

/**
 * L'etat complet : agents, taches, messages. La date « updated » d'un agent ne
 * change que si son contenu change (les dates de fichiers ne sont pas fiables :
 * git les reecrit a chaque checkout), pour que l'export ne produise un commit
 * que lorsque quelque chose a vraiment bouge.
 */
function buildState(previous) {
  const agents = loadAgents();
  const tasks = loadTasks();
  let resolve = () => null, nodes = [];
  try { nodes = brain.readAllNodes(); resolve = brain.buildResolver(nodes); } catch (_) {}
  const nodeById = new Map(nodes.map(n => [n.id, n]));
  const prev = new Map(((previous && previous.agents) || []).map(a => [a.id, a]));

  const sig = a => JSON.stringify([a.title, a.role, a.domain, a.parent, a.talks_to, a.reads, a.toolsRaw, a.model, a.color, a.description, a.prompt, a.knowledge]);
  const out = agents.map(a => {
    const mine = tasks.filter(t => t.to === a.id);
    const count = s => mine.filter(t => t.status === s).length;
    const p = prev.get(a.id);
    const reads = a.reads.map(r => {
      const id = resolve(r), n = id && nodeById.get(id);
      return { ref: r, id: id || null, name: n ? n.name : null };
    });
    const base = {
      id: a.id, title: a.title, role: a.role, domain: a.domain, parent: a.parent,
      children: childrenOf(agents, a.id).map(k => k.id), talks_to: a.talks_to, reads,
      tools: a.tools, model: a.model, color: a.color, description: a.description,
      prompt: a.prompt, file: a.file, knowledge: a.knowledge,
      stats: { backlog: count('backlog'), open: count('open'), doing: count('doing'), blocked: count('blocked'), done: count('done') }
    };
    const unchanged = p && sig({ ...base, toolsRaw: a.toolsRaw }) === (p._sig || '');
    return { ...base, _sig: sig({ ...base, toolsRaw: a.toolsRaw }), updated: unchanged ? p.updated : nowIso() };
  });

  const messages = [];
  for (const t of tasks) for (const j of t.journal) messages.push({ t: j.t, from: j.from, to: j.to, text: j.text, task: t.id, title: t.title });
  messages.sort((a, b) => a.t.localeCompare(b.t));

  const stamps = out.map(a => a.updated).concat(tasks.map(t => t.updated)).filter(Boolean);
  return {
    generated: stamps.length ? stamps.reduce((m, x) => (x > m ? x : m), '') : '',
    protocol: loadProtocol(),
    human: HUMAN,
    agents: out,
    tasks,
    messages
  };
}

function exportStatic() {
  const state = buildState(readPreviousState());
  const changed = writeIfChanged(DATA_FILE, JSON.stringify(state) + '\n');
  return { file: path.relative(ROOT, DATA_FILE), agents: state.agents.length, tasks: state.tasks.length, changed };
}

/** Appele par la publication : compile les sous-agents et ecrit l'instantane. */
function regenerate() {
  const s = sync();
  const e = exportStatic();
  return { sync: s, export: e };
}

// ------------------------------------------------------------------------ CLI

function parseArgs(argv) {
  const flags = {}, positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq > -1) flags[a.slice(2, eq)] = a.slice(eq + 1);
      else {
        const next = argv[i + 1];
        if (next === undefined || next.startsWith('--')) flags[a.slice(2)] = true;
        else { flags[a.slice(2)] = next; i++; }
      }
    } else positional.push(a);
  }
  return { flags, positional };
}
const flag = (f, k) => (typeof f[k] === 'string' ? f[k] : '');

const USAGE = `agents — l'équipe d'agents de Mats

  node agents.js list                      les agents, en arbre hiérarchique
  node agents.js show <agent>              un agent : rôle, équipe, outils, tâches
  node agents.js check                     hiérarchie, outils, liens, cerveau
  node agents.js sync                      compile agents/*.md vers .claude/agents/ (sous-agents Claude Code)
  node agents.js export                    écrit cerveau/agents.json (page « Agents »)
  node agents.js publish                   sync + export + commit + push (cerveau et agents ensemble)

  node agents.js inbox <agent> [--all]     ce qui attend cet agent
  node agents.js tasks [--status s] [--to a] [--from a]
  node agents.js task new --from <a> --to <a> --title "..." [--body "..."] [--priority high] [--parent T-...] [--status backlog]
  node agents.js task show <T-...>
  node agents.js task status <T-...> <backlog|open|doing|blocked|done> [--from a] [--note "..."]
  node agents.js task rm <T-...>
  node agents.js msg <T-...> --from <a> --to <a> --text "..."
  node agents.js done <T-...> --from <a> --result "..."
  node agents.js knowledge [agent]         les .md déposés par Mats

  « mats » est un acteur valide : --to mats pose une question à Mats, --from mats est une demande de sa part.
  Les livrables d'une tâche vont dans agents/outputs/<T-...>/.
`;

function printTree(agents, id, prefix, last, tasks) {
  const a = agents.find(x => x.id === id);
  const open = tasks.filter(t => t.to === id && (t.status === 'open' || t.status === 'doing' || t.status === 'blocked')).length;
  const tag = { orchestrator: '◆', memory: '◇', lead: '●', specialist: '○' }[a.role] || '·';
  console.log(prefix + (prefix ? (last ? '└─ ' : '├─ ') : '') + tag + ' ' + a.id.padEnd(22 - prefix.length / 1.5 | 0) + ' ' + a.title + (open ? '   [' + open + ' en cours]' : ''));
  const kids = childrenOf(agents, id);
  kids.forEach((k, i) => printTree(agents, k.id, prefix + (prefix ? (last ? '   ' : '│  ') : ''), i === kids.length - 1, tasks));
}

function cmdList(f) {
  const agents = loadAgents(), tasks = loadTasks();
  if (!agents.length) return console.log('aucun agent dans agents/');
  for (const r of agents.filter(a => !a.parent)) printTree(agents, r.id, '', true, tasks);
  const by = role => agents.filter(a => a.role === role).length;
  console.log('\n' + agents.length + ' agents : ' + by('orchestrator') + ' orchestrateur, ' + by('memory') + ' mémoire, ' + by('lead') + ' chefs d\'équipe, ' + by('specialist') + ' spécialistes');
}

function cmdShow(id) {
  const agents = loadAgents(), tasks = loadTasks();
  const a = agents.find(x => x.id === id);
  if (!a) throw new Error('agent inconnu : « ' + id + ' »');
  console.log('\n' + a.title + '  (' + a.id + ', ' + a.role + ', domaine ' + a.domain + ')');
  console.log(a.file + '  ·  modèle ' + a.model);
  console.log('\n' + a.description);
  console.log('\nrapporte à   : ' + (a.parent || '—'));
  console.log('sous-agents  : ' + (childrenOf(agents, id).map(k => k.id).join(', ') || '—'));
  console.log('sollicite    : ' + (a.talks_to.join(', ') || '—'));
  console.log('outils       : ' + (a.toolsRaw || '—'));
  console.log('cerveau      : ' + (a.reads.join(', ') || '—'));
  console.log('fichiers     : ' + (a.knowledge.length ? a.knowledge.join(', ') : 'aucun (dépose tes .md dans agents/knowledge/' + id + '/)'));
  const mine = tasks.filter(t => t.to === id && t.status !== 'done');
  console.log('\ntâches en attente (' + mine.length + ')');
  for (const t of mine) console.log('  ' + t.id + '  ' + t.status.padEnd(7) + ' ' + t.title);
  console.log('');
}

function cmdCheck() {
  const agents = loadAgents();
  const { errors, warnings } = validateAgents(agents);
  const tasks = loadTasks();
  const ids = new Set(agents.map(a => a.id).concat([HUMAN]));
  for (const t of tasks) {
    if (!ids.has(t.from)) errors.push(t.id + ' : from « ' + t.from + ' » inconnu');
    if (!ids.has(t.to)) errors.push(t.id + ' : to « ' + t.to + ' » inconnu');
    if (!STATUSES.includes(t.status)) errors.push(t.id + ' : statut « ' + t.status + ' » inconnu');
    if (t.parent && !tasks.some(x => x.id === t.parent)) errors.push(t.id + ' : parent « ' + t.parent + ' » introuvable');
  }
  let stale = 0;
  try {
    const protocol = loadProtocol();
    for (const a of agents) {
      const f = path.join(CLAUDE_AGENTS_DIR, a.id + '.md');
      if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== compileAgent(a, agents, protocol)) stale++;
    }
  } catch (_) {}
  for (const w of warnings) console.log('attention  ' + w);
  for (const e of errors) console.log('ERREUR     ' + e);
  if (stale) console.log('attention  .claude/agents est en retard sur agents/ pour ' + stale + ' agent(s) : lance « node agents.js sync »');
  console.log(errors.length ? '\n' + errors.length + ' erreur(s)' : '\nOK : ' + agents.length + ' agents, ' + tasks.length + ' tâches' + (warnings.length ? ', ' + warnings.length + ' avertissement(s)' : ''));
  if (errors.length) process.exitCode = 1;
}

const ACTIVE = ['open', 'doing', 'blocked'];
function taskLine(t) {
  return '  ' + t.id + '  ' + (t.priority === 'high' ? '! ' : '  ') + t.status.padEnd(7) + ' ' + t.from + ' → ' + t.to + '  ' + t.title;
}

function cmdInbox(id, f) {
  const agents = loadAgents();
  if (id !== HUMAN && !agents.some(a => a.id === id)) throw new Error('agent inconnu : « ' + id + ' »');
  const tasks = loadTasks();
  const states = f.all ? STATUSES : ACTIVE;
  const mine = tasks.filter(t => t.to === id && states.includes(t.status));
  const waiting = tasks.filter(t => t.from === id && t.to !== id && ACTIVE.includes(t.status));
  console.log('\nBoîte de ' + id + (f.all ? ' (tout)' : ''));
  console.log('\nÀ faire (' + mine.length + ')');
  if (!mine.length) console.log('  rien');
  for (const t of mine) {
    console.log(taskLine(t));
    if (t.body) console.log('      ' + oneLine(t.body).slice(0, 220));
    const last = t.journal.filter(j => j.to === id && j.from !== id).slice(-2);
    for (const j of last) console.log('      · ' + j.from + ' : ' + oneLine(j.text).slice(0, 160));
  }
  console.log('\nQue tu attends des autres (' + waiting.length + ')');
  if (!waiting.length) console.log('  rien');
  for (const t of waiting) console.log(taskLine(t));
  console.log('');
}

function cmdTasks(f) {
  let tasks = loadTasks();
  if (f.status) tasks = tasks.filter(t => t.status === f.status);
  if (f.to) tasks = tasks.filter(t => t.to === f.to);
  if (f.from) tasks = tasks.filter(t => t.from === f.from);
  if (!tasks.length) return console.log('aucune tâche');
  for (const t of tasks) console.log(taskLine(t));
  console.log('\n' + tasks.length + ' tâche(s)');
}

function cmdTaskShow(id) {
  const t = getTask(id);
  console.log('\n' + t.id + '  ' + t.title);
  console.log(t.from + ' → ' + t.to + '  ·  ' + t.status + '  ·  priorité ' + t.priority + (t.parent ? '  ·  sous-tâche de ' + t.parent : ''));
  console.log('créée ' + t.created + '  ·  maj ' + t.updated);
  if (t.body) console.log('\n' + t.body);
  console.log('\njournal');
  for (const j of t.journal) console.log('  ' + j.t.slice(0, 16).replace('T', ' ') + '  ' + j.from + ' → ' + j.to + '  ' + oneLine(j.text));
  if (t.result) console.log('\nrésultat\n' + t.result);
  if (t.outputs.length) console.log('\nlivrables\n' + t.outputs.map(o => '  ' + o).join('\n'));
  console.log('');
}

function cmdKnowledge(id) {
  const agents = loadAgents();
  const targets = id ? [id] : agents.map(a => a.id).concat(['_shared']);
  let total = 0;
  for (const t of targets) {
    if (t !== '_shared' && !agents.some(a => a.id === t)) throw new Error('agent inconnu : « ' + t + ' »');
    const files = filesIn(path.join(KNOWLEDGE_DIR, t));
    total += files.length;
    if (files.length || id) console.log(t.padEnd(24) + (files.length ? files.join(', ') : '(vide)'));
  }
  if (!id) console.log('\n' + total + ' fichier(s). Dépose tes .md dans agents/knowledge/<agent>/ (ou _shared/ pour toute l\'équipe).');
}

function main(argv) {
  const cmd = argv[0];
  const { flags: f, positional: p } = parseArgs(argv.slice(1));
  try {
    switch (cmd) {
      case 'list': return cmdList(f);
      case 'show': return cmdShow(p[0]);
      case 'check': return cmdCheck();
      case 'sync': {
        const r = sync();
        return console.log('.claude/agents : ' + r.agents + ' agents, ' + r.written.length + ' écrit(s)' + (r.removed.length ? ', ' + r.removed.length + ' retiré(s)' : ''));
      }
      case 'export': {
        const r = exportStatic();
        return console.log(r.file + ' — ' + r.agents + ' agents, ' + r.tasks + ' tâches' + (r.changed ? '' : ' (inchangé)'));
      }
      case 'publish': {
        const r = brain.publish();
        if (!r.pushed) return console.log('rien à publier (' + r.reason + ')');
        let line = 'publié sur ' + r.branch;
        if (r.mirrored) line += r.mirrored.ok ? ' + main (page en ligne)' : ' — main non mis à jour : ' + r.mirrored.reason;
        return console.log(line);
      }
      case 'inbox': return cmdInbox(p[0], f);
      case 'tasks': return cmdTasks(f);
      case 'knowledge': return cmdKnowledge(p[0]);
      case 'msg': {
        const t = addMessage(p[0], { from: flag(f, 'from'), to: flag(f, 'to'), text: flag(f, 'text') });
        return console.log(t.id + ' — message ' + flag(f, 'from') + ' → ' + flag(f, 'to'));
      }
      case 'done': {
        const t = completeTask(p[0], { from: flag(f, 'from'), result: flag(f, 'result') });
        return console.log(t.id + ' — terminé, rapport remonté à ' + t.from);
      }
      case 'task': {
        const sub = p[0];
        if (sub === 'new') {
          const t = createTask({ from: flag(f, 'from'), to: flag(f, 'to'), title: flag(f, 'title'), body: flag(f, 'body'),
            priority: flag(f, 'priority') || undefined, parent: flag(f, 'parent') || undefined, status: flag(f, 'status') || undefined });
          return console.log(t.id + ' — ' + t.from + ' → ' + t.to + ' : ' + t.title);
        }
        if (sub === 'show') return cmdTaskShow(p[1]);
        if (sub === 'status') {
          const t = setStatus(p[1], p[2], { from: flag(f, 'from') || undefined, note: flag(f, 'note') });
          return console.log(t.id + ' — ' + t.status);
        }
        if (sub === 'rm') return console.log(deleteTask(p[1]) + ' — supprimée');
        throw new Error('task : new | show | status | rm');
      }
      default:
        console.log(USAGE);
        if (cmd && cmd !== 'help' && cmd !== '--help') process.exitCode = 1;
    }
  } catch (err) {
    console.error('agents: ' + err.message);
    process.exitCode = 1;
  }
}

module.exports = {
  AGENTS_DIR, TASKS_DIR, OUTPUTS_DIR, KNOWLEDGE_DIR, CLAUDE_AGENTS_DIR, DATA_FILE,
  ROLES, STATUSES, PRIORITIES, HUMAN,
  loadAgents, loadProtocol, loadTasks, getTask, validateAgents, parseTools,
  createTask, addMessage, setStatus, completeTask, deleteTask,
  compileAgent, sync, buildState, readPreviousState, exportStatic, regenerate
};

if (require.main === module) main(process.argv.slice(2));
