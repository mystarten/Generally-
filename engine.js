'use strict';

/*
 * engine.js — le moteur local de l'interface : pose une question a Claude Code,
 * suit son travail en direct et le traduit en evenements simples pour la page.
 *
 * Il lance « claude -p --agent orchestrateur » avec le flux stream-json, puis
 * lit, ligne par ligne, ce que Claude Code publie : chaque agent lance (et par
 * qui), chaque outil utilise, chaque fiche du cerveau lue, le texte de la
 * reponse en continu, le cout et le quota. Rien n'est simule : la page ne
 * montre que ce que ce flux contient.
 *
 * Garde-fous de consommation : une seule question a la fois, plafond par
 * question (--max-budget-usd), plafond par jour, et l'orchestrateur ne delegue
 * que pour les grosses taches (consigne MOTEUR ci-dessous). Le hook Stop est
 * coupe pendant ces lancements : il relancait un tour pour rien.
 *
 * Donnees locales (jamais publiees) : .engine/config.json, .engine/runs.ndjson.
 */

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const { EventEmitter } = require('events');
const brain = require('./brain.js');

const ROOT = brain.ROOT;
const ENGINE_DIR = process.env.ENGINE_DIR ? path.resolve(process.env.ENGINE_DIR) : path.join(ROOT, '.engine');
const CONFIG_FILE = path.join(ENGINE_DIR, 'config.json');
const LEDGER_FILE = path.join(ENGINE_DIR, 'runs.ndjson');
/*
 * Comment lancer Claude Code. Sous Windows, Node ne sait pas lancer un « .cmd »
 * sans passer par cmd.exe (qui abimerait la longue consigne passee en argument) :
 *  - installeur officiel : claude.exe, lance directement ;
 *  - installation npm : on lance son script avec Node, sans le .cmd.
 */
function claudeCommand() {
  if (process.env.CLAUDE_BIN) return { cmd: process.env.CLAUDE_BIN, pre: [] };
  if (process.platform === 'win32') {
    const home = process.env.USERPROFILE || '', appdata = process.env.APPDATA || '';
    const exe = [path.join(home, '.local', 'bin', 'claude.exe'), path.join(home, 'AppData', 'Local', 'Programs', 'claude', 'claude.exe')].find(f => home && fs.existsSync(f));
    if (exe) return { cmd: exe, pre: [] };
    const cli = ['cli.js', 'cli.mjs'].map(f => path.join(appdata, 'npm', 'node_modules', '@anthropic-ai', 'claude-code', f)).find(f => appdata && fs.existsSync(f));
    if (cli) return { cmd: process.execPath, pre: [cli] };
  }
  return { cmd: 'claude', pre: [] };
}

const DEFAULTS = { model: 'sonnet', maxBudgetUsd: 1.5, dailyCapUsd: 15, maxTurns: 40, timeoutMin: 15, publishAfterRun: true,
  autoPull: true, weeklyReview: true, weeklyDay: 0, weeklyHour: 19 };
const MAX_QUESTION = 4000;
const ORCHESTRATOR = 'orchestrateur';

const ALLOWED_TOOLS = [
  'Agent', 'Read', 'Grep', 'Glob', 'Write', 'Edit', 'WebSearch', 'WebFetch',
  'Bash(node agents.js:*)', 'Bash(node brain.js:*)'
];

const ENGINE_PROMPT = [
  'MODE MOTEUR : Mats te parle depuis son interface (le cerveau et l\'equipe d\'agents dans une seule vue).',
  '- Ta reponse finale est la tienne, celle de Claude : en francais, directe, sans personnage ni signature. L\'essentiel d\'abord (la decision, le conseil), puis le detail utile.',
  '- Tu decides seul s\'il faut des agents. Question simple, factuelle, ou simple lecture du cerveau : tu reponds toi-meme apres `node brain.js search` ou `show`, sans agent et sans tache. Grosse tache qui demande plusieurs competences (programme, plan, script, candidature, bilan, arbitrage entre domaines) : tu delegues aux chefs d\'equipe concernes, en parallele quand c\'est independant.',
  '- Economie de tokens : le moins d\'agents possible, des consignes courtes, des rapports de 8 lignes maximum, jamais un agent relance pour reformuler.',
  '- Information durable donnee par Mats : note-la avec `node brain.js add` (regle 2 de CLAUDE.md).',
  '- Ne lance jamais `publish` ni `git` : le moteur publie a la fin. Ne parle pas de ce mode.'
].join('\n');

