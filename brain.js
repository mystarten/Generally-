#!/usr/bin/env node
'use strict';

/*
 * brain.js — cerveau IA : parseur, graphe et CLI.
 * Zero dependance. Sert aussi de module a server.js.
 *
 *   node brain.js add --type area --name starten --fact "..." --link starten,zenithia
 *   node brain.js search "mot"
 *   node brain.js show nom
 *   node brain.js import <fichier|dossier>
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BRAIN_DIR = path.join(ROOT, 'brain');

const TYPE_TO_DIR = {
  profile: '.',
  area: 'areas',
  person: 'people',
  topic: 'topics',
  agent: 'agents'
};
const DIR_TO_TYPE = {
  '.': 'profile',
  areas: 'area',
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

// Regle 5 : jamais de numeros de carte, identifiants ou mots de passe.
const SECRET_PATTERNS = [
  /\b(?:\d[ -]?){13,19}\b/,
  /\b(mot\s+de\s+passe|password|passwd|pwd)\b/i,
  /\b(api[\s_-]?key|cle\s+api|secret\s+key|client\s+secret|private\s+key)\b/i,
  /\b(cvv|cvc|iban|bic)\b/i
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

function stripQuotes(s) {
  return String(s).trim().replace(/^["']|["']$/g, '').trim();
}

function extractWikilinks(text) {
  const out = [];
  const re = /\[\[([^\[\]|]+)(?:\|[^\[\]]*)?\]\]/g;
  let m;
  while ((m = re.exec(text)) !== null) out.push(m[1].trim());
  return out;
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

  let aliases = data.aliases;
  if (typeof aliases === 'string') aliases = aliases.split(',');
  aliases = (Array.isArray(aliases) ? aliases : []).map(a => String(a).trim()).filter(Boolean);

  const facts = [];
  for (const line of body.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith('<!--')) continue;
    const m = /^\[([a-zA-Z]+)\]\s*(.+)$/.exec(t);
    if (m) facts.push({ tag: m[1].toLowerCase(), text: m[2].trim() });
  }

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
    aliases,
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

function buildResolver(nodes) {
  const index = new Map();
  const put = (key, id) => {
    const k = norm(key);
    if (k.length >= 2 && !index.has(k)) index.set(k, id);
  };
  for (const n of nodes) {
    put(n.name, n.id);
    put(n.slug, n.id);
    put(n.id, n.id);
    put(path.basename(n.id), n.id);
    for (const a of n.aliases) put(a, n.id);
  }
  return term => index.get(norm(term)) || null;
}

function buildGraph(nodes) {
  const resolve = buildResolver(nodes);
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
    const haystack = norm([n.description, ...n.facts.map(f => f.text)].join(' \n '));
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

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

/** Ajoute (ou complete) un fait dans un fichier. Retourne un rapport. */
function addFact(opts) {
  const { type, name, fact, links = [], description, aliases = [], tag = 'stated' } = opts;
  if (!type) throw new Error('--type est requis');
  if (!name) throw new Error('--name est requis');
  if (fact && looksSecret(fact)) {
    throw new Error('refus : ce fait ressemble a un secret (carte, identifiant, mot de passe). Rien n’a ete ecrit.');
  }

  const abs = fileForType(type, name);
  fs.mkdirSync(path.dirname(abs), { recursive: true });

  const created = !fs.existsSync(abs);
  let parsed;
  if (created) {
    const meta = { name: titleizeIfSlug(name), description: description || '', aliases };
    fs.writeFileSync(abs, renderFrontmatter(meta), 'utf8');
    parsed = parseFile(abs);
  } else {
    parsed = parseFile(abs);
    patchFrontmatter(abs, { description, aliases });
    parsed = parseFile(abs);
  }

  // Resolution des cibles de liens vers des noms canoniques quand ils existent.
  const allNodes = readAllNodes();
  const resolve = buildResolver(allNodes);
  const linkLabels = [];
  for (const l of links) {
    const target = resolve(l);
    const node = target ? allNodes.find(n => n.id === target) : null;
    const label = node ? node.name : titleizeIfSlug(l);
    if (node && node.id === parsed.id) continue; // pas d'auto-lien
    if (!linkLabels.some(x => norm(x) === norm(label))) linkLabels.push(label);
  }

  const report = { file: path.relative(ROOT, abs), created, factAdded: false, linksAdded: [], skipped: false };

  if (!fact && linkLabels.length === 0) {
    report.skipped = true;
    return report;
  }

  const content = fs.readFileSync(abs, 'utf8');
  const existing = parsed.facts;

  if (fact) {
    const key = factKey(fact);
    const match = existing.find(f => factKey(f.text) === key);
    if (match) {
      // Fait deja present : on complete seulement ses liens manquants.
      const missing = linkLabels.filter(l => !new RegExp('\\[\\[\\s*' + escapeRe(l) + '\\s*\\]\\]', 'i').test(match.text));
      if (missing.length) {
        const oldLine = '[' + match.tag + '] ' + match.text;
        const newLine = oldLine + ' ' + missing.map(l => '[[' + l + ']]').join(' ');
        fs.writeFileSync(abs, content.replace(oldLine, newLine), 'utf8');
        report.linksAdded = missing;
      }
      return report;
    }
    let line = '[' + tag + '] ' + fact.trim();
    const missing = linkLabels.filter(l => !new RegExp('\\[\\[\\s*' + escapeRe(l) + '\\s*\\]\\]', 'i').test(line));
    if (missing.length) line += ' ' + missing.map(l => '[[' + l + ']]').join(' ');
    appendLine(abs, line);
    report.factAdded = true;
    report.linksAdded = missing;
    report.line = line;
    return report;
  }

  // Pas de fait : on ajoute une ligne de liens, sans dupliquer.
  const bodyNorm = existing.map(f => f.text).join('\n');
  const missing = linkLabels.filter(l => !new RegExp('\\[\\[\\s*' + escapeRe(l) + '\\s*\\]\\]', 'i').test(bodyNorm));
  if (missing.length) {
    const line = '[' + tag + '] ' + missing.map(l => '[[' + l + ']]').join(' ');
    appendLine(abs, line);
    report.linksAdded = missing;
    report.line = line;
  }
  return report;
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

/** Complete description/aliases d'un fichier existant sans rien ecraser. */
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

  if (!changed) return false;
  fs.writeFileSync(abs, raw.replace(m[0], '---\n' + block + '\n---\n'), 'utf8');
  return true;
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
    const type = src.type;
    const dest = fileForType(type, src.name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    const created = !fs.existsSync(dest);
    if (created) {
      fs.writeFileSync(dest, renderFrontmatter({ name: src.name, description: src.description, aliases: src.aliases }), 'utf8');
    } else {
      patchFrontmatter(dest, { description: src.description, aliases: src.aliases });
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
      source: path.relative(process.cwd(), file),
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

  let aliases = data.aliases;
  if (typeof aliases === 'string') aliases = aliases.split(',');
  aliases = (Array.isArray(aliases) ? aliases : []).map(a => String(a).trim()).filter(Boolean);

  let type = typeof data.type === 'string' ? data.type.trim().toLowerCase() : '';
  if (!TYPE_TO_DIR[type]) {
    const parent = path.basename(path.dirname(abs));
    type = DIR_TO_TYPE[parent] || (path.basename(abs).toLowerCase() === 'profile.md' ? 'profile' : 'topic');
  }

  const facts = [];
  for (const line of body.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const m = /^\[([a-zA-Z]+)\]\s*(.+)$/.exec(t);
    if (m) facts.push({ tag: m[1].toLowerCase(), text: m[2].trim() });
  }

  return {
    name,
    type,
    aliases,
    description: typeof data.description === 'string' ? data.description.trim() : '',
    facts
  };
}

// ----------------------------------------------------------------- publication

const DATA_FILE = path.join(ROOT, 'cerveau', 'data.json');

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

/** Regenere l'instantane puis l'envoie sur GitHub, si quelque chose a change. */
function publish() {
  const { execFileSync } = require('child_process');
  const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

  const snapshot = exportStatic();
  const paths = ['brain', 'cerveau/data.json'];
  git('add', '--', ...paths);
  const staged = git('diff', '--cached', '--name-only', '--', ...paths);
  if (!staged) return { pushed: false, reason: 'rien de nouveau', snapshot };

  const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
  const count = staged.split('\n').filter(Boolean).length;
  git('commit', '-m', 'cerveau : mise a jour (' + count + ' fichier(s))');

  let lastErr = null;
  for (const wait of [0, 2000, 4000, 8000, 16000]) {
    if (wait) execFileSync('sleep', [String(wait / 1000)]);
    try {
      git('push', 'origin', branch);
      return { pushed: true, branch, files: staged.split('\n').filter(Boolean), snapshot };
    } catch (err) {
      lastErr = err;
    }
  }
  throw new Error('push impossible apres 5 tentatives : ' + (lastErr && lastErr.message));
}

// ------------------------------------------------------------------------ CLI

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
        const next = argv[i + 1];
        if (next === undefined || next.startsWith('--')) flags[a.slice(2)] = true;
        else { flags[a.slice(2)] = next; i++; }
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

  node brain.js add --type <profile|area|person|topic|agent> --name <nom> \\
                    [--fact "..."] [--link a,b] [--description "..."] [--alias x,y]
  node brain.js search "<mot>"
  node brain.js show <nom>
  node brain.js import <fichier|dossier>
  node brain.js list
  node brain.js publish            regenere cerveau/data.json, commit et push
  node brain.js export             regenere cerveau/data.json seulement
`;

function cmdAdd(flags) {
  const report = addFact({
    type: typeof flags.type === 'string' ? flags.type.trim().toLowerCase() : '',
    name: typeof flags.name === 'string' ? flags.name : '',
    fact: typeof flags.fact === 'string' ? flags.fact : '',
    links: listFlag(flags.link).concat(listFlag(flags.links)),
    description: typeof flags.description === 'string' ? flags.description : '',
    aliases: listFlag(flags.alias).concat(listFlag(flags.aliases)),
    tag: typeof flags.tag === 'string' ? flags.tag : 'stated'
  });

  const bits = [];
  if (report.created) bits.push('fichier cree');
  if (report.factAdded) bits.push('fait ajoute');
  else if (!report.skipped && !report.linksAdded.length) bits.push('fait deja present');
  if (report.linksAdded.length) bits.push('liens : ' + report.linksAdded.map(l => '[[' + l + ']]').join(' '));
  if (report.skipped) bits.push('rien a ecrire (ni --fact ni --link)');
  console.log(report.file + ' — ' + (bits.join(', ') || 'inchange'));
  if (!report.skipped) exportStatic();
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
  console.log('\n' + node.name + '  (' + node.type + ')');
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

function cmdImport(target) {
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
  exportStatic();
}

function cmdList() {
  const graph = buildGraph(readAllNodes());
  for (const n of graph.nodes) {
    console.log(String(n.degree).padStart(3) + '  ' + n.type.padEnd(8) + '  ' + n.name + '  (' + n.file + ')');
  }
  console.log('\n' + graph.nodes.length + ' noeuds, ' + graph.links.length + ' liens');
}

function main(argv) {
  const cmd = argv[0];
  const { flags, positional } = parseArgs(argv.slice(1));
  try {
    switch (cmd) {
      case 'add': return cmdAdd(flags);
      case 'search': return cmdSearch(positional.join(' ') || String(flags.q || ''));
      case 'show': return cmdShow(positional.join(' ') || String(flags.name || ''));
      case 'import': return cmdImport(positional[0] || String(flags.path || ''));
      case 'list': return cmdList();
      case 'export': {
        const r = exportStatic();
        return console.log(r.file + ' — ' + r.nodes + ' noeuds, ' + r.links + ' liens');
      }
      case 'publish': {
        const r = publish();
        if (!r.pushed) return console.log('rien a publier (' + r.reason + ')');
        return console.log('publie sur ' + r.branch + ' — ' + r.files.join(', ')
          + '  (' + r.snapshot.nodes + ' noeuds, ' + r.snapshot.links + ' liens)');
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
  BRAIN_DIR, ROOT, TYPE_TO_DIR, DIR_TO_TYPE,
  readAllNodes, buildGraph, searchNodes, findNode, neighborsOf,
  addFact, importPath, slugify, norm, looksSecret,
  exportStatic, publish, DATA_FILE
};

if (require.main === module) main(process.argv.slice(2));
