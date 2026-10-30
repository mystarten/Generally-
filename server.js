#!/usr/bin/env node
'use strict';

/*
 * server.js — sert l'interface du cerveau, surveille brain/ et pousse
 * le graphe au navigateur en direct par Server-Sent Events.
 * Zero dependance (d3 est servi depuis lib/d3.min.js).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const brain = require('./brain.js');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const UI_DIR = path.join(ROOT, 'brain-ui');
const BRAIN_DIR = brain.BRAIN_DIR;
const DEBOUNCE_MS = 120;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// ------------------------------------------------------------------- graphe

let graph = { generated: 0, nodes: [], links: [] };
let nodes = [];

function rebuild(reason) {
  try {
    nodes = brain.readAllNodes();
    graph = brain.buildGraph(nodes);
    log(reason + ' → ' + graph.nodes.length + ' noeuds, ' + graph.links.length + ' liens');
    return true;
  } catch (err) {
    log('erreur de reconstruction : ' + err.message);
    return false;
  }
}

function log(msg) {
  console.log('[' + new Date().toLocaleTimeString('fr-FR') + '] ' + msg);
}

// ---------------------------------------------------------------------- SSE

/** @type {Set<import('http').ServerResponse>} */
const clients = new Set();

function broadcast() {
  const payload = 'event: graph\ndata: ' + JSON.stringify(graph) + '\n\n';
  for (const res of clients) {
    try { res.write(payload); } catch (_) { clients.delete(res); }
  }
  if (clients.size) log('pousse a ' + clients.size + ' client(s)');
}

function handleEvents(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  res.write('retry: 1500\n\n');
  res.write('event: graph\ndata: ' + JSON.stringify(graph) + '\n\n');
  clients.add(res);
  log('client connecte (' + clients.size + ')');

  const ping = setInterval(() => {
    try { res.write(': ping\n\n'); } catch (_) {}
  }, 25000);

  req.on('close', () => {
    clearInterval(ping);
    clients.delete(res);
    log('client deconnecte (' + clients.size + ')');
  });
}

// ------------------------------------------------------------------ fs.watch

let timer = null;
const watchers = new Map();

function scheduleRebuild(label) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    if (rebuild(label)) {
      ensureWatchers();
      broadcast();
    }
  }, DEBOUNCE_MS);
}

/**
 * fs.watch recursif n'existe pas sur Linux : on surveille chaque dossier,
 * et on reinstalle les watchers a chaque changement d'arborescence.
 */
function watchDir(dir) {
  if (watchers.has(dir)) return;
  let w;
  try {
    w = fs.watch(dir, { recursive: process.platform !== 'linux' }, (_event, filename) => {
      if (filename && !/\.md$/i.test(String(filename)) && path.extname(String(filename))) return;
      scheduleRebuild('changement : ' + (filename || path.basename(dir)));
    });
  } catch (err) {
    log('surveillance impossible pour ' + dir + ' : ' + err.message);
    return;
  }
  w.on('error', () => { try { w.close(); } catch (_) {} watchers.delete(dir); });
  watchers.set(dir, w);
}

function ensureWatchers() {
  const wanted = new Set([BRAIN_DIR]);
  (function walk(dir) {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
    for (const e of entries) {
      if (e.isDirectory() && !e.name.startsWith('.')) {
        const abs = path.join(dir, e.name);
        wanted.add(abs);
        walk(abs);
      }
    }
  })(BRAIN_DIR);

  for (const [dir, w] of watchers) {
    if (!wanted.has(dir)) { try { w.close(); } catch (_) {} watchers.delete(dir); }
  }
  for (const dir of wanted) watchDir(dir);
}

// --------------------------------------------------------------------- HTTP

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

function sendFile(res, abs) {
  fs.readFile(abs, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(buf);
  });
}

/** Resout un chemin statique en empechant toute sortie des dossiers autorises. */
function resolveStatic(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\?.*$/, '');
  if (clean === '/' || clean === '/index.html') return path.join(UI_DIR, 'index.html');

  const candidates = [
    { base: UI_DIR, rel: clean.replace(/^\/+/, '') },
    { base: path.join(ROOT, 'lib'), rel: clean.replace(/^\/+lib\/+/, '') }
  ];
  for (const c of candidates) {
    if (!c.rel || c.rel.includes('\0')) continue;
    const abs = path.resolve(c.base, c.rel);
    const base = path.resolve(c.base);
    if (abs !== base && !abs.startsWith(base + path.sep)) continue;
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET' });
    res.end();
    return;
  }

  if (p === '/events') return handleEvents(req, res);

  if (p === '/api/graph') return sendJson(res, 200, graph);

  if (p === '/api/search') {
    const q = url.searchParams.get('q') || '';
    const results = brain.searchNodes(nodes, q).map(r => ({
      id: r.node.id,
      name: r.node.name,
      type: r.node.type,
      description: r.node.description,
      score: r.score,
      hits: r.hits.slice(0, 6)
    }));
    return sendJson(res, 200, { query: q, count: results.length, results });
  }

  if (p.startsWith('/api/node/')) {
    const name = p.slice('/api/node/'.length);
    if (!name) return sendJson(res, 400, { error: 'nom manquant' });
    const node = brain.findNode(nodes, decodeURIComponent(name));
    if (!node) return sendJson(res, 404, { error: 'noeud introuvable', query: decodeURIComponent(name) });
    return sendJson(res, 200, {
      id: node.id,
      name: node.name,
      type: node.type,
      description: node.description,
      aliases: node.aliases,
      facts: node.facts,
      file: node.file,
      updated: node.updated,
      neighbors: brain.neighborsOf(graph, node.id)
    });
  }

  const abs = resolveStatic(p);
  if (abs) return sendFile(res, abs);

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404');
});

rebuild('demarrage');
ensureWatchers();

server.listen(PORT, () => {
  log('cerveau sur http://localhost:' + PORT);
  log('surveille ' + path.relative(ROOT, BRAIN_DIR) + '/ (' + watchers.size + ' dossier(s))');
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    log('arret');
    for (const [, w] of watchers) { try { w.close(); } catch (_) {} }
    for (const res of clients) { try { res.end(); } catch (_) {} }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 500);
  });
}