// ------------------------------------------------------------------ config

function ensureDir() { fs.mkdirSync(ENGINE_DIR, { recursive: true }); }

function readConfig() {
  let saved = {};
  try { saved = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')); } catch (_) {}
  return sanitizeConfig({ ...DEFAULTS, ...saved });
}

const clampNum = (v, lo, hi, def) => { const n = Number(v); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : def; };

function sanitizeConfig(c) {
  const model = typeof c.model === 'string' && /^(sonnet|opus|haiku|fable|claude-[a-z0-9.-]+)$/.test(c.model) ? c.model : DEFAULTS.model;
  return {
    model,
    maxBudgetUsd: clampNum(c.maxBudgetUsd, 0.1, 20, DEFAULTS.maxBudgetUsd),
    dailyCapUsd: clampNum(c.dailyCapUsd, 0.5, 200, DEFAULTS.dailyCapUsd),
    maxTurns: Math.round(clampNum(c.maxTurns, 5, 100, DEFAULTS.maxTurns)),
    timeoutMin: clampNum(c.timeoutMin, 1, 60, DEFAULTS.timeoutMin),
    publishAfterRun: typeof c.publishAfterRun === 'boolean' ? c.publishAfterRun : DEFAULTS.publishAfterRun,
    autoPull: typeof c.autoPull === 'boolean' ? c.autoPull : DEFAULTS.autoPull,
    weeklyReview: typeof c.weeklyReview === 'boolean' ? c.weeklyReview : DEFAULTS.weeklyReview,
    weeklyDay: Math.round(clampNum(c.weeklyDay, 0, 6, DEFAULTS.weeklyDay)),
    weeklyHour: Math.round(clampNum(c.weeklyHour, 0, 23, DEFAULTS.weeklyHour))
  };
}

function writeConfig(patch) {
  const next = sanitizeConfig({ ...readConfig(), ...(patch || {}) });
  ensureDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(next, null, 2) + '\n');
  return next;
}

// ------------------------------------------------------------------ registre

const localDay = (t = Date.now()) => {
  const d = new Date(t);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

function readLedger(limit = 2000) {
  let lines = [];
  try { lines = fs.readFileSync(LEDGER_FILE, 'utf8').split('\n').filter(Boolean).slice(-limit); } catch (_) {}
  return lines.map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
}

function today() {
  const day = localDay();
  const runs = readLedger().filter(r => r.day === day);
  return {
    day,
    runs: runs.length,
    costUsd: Math.round(runs.reduce((s, r) => s + (r.cost || 0), 0) * 10000) / 10000,
    outputTokens: runs.reduce((s, r) => s + ((r.tokens && r.tokens.out) || 0), 0)
  };
}

// ------------------------------------------------------- traduction du flux

/** Extrait les lectures du cerveau d'une commande shell : node brain.js show|search "<x>". */
function brainReadsInCommand(cmd) {
  const out = [];
  const re = /node\s+(?:\.\/)?brain\.js\s+(show|search)\s+(?:"([^"]*)"|'([^']*)'|([^\s;|&]+))/g;
  let m;
  while ((m = re.exec(String(cmd || ''))) !== null) {
    const q = (m[2] ?? m[3] ?? m[4] ?? '').trim();
    if (q) out.push({ kind: m[1], query: q });
  }
  return out;
}

