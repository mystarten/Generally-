#!/usr/bin/env node
'use strict';

/*
 * brain.js — cerveau IA : parseur, graphe et CLI.
 * Zero dependance. Sert aussi de module a server.js.
 *
 *   node brain.js add --type topic --name tractions --axis sport --fact "..." --link street-workout
 *   node brain.js search "mot"
 *   node brain.js show nom
 *   node brain.js remove nom
 *   node brain.js import <fichier|dossier>
 *   node brain.js publish
 *
 * Chaque ecriture (add, remove, import) regenere cerveau/data.json puis le
 * publie : commit et push, pour que la page en ligne suive tout de suite.
 * --no-push ou BRAIN_NO_PUSH=1 pour ne rien envoyer.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BRAIN_DIR = path.join(ROOT, 'brain');
const DATA_FILE = path.join(ROOT, 'cerveau', 'data.json');

const TYPE_TO_DIR = {
  profile: '.',
  hub: 'hubs',
  area: 'areas',
  project: 'projects',
  person: 'people',
  topic: 'topics',
  agent: 'agents'
};
const DIR_TO_TYPE = {
  '.': 'profile',
  hubs: 'hub',
  areas: 'area',
  projects: 'project',
  people: 'person',
  topics: 'topic',
  agents: 'agent'
};

const WEIGHTS = { explicit: 2, mention: 1, weak: 0.2 };

// ---------------------------------------------------------------- utilitaires

function deaccent(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function norm(s) {
  return deaccent(String(s || '')).toLowerCase().replace(/\s+/g, ' ').trim();
}

function slugify(s) {
  return deaccent(String(s || ''))
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'sans-nom';
}

function titleize(s) {
  return String(s || '')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function firstLine(err) {
  return String((err && (err.stderr || err.message)) || err).trim().split('\n')[0];
}

// Regle 6 : jamais de numeros de carte, identifiants ou mots de passe.
const SECRET_PATTERNS = [
  /\b(?:\d[ -]?){13,19}\b/,
  /\b(mot\s+de\s+passe|password|passwd|pwd)\b/i,
  /\b(api[\s_-]?key|cle\s+api|secret\s+key|client\s+secret|private\s+key)\b/i,
  /\b(cvv|cvc|iban|bic)\b/i,
  /[\w.+-]+@[\w-]+\.[a-z]{2,}/i
];

function looksSecret(text) {
  return SECRET_PATTERNS.some(re => re.test(String(text)));
}

// ------------------------------------------------------------------- lecture

function walkMarkdown(dir) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_) {
    return out;
  }
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('.')) continue;
      out.push(...walkMarkdown(abs));
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) {
      out.push(abs);
    }
  }
  return out;
}

function stripQuotes(s) {
  return String(s).trim().replace(/^["']|["']$/g, '').trim();
}

function parseFrontmatter(raw) {
  const data = {};
  let body = raw;
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(raw);
  if (m) {
    body = raw.slice(m[0].length);
    let currentKey = null;
    for (const line of m[1].split(/\r?\n/)) {
      const item = /^\s*-\s+(.*)$/.exec(line);
      if (item && currentKey) {
        if (!Array.isArray(data[currentKey])) data[currentKey] = [];
        data[currentKey].push(stripQuotes(item[1]));
        continue;
      }
      const kv = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
      if (!kv) continue;
      currentKey = kv[1];
      const value = kv[2].trim();
      if (value === '') {
        data[currentKey] = [];
      } else if (/^\[.*\]$/.test(value)) {
        data[currentKey] = value.slice(1, -1).split(',').map(x => stripQuotes(x)).filter(Boolean);
      } else {
        data[currentKey] = stripQuotes(value);
      }
    }
  }
  return { data, body };
}

const WIKILINK_RE = /\[\[([^\[\]|]+)(?:\|[^\[\]]*)?\]\]/g;

function extractWikilinks(text) {
  const out = [];
  let m;
  WIKILINK_RE.lastIndex = 0;
  while ((m = WIKILINK_RE.exec(text)) !== null) out.push(m[1].trim());
  return out;
}

function parseFacts(body) {
  const facts = [];
  for (const line of body.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith('<!--')) continue;
    const m = /^\[([a-zA-Z]+)\]\s*(.+)$/.exec(t);
    if (m) facts.push({ tag: m[1].toLowerCase(), text: m[2].trim() });
  }
  return facts;
}

function parseAliases(value) {
  let aliases = value;
  if (typeof aliases === 'string') aliases = aliases.split(',');
  return (Array.isArray(aliases) ? aliases : []).map(a => String(a).trim()).filter(Boolean);
}

function typeFromPath(abs) {
  const rel = path.relative(BRAIN_DIR, abs);
  const dir = path.dirname(rel);
  const top = dir === '.' ? '.' : dir.split(path.sep)[0];
  if (path.basename(abs).toLowerCase() === 'profile.md') return 'profile';
  return DIR_TO_TYPE[top] || 'topic';
}

function parseFile(abs) {
  const raw = fs.readFileSync(abs, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const rel = path.relative(BRAIN_DIR, abs).split(path.sep).join('/');
  const id = rel.replace(/\.md$/i, '');
  const name = (typeof data.name === 'string' && data.name.trim())
    ? data.name.trim()
    : titleize(path.basename(abs, path.extname(abs)));

  const facts = parseFacts(body);
  let mtime = Date.now();
  try { mtime = fs.statSync(abs).mtimeMs; } catch (_) {}

  const description = typeof data.description === 'string' ? data.description.trim() : '';
  const searchText = [description, ...facts.map(f => f.text)].join('\n');

  return {
    id,
    file: rel,
    type: typeFromPath(abs),
    name,
    slug: slugify(name),
    description,
    aliases: parseAliases(data.aliases),
    axis: typeof data.axis === 'string' ? data.axis.trim() : '',
    facts,
    wikilinks: extractWikilinks(searchText),
    updated: mtime
  };
}

function readAllNodes() {
  return walkMarkdown(BRAIN_DIR).map(abs => {
    try {
      return parseFile(abs);
    } catch (err) {
      console.error('brain: lecture impossible ' + abs + ' : ' + err.message);
      return null;
    }
  }).filter(Boolean).sort((a, b) => a.id.localeCompare(b.id));
}

// -------------------------------------------------------------------- graphe

/** Retrouve un noeud par son nom, un alias, son slug ou son nom de fichier. */
function buildResolver(nodes) {
  const index = new Map();
  const put = (key, id) => {
    for (const k of [norm(key), slugify(key)]) {
      if (k.length >= 2 && !index.has(k)) index.set(k, id);
    }
  };
  for (const n of nodes) {
    put(n.name, n.id);
    put(n.id, n.id);
    put(path.basename(n.id), n.id);
    for (const a of n.aliases) put(a, n.id);
  }
  return term => index.get(norm(term)) || index.get(slugify(term)) || null;
}

