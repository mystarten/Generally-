'use strict';

/*
 * autopilot.js — ce qui tourne tout seul tant que le serveur local est allume.
 *
 *  1. Synchronisation (zero token) : toutes les 5 minutes, recupere ce qui a ete
 *     pousse ailleurs (l'app Claude, une autre session) par un « git pull
 *     --ff-only ». Jamais si une question est en cours, jamais si des fichiers
 *     suivis sont modifies localement : rien n'est ecrase.
 *  2. Bilan de la semaine (petit cout) : une fois par semaine, au jour et a
 *     l'heure choisis (dimanche 19 h par defaut), pose la question du bilan au
 *     moteur, plafonnee a 0,60 $. Saute si le quota 5 h depasse 80 %. Rattrape
 *     un bilan manque (ordinateur eteint) a la prochaine occasion de la semaine.
 *
 * Etat local : .engine/autopilot.json (jamais publie).
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { readConfig, ENGINE_DIR } = require('./engine.js');

const ROOT = __dirname;
const STATE_FILE = path.join(ENGINE_DIR, 'autopilot.json');
const PULL_EVERY_MS = Number(process.env.AUTO_PULL_MS || 5 * 60000);
const TICK_MS = Number(process.env.AUTOPILOT_TICK_MS || 60000);
const WEEKLY_BUDGET = 0.6;

const WEEKLY_QUESTION = [
  'Bilan de ma semaine (lancé automatiquement).',
  'Confie-le à bilan-hebdo, en lui demandant de lire le cerveau (séances cochées « séance faite » de la trame, records et faits datés de la semaine) et les tâches des agents.',
  'Réponds en 12 lignes maximum : ce qui a avancé par domaine, ce qui a glissé, les 3 priorités de la semaine prochaine, et les questions à me poser. Pas d\'autre agent que bilan-hebdo.'
].join('\n');

function readState() { try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch (_) { return {}; } }
function writeState(s) { fs.mkdirSync(ENGINE_DIR, { recursive: true }); fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2) + '\n'); }

/** Semaine ISO « 2026-W44 » : un bilan par semaine, pas plus. */
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7);
  return y + '-W' + String(w).padStart(2, '0');
}

/** Le bilan est du s'il est passe l'heure choisie dans la semaine et qu'il n'a pas encore ete fait. */
function weeklyDue(now, cfg, state) {
  if (!cfg.weeklyReview) return false;
  const week = isoWeek(now);
  if (state.lastWeekly === week) return false;
  const dow = (now.getDay() + 6) % 7;            // lundi = 0 ... dimanche = 6
  const want = (cfg.weeklyDay + 6) % 7;
  return dow > want || (dow === want && now.getHours() >= cfg.weeklyHour);
}

function git(args, cb) {
  const p = spawn('git', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  let out = '', err = '';
  p.stdout.on('data', d => { out += d; });
  p.stderr.on('data', d => { err += d; });
  p.on('error', e => cb(e, '', String(e.message)));
  p.on('close', code => cb(code === 0 ? null : new Error('code ' + code), out.trim(), err.trim()));
}

class Autopilot {
  constructor(engine, log) {
    this.engine = engine;
    this.log = log || (() => {});
    this.lastPull = 0;
    this.pulling = false;
    this.status = { pull: null, weekly: null };
    this.timer = null;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), TICK_MS);
    this.timer.unref && this.timer.unref();
    setTimeout(() => this.tick(), 3000).unref();
  }
  stop() { clearInterval(this.timer); this.timer = null; }

  info() { return { ...this.status, state: readState() }; }

  tick(now = new Date()) {
    let cfg;
    try { cfg = readConfig(); } catch (_) { return; }
    if (cfg.autoPull && process.env.AUTO_PULL !== '0' && Date.now() - this.lastPull >= PULL_EVERY_MS) this.pull();
    this.maybeWeekly(now, cfg);
  }

  pull(cb) {
    if (this.pulling || this.engine.run) return cb && cb(null);
    if (!fs.existsSync(path.join(ROOT, '.git'))) return cb && cb(null);
    this.pulling = true; this.lastPull = Date.now();
    const done = (status) => { this.pulling = false; this.status.pull = { ...status, t: new Date().toISOString() }; cb && cb(status); };
    git(['status', '--porcelain', '--untracked-files=no'], (e, out) => {
      if (e) return done({ ok: false, text: 'git indisponible' });
      if (out) return done({ ok: true, skipped: true, text: 'changements locaux en attente de publication : pas de synchro' });
      git(['pull', '--ff-only', '--quiet'], (e2, _o, err) => {
        if (e2) { this.log('synchro impossible : ' + (err.split('\n')[0] || e2.message)); return done({ ok: false, text: err.split('\n')[0] || e2.message }); }
        done({ ok: true, text: 'a jour' });
      });
    });
  }

  maybeWeekly(now, cfg) {
    const state = readState();
    if (!weeklyDue(now, cfg, state)) return;
    if (this.engine.run) return;                                  // une question est en cours : plus tard
    const q = this.engine.quota && this.engine.quota.fiveHour;
    if (q && q.utilization >= 0.8) { this.status.weekly = { ok: false, text: 'reporte : quota 5 h a ' + Math.round(q.utilization * 100) + ' %', t: now.toISOString() }; return; }
    try {
      const r = this.engine.start({ question: WEEKLY_QUESTION, routine: 'weekly', budgetCap: WEEKLY_BUDGET });
      writeState({ ...state, lastWeekly: isoWeek(now), lastWeeklyRun: r.id, lastWeeklyAt: now.toISOString() });
      this.status.weekly = { ok: true, text: 'bilan lance (' + r.id + ')', t: now.toISOString() };
      this.log('bilan de la semaine lance ' + r.id);
    } catch (err) {
      // Claude Code absent, plafond du jour atteint... : on reessaiera au prochain tour
      this.status.weekly = { ok: false, text: err.message, t: now.toISOString() };
    }
  }
}

module.exports = { Autopilot, isoWeek, weeklyDue, WEEKLY_QUESTION, WEEKLY_BUDGET };