const short = (s, n) => { s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

/**
 * Transforme les objets stream-json de Claude Code en evenements de l'interface.
 * Un appel par objet ; renvoie un tableau (souvent vide).
 */
class Normalizer {
  constructor() {
    this.toolAgent = new Map();   // id d'un appel Agent -> agent lance
    this.started = new Set();     // appels Agent deja annonces
    this.done = new Set();
  }

  actor(parentId) {
    if (!parentId) return ORCHESTRATOR;
    return this.toolAgent.get(parentId) || ORCHESTRATOR;
  }

  push(raw) {
    const ev = [];
    if (!raw || typeof raw !== 'object') return ev;
    const t = Date.now();

    if (raw.type === 'system' && raw.subtype === 'init') {
      ev.push({ type: 'session', session: raw.session_id || null, model: raw.model || null, t });
    } else if (raw.type === 'assistant' && raw.message && Array.isArray(raw.message.content)) {
      const who = this.actor(raw.parent_tool_use_id);
      for (const c of raw.message.content) {
        if (c.type !== 'tool_use') continue;
        const input = c.input || {};
        if (c.name === 'Agent' || c.name === 'Task') {
          const agent = String(input.subagent_type || 'agent');
          this.toolAgent.set(c.id, agent);
          if (!this.started.has(c.id)) {
            this.started.add(c.id);
            ev.push({ type: 'agent_start', agent, parent: who, call: c.id, description: short(input.description, 140), t });
          }
          continue;
        }
        let detail = '';
        if (c.name === 'Bash') detail = short(input.command, 120);
        else if (c.name === 'Read' || c.name === 'Write' || c.name === 'Edit') detail = short(input.file_path, 120);
        else if (c.name === 'WebSearch') detail = short(input.query, 120);
        else if (c.name === 'WebFetch') detail = short(input.url, 120);
        else if (c.name === 'Grep' || c.name === 'Glob') detail = short(input.pattern, 120);
        ev.push({ type: 'agent_activity', agent: who, tool: c.name, detail, t });
        if (c.name === 'Bash') for (const r of brainReadsInCommand(input.command)) ev.push({ type: 'brain_read', agent: who, ...r, t });
        if (c.name === 'Read' && /(^|[\\/])brain[\\/].+\.md$/.test(String(input.file_path || ''))) {
          ev.push({ type: 'brain_read', agent: who, kind: 'file', query: String(input.file_path), t });
        }
      }
    } else if (raw.type === 'system' && raw.subtype === 'task_started' && raw.tool_use_id) {
      const agent = String(raw.subagent_type || this.toolAgent.get(raw.tool_use_id) || 'agent');
      this.toolAgent.set(raw.tool_use_id, agent);
      if (!this.started.has(raw.tool_use_id)) {
        this.started.add(raw.tool_use_id);
        ev.push({ type: 'agent_start', agent, parent: ORCHESTRATOR, call: raw.tool_use_id, description: short(raw.description, 140), t });
      }
    } else if (raw.type === 'system' && raw.subtype === 'task_progress') {
      const agent = String(raw.subagent_type || this.toolAgent.get(raw.tool_use_id) || 'agent');
      ev.push({ type: 'agent_progress', agent, tool: raw.last_tool_name || null, tokens: (raw.usage && raw.usage.total_tokens) || 0, t });
    } else if (raw.type === 'system' && raw.subtype === 'task_notification' && raw.tool_use_id) {
      if (!this.done.has(raw.tool_use_id)) {
        this.done.add(raw.tool_use_id);
        const agent = this.toolAgent.get(raw.tool_use_id) || String(raw.subagent_type || 'agent');
        ev.push({ type: 'agent_done', agent, call: raw.tool_use_id, status: String(raw.status || 'completed'), summary: short(raw.summary, 600),
          tokens: (raw.usage && raw.usage.total_tokens) || 0, t });
      }
    } else if (raw.type === 'stream_event' && !raw.parent_tool_use_id && raw.event) {
      const e = raw.event;
      if (e.type === 'content_block_start' && e.content_block && e.content_block.type === 'text') ev.push({ type: 'answer_block', t });
      else if (e.type === 'content_block_delta' && e.delta && e.delta.type === 'text_delta' && e.delta.text) ev.push({ type: 'answer_delta', text: e.delta.text, t });
    } else if (raw.type === 'rate_limit_event' && raw.rate_limit_info) {
      const i = raw.rate_limit_info, w = i.unifiedWindows || {};
      const win = k => (w[k] ? { utilization: w[k].utilization, resetsAt: w[k].resetsAt, status: w[k].status } : null);
      ev.push({ type: 'quota', status: i.status || null, fiveHour: win('five_hour') || (i.rateLimitType === 'five_hour' ? { utilization: i.utilization, resetsAt: i.resetsAt, status: i.status } : null), sevenDay: win('seven_day'), t });
    } else if (raw.type === 'result') {
      const u = raw.usage || {};
      ev.push({
        type: 'result', ok: !raw.is_error && raw.subtype === 'success', subtype: raw.subtype || null,
        answer: typeof raw.result === 'string' ? raw.result : '', cost: Number(raw.total_cost_usd) || 0, turns: raw.num_turns || 0,
        tokens: { in: u.input_tokens || 0, out: u.output_tokens || 0, cacheCreate: u.cache_creation_input_tokens || 0, cacheRead: u.cache_read_input_tokens || 0 },
        denials: (raw.permission_denials || []).slice(0, 5).map(d => short((d.tool_name || '') + ' ' + JSON.stringify(d.tool_input || {}), 160)),
        session: raw.session_id || null, t
      });
    }
    return ev;
  }
}

/** Etat d'une question, mis a jour evenement par evenement (la page applique le meme). */
function emptyState() {
  return { id: null, running: false, question: '', startedAt: null, endedAt: null, session: null, conversation: null,
    agents: {}, lit: [], activity: [], answer: '', interim: [], cost: 0, tokens: null, turns: 0, quota: null,
    ok: null, error: null, denials: [], published: null };
}

function applyEvent(s, e) {
  const ag = id => (s.agents[id] = s.agents[id] || { status: 'idle', active: 0, parent: null, startedAt: null, endedAt: null, tool: null, detail: '', tokens: 0, summary: '' });
  switch (e.type) {
    case 'run_start':
      Object.assign(s, emptyState(), { id: e.id, running: true, question: e.question, startedAt: e.t, conversation: e.conversation || null });
      Object.assign(ag(ORCHESTRATOR), { status: 'active', active: 1, startedAt: e.t });
      break;
    case 'session': s.session = e.session; break;
    case 'agent_start': { const a = ag(e.agent); a.active++; a.status = 'active'; a.parent = e.parent; a.startedAt = e.t; a.detail = e.description || a.detail; break; }
    case 'agent_activity': { const a = ag(e.agent); a.tool = e.tool; a.detail = e.detail; s.activity.push({ agent: e.agent, tool: e.tool, detail: e.detail, t: e.t }); if (s.activity.length > 60) s.activity.shift(); break; }
    case 'agent_progress': { const a = ag(e.agent); a.tool = e.tool; a.tokens = Math.max(a.tokens, e.tokens || 0); break; }
    case 'agent_done': { const a = ag(e.agent); a.active = Math.max(0, a.active - 1); if (!a.active) a.status = e.status === 'completed' ? 'done' : 'failed'; a.endedAt = e.t; a.summary = e.summary; a.tokens = Math.max(a.tokens, e.tokens || 0); break; }
    case 'brain_hit': s.lit.push({ node: e.node, agent: e.agent, t: e.t }); if (s.lit.length > 200) s.lit.shift(); break;
    case 'answer_block': if (s.answer.trim()) { s.interim.push(s.answer.trim()); if (s.interim.length > 8) s.interim.shift(); } s.answer = ''; break;
    case 'answer_delta': s.answer += e.text; break;
    case 'quota': s.quota = { fiveHour: e.fiveHour, sevenDay: e.sevenDay, status: e.status, t: e.t }; break;
    case 'result': s.cost = e.cost; s.tokens = e.tokens; s.turns = e.turns; if (e.answer) s.answer = e.answer; s.denials = e.denials || []; s.session = e.session || s.session; break;
    case 'run_end': {
      s.running = false; s.endedAt = e.t; s.ok = e.ok; s.error = e.error || null;
      if (e.answer) s.answer = e.answer;
      for (const a of Object.values(s.agents)) if (a.status === 'active') { a.status = e.ok ? 'done' : 'failed'; a.active = 0; a.endedAt = e.t; }
      break;
    }
    case 'published': s.published = { ok: e.ok, text: e.text }; break;
  }
  return s;
}

// --------------------------------------------------------------------- moteur

class Engine extends EventEmitter {
  constructor() {
    super();
    this.run = null;
    this.last = emptyState();
    this.quota = null;
    this._avail = null;
    this._nodes = { t: 0, list: [], resolve: () => null };
  }

  available() {
    if (this._avail && Date.now() - this._avail.t < 60000) return this._avail;
    let ok = false, version = null, error = null;
    try {
      const cc = claudeCommand();
      const r = spawnSync(cc.cmd, [...cc.pre, '--version'], { encoding: 'utf8', timeout: 8000 });
      if (r.error) error = r.error.code === 'ENOENT' ? 'Claude Code introuvable (commande « claude »). Installe-le puis connecte-toi.' : r.error.message;
      else if (r.status === 0) { ok = true; version = String(r.stdout).trim().split('\n')[0]; }
      else error = short(r.stderr || r.stdout, 200) || 'code ' + r.status;
    } catch (err) { error = err.message; }
    this._avail = { ok, version, error, t: Date.now() };
    return this._avail;
  }

  status() {
    const a = this.available();
    return { available: a.ok, version: a.version, error: a.error, config: readConfig(), today: today(), quota: this.quota, running: !!this.run, state: this.state() };
  }

  state() { return this.run ? this.run.state : this.last; }

  history(n = 20) { return readLedger(500).slice(-n).reverse(); }

  _brainIndex() {
    if (Date.now() - this._nodes.t > 2000) {
      try { const list = brain.readAllNodes(); this._nodes = { t: Date.now(), list, resolve: brain.buildResolver(list) }; } catch (_) {}
    }
    return this._nodes;
  }

  /** Une lecture du cerveau devient un ou plusieurs noeuds precis. */
  _resolveRead(e) {
    const { list, resolve } = this._brainIndex();
    if (e.kind === 'show') { const id = resolve(e.query) || (brain.findNode(list, e.query) || {}).id; return id ? [id] : []; }
    if (e.kind === 'search') return brain.searchNodes(list, e.query).slice(0, 4).map(r => r.node.id);
    if (e.kind === 'file') {
      const m = /brain[\\/](.+)\.md$/.exec(e.query);
      return m && list.some(n => n.id === m[1].split(path.sep).join('/')) ? [m[1].split(path.sep).join('/')] : [];
    }
    return [];
  }

  _emit(run, e) {
    applyEvent(run.state, e);
    if (e.type === 'quota') this.quota = { fiveHour: e.fiveHour, sevenDay: e.sevenDay, status: e.status, t: e.t };
    this.emit('event', e);
  }

  start({ question, conversation, routine = null, budgetCap = null } = {}) {
    const q = String(question || '').trim();
    const fail = (status, msg) => { const err = new Error(msg); err.status = status; throw err; };
    if (!q) fail(400, 'question vide');
    if (q.length > MAX_QUESTION) fail(400, 'question trop longue (' + MAX_QUESTION + ' caracteres max)');
    if (conversation != null && conversation !== '' && !/^[0-9a-f-]{8,64}$/i.test(String(conversation))) fail(400, 'conversation invalide');
    if (this.run) fail(409, 'une question est deja en cours : attends la reponse ou annule-la');
    const av = this.available();
    if (!av.ok) fail(503, av.error || 'Claude Code indisponible');
    const cfg = readConfig();
    const used = today().costUsd;
    if (used >= cfg.dailyCapUsd) fail(429, 'plafond du jour atteint (' + used.toFixed(2) + ' $ sur ' + cfg.dailyCapUsd + ' $) : augmente-le dans les reglages, ou attends demain');
    const budget = Math.max(0.05, Math.min(cfg.maxBudgetUsd, cfg.dailyCapUsd - used, budgetCap || Infinity));

    const args = ['-p', '--agent', ORCHESTRATOR, '--output-format', 'stream-json', '--verbose', '--include-partial-messages',
      '--max-turns', String(cfg.maxTurns), '--max-budget-usd', budget.toFixed(2), '--permission-mode', 'dontAsk',
      '--model', cfg.model, '--append-system-prompt', ENGINE_PROMPT];
    if (conversation) args.push('--resume', String(conversation));
    args.push('--allowedTools', ...ALLOWED_TOOLS);

    const id = 'R-' + Date.now().toString(36);
    const env = { ...process.env, CERVEAU_ENGINE: '1', CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH: '3' };
    let child;
    try {
      const cc = claudeCommand();
      child = spawn(cc.cmd, [...cc.pre, ...args], { cwd: ROOT, env, stdio: ['pipe', 'pipe', 'pipe'], detached: process.platform !== 'win32' });
    } catch (err) { fail(503, 'lancement impossible : ' + err.message); }

    const run = { id, child, args, budget, cfg, routine, normalizer: new Normalizer(), buf: '', stderr: '', bad: 0, cancelled: false, timedOut: false, state: emptyState(), finalResult: null };
    this.run = run;
    this._emit(run, { type: 'run_start', id, question: q, conversation: conversation || null, budget, routine, t: Date.now() });

    child.stdin.on('error', () => {});
    child.stdin.end(q + '\n');
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', chunk => {
      run.buf += chunk;
      let i;
      while ((i = run.buf.indexOf('\n')) > -1) {
        const line = run.buf.slice(0, i).trim(); run.buf = run.buf.slice(i + 1);
        if (line) this._line(run, line);
      }
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', d => { run.stderr = (run.stderr + d).slice(-4000); });
    child.on('error', err => { run.spawnError = err.code === 'ENOENT' ? 'Claude Code introuvable (commande « claude »)' : err.message; });
    child.on('close', code => { if (run.buf.trim()) this._line(run, run.buf.trim()); this._finish(run, code); });
    run.timer = setTimeout(() => { run.timedOut = true; this._kill(run); }, cfg.timeoutMin * 60000);
    return { id, budget };
  }

  _line(run, line) {
    let raw;
    try { raw = JSON.parse(line); } catch (_) { run.bad++; return; }
    for (const e of run.normalizer.push(raw)) {
      if (e.type === 'result') run.finalResult = e;
      if (e.type === 'brain_read') {
        for (const node of this._resolveRead(e)) this._emit(run, { type: 'brain_hit', node, agent: e.agent, kind: e.kind, query: e.query, t: e.t });
        continue;
      }
      this._emit(run, e);
    }
  }

  _kill(run) {
    const c = run.child;
    if (!c || c.exitCode !== null) return;
    const sig = s => { try { if (process.platform !== 'win32') process.kill(-c.pid, s); else c.kill(s); } catch (_) { try { c.kill(s); } catch (_) {} } };
    sig('SIGTERM');
    setTimeout(() => { if (c.exitCode === null) sig('SIGKILL'); }, 3000).unref();
  }

  cancel() {
    if (!this.run) return false;
    this.run.cancelled = true;
    this._kill(this.run);
    return true;
  }

  _finish(run, code) {
    clearTimeout(run.timer);
    const r = run.finalResult;
    let ok = !!(r && r.ok) && !run.cancelled && !run.timedOut;
    let error = null;
    if (run.cancelled) error = 'annulee';
    else if (run.timedOut) error = 'trop longue : arretee apres ' + run.cfg.timeoutMin + ' min';
    else if (run.spawnError) error = run.spawnError;
    else if (!r) error = 'Claude Code s\'est arrete sans reponse (code ' + code + ')' + (run.stderr.trim() ? ' : ' + short(run.stderr, 300) : '');
    else if (!r.ok) error = r.subtype === 'error_max_budget_usd' ? 'plafond de la question atteint (' + run.budget.toFixed(2) + ' $) : reponse incomplete'
      : r.subtype === 'error_max_turns' ? 'nombre de tours maximum atteint : reponse incomplete'
      : (r.answer ? short(r.answer, 300) : 'erreur (' + (r.subtype || 'inconnue') + ')');
    const answer = (r && r.answer) || run.state.answer || '';
    this._emit(run, { type: 'run_end', id: run.id, ok, error, answer, cost: r ? r.cost : 0, t: Date.now() });

    const usedAgents = Object.keys(run.state.agents).filter(a => a !== ORCHESTRATOR);
    try {
      ensureDir();
      fs.appendFileSync(LEDGER_FILE, JSON.stringify({ id: run.id, t: new Date().toISOString(), day: localDay(), question: short(run.state.question, 300),
        cost: r ? r.cost : 0, turns: r ? r.turns : 0, tokens: r ? r.tokens : null, ms: Date.now() - run.state.startedAt,
        agents: usedAgents, lit: [...new Set(run.state.lit.map(l => l.node))], ok, error, session: run.state.session, badLines: run.bad,
        routine: run.routine || null, answer: String(answer).slice(0, 8000) }) + '\n');
    } catch (_) {}

    this.last = run.state;
    this.run = null;
    if (run.cfg.publishAfterRun && process.env.ENGINE_NO_PUBLISH !== '1') this._publish(run);
  }

  /** Publication dans un processus a part : un push lent ne doit jamais bloquer le serveur. */
  _publish(run) {
    const p = spawn(process.execPath, [path.join(ROOT, 'agents.js'), 'publish'], { cwd: ROOT, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { out += d; });
    p.on('close', code => {
      const e = { type: 'published', ok: code === 0, text: short(out, 300) || (code === 0 ? 'publie' : 'echec (code ' + code + ')'), t: Date.now() };
      applyEvent(this.last, e);
      this.emit('event', e);
    });
    p.on('error', () => {});
  }

  shutdown() { if (this.run) this.cancel(); }
}

module.exports = {
  Engine, Normalizer, applyEvent, claudeCommand, emptyState, brainReadsInCommand,
  readConfig, writeConfig, sanitizeConfig, today, readLedger,
  ALLOWED_TOOLS, ENGINE_PROMPT, ENGINE_DIR, DEFAULTS
};