function buildGraph(nodes) {
  const resolve = buildResolver(nodes);
  const byId = new Map(nodes.map(n => [n.id, n]));
  const profile = nodes.find(n => n.type === 'profile');
  const pairs = new Map();

  const addLink = (source, target, kind) => {
    if (!source || !target || source === target) return;
    const key = source < target ? source + '\u0000' + target : target + '\u0000' + source;
    const existing = pairs.get(key);
    if (existing && WEIGHTS[existing.kind] >= WEIGHTS[kind]) return;
    pairs.set(key, { source, target, kind, weight: WEIGHTS[kind] });
  };

  // 1. liens explicites [[...]]
  for (const n of nodes) {
    for (const link of n.wikilinks) addLink(n.id, resolve(link), 'explicit');
  }

  // 2. mentions du nom ou d'un alias dans le texte d'un autre noeud
  const terms = [];
  for (const n of nodes) {
    for (const label of [n.name, ...n.aliases]) {
      const t = norm(label);
      if (t.length < 3) continue;
      terms.push({ id: n.id, re: new RegExp('(^|[^a-z0-9])' + escapeRe(t) + '($|[^a-z0-9])') });
    }
  }
  for (const n of nodes) {
    // Les [[liens]] sont deja comptes en 1. On les retire du texte scanne, sinon
    // les mots de leurs slugs creent de faux liens ([[equipement-sport]] -> Sport).
    const prose = [n.description, ...n.facts.map(f => f.text)].join(' \n ').replace(WIKILINK_RE, ' ');
    const haystack = norm(prose);
    if (!haystack) continue;
    for (const t of terms) {
      if (t.id === n.id) continue;
      if (t.re.test(haystack)) addLink(n.id, t.id, 'mention');
    }
  }

  // 3. lien faible de chaque noeud vers le profil
  if (profile) {
    for (const n of nodes) addLink(n.id, profile.id, 'weak');
  }

  const links = [...pairs.values()];

  // 4. axe de chaque noeud : le hub declare dans « axis: », sinon le hub le
  //    plus proche par les liens. Le profil est le centre et n'a pas d'axe ;
  //    il ne sert pas de pont, sinon tout serait a un saut de chaque hub.
  const adj = new Map(nodes.map(n => [n.id, []]));
  for (const l of links) {
    if (l.kind === 'weak') continue;
    adj.get(l.source).push(l.target);
    adj.get(l.target).push(l.source);
  }
  const axisOf = new Map();
  for (const n of nodes) if (n.type === 'hub') axisOf.set(n.id, n.id);
  for (const n of nodes) {
    if (axisOf.has(n.id) || n.type === 'profile' || !n.axis) continue;
    const hub = byId.get(resolve(n.axis));
    if (hub && hub.type === 'hub') axisOf.set(n.id, hub.id);
  }
  let frontier = [...axisOf.keys()];
  while (frontier.length) {
    const next = [];
    for (const id of frontier) {
      for (const nb of adj.get(id) || []) {
        if (axisOf.has(nb) || byId.get(nb).type === 'profile') continue;
        axisOf.set(nb, axisOf.get(id));
        next.push(nb);
      }
    }
    frontier = next;
  }

  const degree = new Map();
  for (const l of links) {
    if (l.kind === 'weak') continue;
    degree.set(l.source, (degree.get(l.source) || 0) + 1);
    degree.set(l.target, (degree.get(l.target) || 0) + 1);
  }

  return {
    generated: Date.now(),
    nodes: nodes.map(n => ({
      id: n.id,
      name: n.name,
      type: n.type,
      axis: axisOf.get(n.id) || null,
      description: n.description,
      aliases: n.aliases,
      facts: n.facts,
      file: n.file,
      updated: n.updated,
      degree: degree.get(n.id) || 0
    })),
    links
  };
}

function neighborsOf(graph, id) {
  const out = [];
  for (const l of graph.links) {
    const other = l.source === id ? l.target : (l.target === id ? l.source : null);
    if (!other) continue;
    const n = graph.nodes.find(x => x.id === other);
    if (n) out.push({ id: n.id, name: n.name, type: n.type, kind: l.kind });
  }
  return out;
}

function findNode(nodes, query) {
  const resolve = buildResolver(nodes);
  const id = resolve(query);
  if (id) return nodes.find(n => n.id === id) || null;
  const q = norm(query);
  return nodes.find(n => norm(n.name).includes(q) || n.aliases.some(a => norm(a).includes(q))) || null;
}

function searchNodes(nodes, query) {
  const q = norm(query);
  if (!q) return [];
  const results = [];
  for (const n of nodes) {
    const hits = [];
    let score = 0;
    if (norm(n.name) === q) score += 10;
    else if (norm(n.name).includes(q)) score += 6;
    if (n.aliases.some(a => norm(a).includes(q))) score += 4;
    if (norm(n.description).includes(q)) { score += 2; hits.push(n.description); }
    for (const f of n.facts) {
      if (f.tag === 'links') continue;
      if (norm(f.text).includes(q)) { score += 1; hits.push('[' + f.tag + '] ' + f.text); }
    }
    if (score > 0) results.push({ node: n, score, hits });
  }
  return results.sort((a, b) => b.score - a.score);
}

// -------------------------------------------------------------------- ecriture

function fileForType(type, name) {
  const dir = TYPE_TO_DIR[type];
  if (dir === undefined) {
    throw new Error('type inconnu « ' + type + ' » (attendu : ' + Object.keys(TYPE_TO_DIR).join(', ') + ')');
  }
  if (type === 'profile') return path.join(BRAIN_DIR, 'profile.md');
  return path.join(BRAIN_DIR, dir, slugify(name) + '.md');
}

function renderFrontmatter(meta) {
  const lines = ['---', 'name: ' + meta.name, 'description: ' + (meta.description || '')];
  lines.push('aliases: [' + (meta.aliases || []).join(', ') + ']');
  if (meta.axis) lines.push('axis: ' + meta.axis);
  lines.push('---', '');
  return lines.join('\n');
}

/*
 * Cle de comparaison d'un fait. Les [[liens]] sont retires entierement :
 * une meme phrase reste « le meme fait » quels que soient les liens accroches
 * au bout de la ligne, ce qui evite les doublons quand --link complete un fait.
 */
function factKey(text) {
  return norm(String(text).replace(/\[\[[^\[\]]*\]\]/g, ' '))
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Un nom deja ecrit avec des majuscules est respecte tel quel (« ZenithIA »). */
function titleizeIfSlug(name) {
  return /[A-Z]/.test(name) ? name.trim() : titleize(name);
}

function appendLine(abs, line) {
  let content = fs.readFileSync(abs, 'utf8');
  if (content.length && !content.endsWith('\n')) content += '\n';
  fs.writeFileSync(abs, content + line + '\n', 'utf8');
}

/** Ajoute (ou complete) un fait dans un fichier. Retourne un rapport. */
function addFact(opts) {
  const { type, name, fact, links = [], description, aliases = [], axis = '', tag = 'stated' } = opts;
  if (!type) throw new Error('--type est requis');
  if (!name) throw new Error('--name est requis');
  if (fact && looksSecret(fact)) {
    throw new Error('refus : ce fait ressemble a un secret (carte, identifiant, e-mail, mot de passe). Rien n’a ete ecrit.');
  }

  const abs = fileForType(type, name);
  fs.mkdirSync(path.dirname(abs), { recursive: true });

  const created = !fs.existsSync(abs);
  if (created) {
    const meta = { name: titleizeIfSlug(name), description: description || '', aliases, axis };
    fs.writeFileSync(abs, renderFrontmatter(meta), 'utf8');
  } else {
    patchFrontmatter(abs, { description, aliases, axis });
  }
  const parsed = parseFile(abs);

  // Cibles des liens, resolues vers des noeuds existants quand c'est possible.
  const allNodes = readAllNodes();
  const resolve = buildResolver(allNodes);
  const targets = [];
  for (const l of links) {
    const id = resolve(l);
    const node = id ? allNodes.find(n => n.id === id) : null;
    if (node && node.id === parsed.id) continue; // pas d'auto-lien
    const label = node ? node.name : titleizeIfSlug(l);
    if (!targets.some(t => (id && t.id === id) || norm(t.label) === norm(label))) targets.push({ id, label });
  }
  const hasLink = (text, t) => extractWikilinks(text).some(w => (t.id && resolve(w) === t.id) || norm(w) === norm(t.label));
  const asLinks = list => list.map(t => '[[' + t.label + ']]').join(' ');

  const report = { file: path.relative(ROOT, abs), created, factAdded: false, linksAdded: [], skipped: false };

  if (!fact && targets.length === 0) {
    report.skipped = !created;
    return report;
  }

  const content = fs.readFileSync(abs, 'utf8');
  const existing = parsed.facts;

  if (fact) {
    const key = factKey(fact);
    const match = existing.find(f => factKey(f.text) === key);
    if (match) {
      // Fait deja present : on complete seulement ses liens manquants.
      const missing = targets.filter(t => !hasLink(match.text, t));
      if (missing.length) {
        const oldLine = '[' + match.tag + '] ' + match.text;
        fs.writeFileSync(abs, content.replace(oldLine, oldLine + ' ' + asLinks(missing)), 'utf8');
        report.linksAdded = missing.map(t => t.label);
      }
      return report;
    }
    let line = '[' + tag + '] ' + fact.trim();
    const missing = targets.filter(t => !hasLink(line, t));
    if (missing.length) line += ' ' + asLinks(missing);
    appendLine(abs, line);
    report.factAdded = true;
    report.linksAdded = missing.map(t => t.label);
    report.line = line;
    return report;
  }

  // Pas de fait : les liens vont sur la ligne [links] du fichier, sans doublon.
  const body = existing.map(f => f.text).join('\n');
  const missing = targets.filter(t => !hasLink(body, t));
  if (missing.length) {
    const linksFact = existing.find(f => f.tag === 'links');
    if (linksFact) {
      const oldLine = '[links] ' + linksFact.text;
      fs.writeFileSync(abs, content.replace(oldLine, oldLine + ' ' + asLinks(missing)), 'utf8');
    } else {
      appendLine(abs, '[links] ' + asLinks(missing));
    }
    report.linksAdded = missing.map(t => t.label);
  }
  return report;
}

/** Complete description, aliases et axe d'un fichier existant sans rien ecraser. */
function patchFrontmatter(abs, patch) {
  const raw = fs.readFileSync(abs, 'utf8');
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/.exec(raw);
  if (!m) return false;
  const parsed = parseFile(abs);
  let block = m[1];
  let changed = false;

  if (patch.description && !parsed.description) {
    if (/^description\s*:/m.test(block)) {
      block = block.replace(/^description\s*:.*$/m, 'description: ' + patch.description);
    } else {
      block += '\ndescription: ' + patch.description;
    }
    changed = true;
  }

  const incoming = (patch.aliases || []).filter(a => a && !parsed.aliases.some(x => norm(x) === norm(a)));
  if (incoming.length) {
    const merged = parsed.aliases.concat(incoming);
    if (/^aliases\s*:/m.test(block)) {
      block = block.replace(/^aliases\s*:.*(?:\n\s*-\s+.*)*$/m, 'aliases: [' + merged.join(', ') + ']');
    } else {
      block += '\naliases: [' + merged.join(', ') + ']';
    }
    changed = true;
  }

  if (patch.axis && !parsed.axis) {
    block += '\naxis: ' + patch.axis;
    changed = true;
  }

  if (!changed) return false;
  fs.writeFileSync(abs, raw.replace(m[0], '---\n' + block + '\n---\n'), 'utf8');
  return true;
}

/** Supprime un noeud. Correspondance exacte seulement : jamais d'a-peu-pres pour effacer. */
function removeNode(query) {
  const nodes = readAllNodes();
  const id = buildResolver(nodes)(query);
  const node = id ? nodes.find(n => n.id === id) : null;
  if (!node) throw new Error('noeud introuvable : « ' + query + ' » (nom exact, alias ou nom de fichier)');
  if (node.type === 'profile') throw new Error('le profil ne se supprime pas');
  fs.unlinkSync(path.join(BRAIN_DIR, node.file));
  return node;
}

/** Fusionne un .md externe (meme format) sans ecraser les faits presents. */
function importPath(target) {
  const abs = path.resolve(process.cwd(), target);
  if (!fs.existsSync(abs)) throw new Error('introuvable : ' + target);
  const files = fs.statSync(abs).isDirectory() ? walkMarkdown(abs) : [abs];
  const reports = [];

  for (const file of files) {
    if (path.resolve(file).startsWith(path.resolve(BRAIN_DIR) + path.sep)) continue; // deja dans le cerveau
    const src = parseFileExternal(file);
    const dest = fileForType(src.type, src.name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    const created = !fs.existsSync(dest);
    if (created) {
      fs.writeFileSync(dest, renderFrontmatter(src), 'utf8');
    } else {
      patchFrontmatter(dest, src);
    }

    const present = new Set(parseFile(dest).facts.map(f => factKey(f.text)));
    let added = 0, skippedSecret = 0;
    for (const f of src.facts) {
      const key = factKey(f.text);
      if (!key || present.has(key)) continue;
      if (looksSecret(f.text)) { skippedSecret++; continue; }
      appendLine(dest, '[' + (f.tag || 'stated') + '] ' + f.text);
      present.add(key);
      added++;
    }
    reports.push({
      source: path.isAbsolute(target) ? file : path.relative(process.cwd(), file),
      dest: path.relative(ROOT, dest),
      created, added, skippedSecret,
      total: src.facts.length
    });
  }
  return reports;
}

/** Comme parseFile mais pour un fichier hors de brain/ : le type vient du frontmatter ou du dossier parent. */
function parseFileExternal(abs) {
  const raw = fs.readFileSync(abs, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const name = (typeof data.name === 'string' && data.name.trim())
    ? data.name.trim()
    : titleize(path.basename(abs, path.extname(abs)));

  let type = typeof data.type === 'string' ? data.type.trim().toLowerCase() : '';
  if (!TYPE_TO_DIR[type]) {
    const parent = path.basename(path.dirname(abs));
    type = DIR_TO_TYPE[parent] || (path.basename(abs).toLowerCase() === 'profile.md' ? 'profile' : 'topic');
  }

  return {
    name,
    type,
    aliases: parseAliases(data.aliases),
    axis: typeof data.axis === 'string' ? data.axis.trim() : '',
    description: typeof data.description === 'string' ? data.description.trim() : '',
    facts: parseFacts(body)
  };
}

// ----------------------------------------------------------------- publication

/**
 * Ecrit l'instantane du graphe lu par la page en ligne (GitHub Pages n'execute
 * aucun serveur : la page ne peut lire qu'un fichier statique).
 */
function exportStatic() {
  const graph = buildGraph(readAllNodes());
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(graph) + '\n', 'utf8');
  return { file: path.relative(ROOT, DATA_FILE), nodes: graph.nodes.length, links: graph.links.length };
}

function makeGit() {
  const { execFileSync } = require('child_process');
  return (...args) => execFileSync('git', args, {
    cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
}

function rebaseInProgress(git) {
  const dir = path.resolve(ROOT, git('rev-parse', '--git-dir'));
  return fs.existsSync(path.join(dir, 'rebase-merge')) || fs.existsSync(path.join(dir, 'rebase-apply'));
}

/**
 * Recupere ce qui a ete pousse ailleurs (une autre machine, une autre session).
 *
 * Les fiches brain/*.md fusionnent seules : on n'y fait qu'ajouter des lignes,
 * et .gitattributes leur donne merge=union. Reste cerveau/data.json, genere sur
 * une seule ligne, qui entre forcement en conflit : on le regenere. Tout autre
 * conflit annule le rebase, pour ne jamais laisser le depot a moitie rebase.
 */
function pullRebase(git, branch) {
  try {
    git('pull', '--rebase', 'origin', branch);
    return;
  } catch (_) {
    // conflits possibles, traites ci-dessous
  }
  for (let i = 0; i < 100 && rebaseInProgress(git); i++) {
    const conflicted = git('diff', '--name-only', '--diff-filter=U').split('\n').filter(Boolean);
    const others = conflicted.filter(f => f !== 'cerveau/data.json');
    if (others.length) {
      try { git('rebase', '--abort'); } catch (_) {}
      throw new Error('conflit sur ' + others.join(', ') + ', a resoudre a la main (rebase annule, rien n\'est perdu)');
    }
    if (conflicted.length) {
      exportStatic();
      git('add', 'cerveau/data.json');
    }
    try {
      git('-c', 'core.editor=true', 'rebase', '--continue');
    } catch (_) {
      const left = git('diff', '--name-only', '--diff-filter=U');
      if (!left && rebaseInProgress(git)) {
        try { git('rebase', '--skip'); } catch (_) {} // commit devenu vide
      }
    }
  }
  if (rebaseInProgress(git)) {
    try { git('rebase', '--abort'); } catch (_) {}
    throw new Error('rebase interminable, annule (rien n\'est perdu)');
  }
}

/** Pousse, et en cas de refus (quelqu'un a pousse entre-temps) rebase puis reessaie. */
function pushWithRetry(git, branch) {
  let last = null;
  for (const wait of [0, 2000, 4000, 8000, 16000]) {
    if (wait) sleep(wait);
    try {
      git('push', '-u', 'origin', 'HEAD:' + branch);
      return;
    } catch (err) {
      last = err;
      if (/rejected|non-fast-forward|fetch first/i.test(String(err.stderr || err.message))) {
        pullRebase(git, branch);
        commitSnapshot(git); // l'instantane doit refleter les ecritures des deux cotes
      }
    }
  }
  throw new Error('push impossible apres 5 tentatives : ' + firstLine(last));
}

/** Regenere data.json et le commit s'il a change (apres un rebase par exemple). */
function commitSnapshot(git) {
  exportStatic();
  git('add', '--', 'cerveau/data.json');
  if (git('diff', '--cached', '--name-only', '--', 'cerveau/data.json')) {
    git('commit', '-m', 'cerveau : instantane');
  }
}

/**
 * GitHub Pages publie la branche main. Si l'on travaille sur une autre branche,
 * on y pousse aussi HEAD, mais seulement en avance rapide : jamais d'ecrasement.
 */
function mirrorMain(git) {
  try {
    git('fetch', 'origin', 'main');
    try {
      git('merge-base', '--is-ancestor', 'origin/main', 'HEAD');
    } catch (_) {
      return { ok: false, reason: 'main a diverge, fusion a faire a la main' };
    }
    git('push', 'origin', 'HEAD:main');
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: firstLine(err) };
  }
}

/** Regenere l'instantane, commit ce qui a change dans le cerveau, et pousse. */
function publish() {
  const git = makeGit();
  if (rebaseInProgress(git)) throw new Error('un rebase git est en cours dans ce depot : le terminer ou l\'annuler d\'abord');
  const snapshot = exportStatic();
  const paths = ['brain', 'cerveau/data.json'];
  git('add', '-A', '--', ...paths);
  const staged = git('diff', '--cached', '--name-only', '--', ...paths).split('\n').filter(Boolean);

  if (staged.length) {
    const names = [...new Set(staged.filter(f => f.startsWith('brain/')).map(f => path.basename(f, '.md')))];
    const label = names.length
      ? names.slice(0, 5).join(', ') + (names.length > 5 ? ' +' + (names.length - 5) : '')
      : 'instantane';
    git('commit', '-m', 'cerveau : ' + label);
  }

  const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
  let ahead = 1;
  try { ahead = Number(git('rev-list', '--count', '@{u}..HEAD')); } catch (_) { /* pas d'amont : on pousse */ }
  if (!staged.length && ahead === 0) return { pushed: false, reason: 'rien de nouveau', snapshot };

  pushWithRetry(git, branch);
  const mirrored = branch !== 'main' ? mirrorMain(git) : null;
  return { pushed: true, branch, files: staged, snapshot, mirrored };
}

// ------------------------------------------------------------------------ CLI

const BOOLEAN_FLAGS = new Set(['no-push']);

function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq > -1) {
        flags[a.slice(2, eq)] = a.slice(eq + 1);
      } else {
        const key = a.slice(2);
        const next = argv[i + 1];
        if (BOOLEAN_FLAGS.has(key) || next === undefined || next.startsWith('--')) flags[key] = true;
        else { flags[key] = next; i++; }
      }
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

function listFlag(v) {
  if (v === undefined || v === true) return [];
  return String(v).split(',').map(s => s.trim()).filter(Boolean);
}

const USAGE = `cerveau — capture et consultation

  node brain.js add --type <profile|hub|area|project|person|topic|agent> --name <nom> \\
                    [--axis <hub>] [--fact "..."] [--link a,b] [--description "..."] [--alias x,y]
  node brain.js search "<mot>"
  node brain.js show <nom>
  node brain.js remove <nom>
  node brain.js import <fichier|dossier>
  node brain.js list
  node brain.js check              liens [[...]] introuvables, noeuds sans axe
  node brain.js publish            regenere cerveau/data.json, commit et push
  node brain.js export             regenere cerveau/data.json seulement

  add, remove et import publient d'eux-memes. --no-push (ou BRAIN_NO_PUSH=1) pour ne rien envoyer.
`;

/** Apres chaque ecriture : instantane, puis publication sauf refus explicite. */
function afterWrite(flags) {
  if (flags['no-push'] || process.env.BRAIN_NO_PUSH === '1') {
    exportStatic();
    return;
  }
  try {
    const r = publish();
    if (!r.pushed) return;
    let line = 'publie sur ' + r.branch;
    if (r.mirrored) line += r.mirrored.ok ? ' + main (page en ligne)' : ' — main non mis a jour : ' + r.mirrored.reason;
    console.log(line);
  } catch (err) {
    console.error('brain: ECRIT MAIS PAS PUBLIE — ' + err.message);
    console.error('       relance « node brain.js publish » quand le reseau revient.');
    process.exitCode = 3;
  }
}

function cmdAdd(flags) {
  const report = addFact({
    type: typeof flags.type === 'string' ? flags.type.trim().toLowerCase() : '',
    name: typeof flags.name === 'string' ? flags.name : '',
    fact: typeof flags.fact === 'string' ? flags.fact : '',
    links: listFlag(flags.link).concat(listFlag(flags.links)),
    description: typeof flags.description === 'string' ? flags.description : '',
    aliases: listFlag(flags.alias).concat(listFlag(flags.aliases)),
    axis: typeof flags.axis === 'string' ? flags.axis.trim() : '',
    tag: typeof flags.tag === 'string' ? flags.tag : 'stated'
  });

  const bits = [];
  if (report.created) bits.push('fichier cree');
  if (report.factAdded) bits.push('fait ajoute');
  else if (!report.skipped && !report.created && !report.linksAdded.length) bits.push('fait deja present');
  if (report.linksAdded.length) bits.push('liens : ' + report.linksAdded.map(l => '[[' + l + ']]').join(' '));
  if (report.skipped) bits.push('rien a ecrire (ni --fact ni --link)');
  console.log(report.file + ' — ' + (bits.join(', ') || 'inchange'));
  if (!report.skipped) afterWrite(flags);
}

function cmdSearch(query) {
  const nodes = readAllNodes();
  const results = searchNodes(nodes, query);
  if (!results.length) {
    console.log('aucun resultat pour « ' + query + ' »');
    return;
  }
  for (const r of results) {
    console.log('\n' + r.node.name + '  (' + r.node.type + ', ' + r.node.file + ')');
    if (r.node.description) console.log('  ' + r.node.description);
    for (const h of r.hits.slice(0, 8)) console.log('  · ' + h);
  }
  console.log('');
}

function cmdShow(query) {
  const nodes = readAllNodes();
  const node = findNode(nodes, query);
  if (!node) {
    console.log('noeud introuvable : « ' + query + ' »');
    process.exitCode = 1;
    return;
  }
  const graph = buildGraph(nodes);
  const gn = graph.nodes.find(n => n.id === node.id);
  console.log('\n' + node.name + '  (' + node.type + (gn.axis ? ', axe ' + path.basename(gn.axis) : '') + ')');
  console.log('fichier  : ' + node.file);
  console.log('maj      : ' + new Date(node.updated).toISOString());
  if (node.aliases.length) console.log('aliases  : ' + node.aliases.join(', '));
  if (node.description) console.log('\n' + node.description);
  console.log('\nfaits (' + node.facts.length + ')');
  for (const f of node.facts) console.log('  [' + f.tag + '] ' + f.text);
  const nb = neighborsOf(graph, node.id);
  console.log('\nvoisins (' + nb.length + ')');
  for (const n of nb) console.log('  ' + n.name + '  (' + n.type + ', ' + n.kind + ')');
  console.log('');
}

function cmdRemove(query, flags) {
  const node = removeNode(query);
  console.log('brain/' + node.file + ' — supprime (' + node.name + ')');
  afterWrite(flags);
}

function cmdImport(target, flags) {
  const reports = importPath(target);
  if (!reports.length) {
    console.log('aucun .md importable dans ' + target);
    return;
  }
  for (const r of reports) {
    console.log(r.source + ' -> ' + r.dest + ' : ' + r.added + '/' + r.total + ' fait(s) ajoute(s)'
      + (r.created ? ', fichier cree' : '')
      + (r.skippedSecret ? ', ' + r.skippedSecret + ' ignore(s) (secret)' : ''));
  }
  afterWrite(flags);
}

function cmdList() {
  const graph = buildGraph(readAllNodes());
  for (const n of graph.nodes) {
    console.log(String(n.degree).padStart(3) + '  ' + n.type.padEnd(8) + '  '
      + (n.axis ? path.basename(n.axis) : '—').padEnd(20) + '  ' + n.name + '  (' + n.file + ')');
  }
  const axes = graph.nodes.filter(n => n.type === 'hub').length;
  console.log('\n' + graph.nodes.length + ' noeuds, ' + graph.links.length + ' liens, ' + axes + ' axes');
}

function cmdCheck() {
  const nodes = readAllNodes();
  const resolve = buildResolver(nodes);
  const graph = buildGraph(nodes);
  let problems = 0;
  for (const n of nodes) {
    for (const w of n.wikilinks) {
      if (!resolve(w)) { console.log('lien introuvable   ' + n.file + ' : [[' + w + ']]'); problems++; }
    }
  }
  for (const n of graph.nodes) {
    if (n.type !== 'profile' && !n.axis) { console.log('sans axe           ' + n.file); problems++; }
    if (n.type !== 'profile' && n.degree === 0) { console.log('isole              ' + n.file); problems++; }
  }
  console.log(problems ? '\n' + problems + ' probleme(s)' : 'tout est relie : ' + graph.nodes.length + ' noeuds, ' + graph.links.length + ' liens');
  if (problems) process.exitCode = 1;
}

function cmdPublish() {
  const r = publish();
  if (!r.pushed) return console.log('rien a publier (' + r.reason + ')');
  let line = 'publie sur ' + r.branch;
  if (r.mirrored) line += r.mirrored.ok ? ' + main (page en ligne)' : ' — main non mis a jour : ' + r.mirrored.reason;
  console.log(line + '  (' + r.snapshot.nodes + ' noeuds, ' + r.snapshot.links + ' liens)');
}

function main(argv) {
  const cmd = argv[0];
  const { flags, positional } = parseArgs(argv.slice(1));
  try {
    switch (cmd) {
      case 'add': return cmdAdd(flags);
      case 'search': return cmdSearch(positional.join(' ') || String(flags.q || ''));
      case 'show': return cmdShow(positional.join(' ') || String(flags.name || ''));
      case 'remove': return cmdRemove(positional.join(' ') || String(flags.name || ''), flags);
      case 'import': return cmdImport(positional[0] || String(flags.path || ''), flags);
      case 'list': return cmdList();
      case 'check': return cmdCheck();
      case 'publish': return cmdPublish();
      case 'export': {
        const r = exportStatic();
        return console.log(r.file + ' — ' + r.nodes + ' noeuds, ' + r.links + ' liens');
      }
      case 'graph': return console.log(JSON.stringify(buildGraph(readAllNodes()), null, 2));
      default:
        console.log(USAGE);
        if (cmd && cmd !== 'help' && cmd !== '--help') process.exitCode = 1;
    }
  } catch (err) {
    console.error('brain: ' + err.message);
    process.exitCode = 1;
  }
}

module.exports = {
  BRAIN_DIR, ROOT, DATA_FILE, TYPE_TO_DIR, DIR_TO_TYPE,
  readAllNodes, buildGraph, buildResolver, searchNodes, findNode, neighborsOf,
  addFact, removeNode, importPath, exportStatic, publish,
  slugify, norm, looksSecret
};

if (require.main === module) main(process.argv.slice(2));
