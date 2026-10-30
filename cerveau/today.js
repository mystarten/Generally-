'use strict';

/*
 * today.js — le tableau de bord « Aujourd'hui », calcule a partir du cerveau.
 *
 * Aucun token : tout vient des fiches deja chargees dans la page (et des taches
 * des agents). Marche donc aussi en ligne, sur le telephone.
 *
 *  - la semaine en cours de la trame, seance par seance, cochable en local ;
 *  - les echeances datees trouvees dans les faits, avec compte a rebours ;
 *  - ce qui a bouge recemment (faits dates des trois dernieres semaines) ;
 *  - ce qui attend Mats (questions des agents, points « a verifier ») ;
 *  - ses dernieres questions, relisibles sans les reposer.
 *
 * Les fonctions de calcul sont pures et exportees pour les tests (Node).
 */
(function (root) {
  const MONTHS = {
    janvier: 0, janv: 0, jan: 0, fevrier: 1, fev: 1, mars: 2, mar: 2, avril: 3, avr: 3, mai: 4, juin: 5,
    juillet: 6, juil: 6, aout: 7, septembre: 8, sept: 8, sep: 8, octobre: 9, oct: 9, novembre: 10, nov: 10, decembre: 11, dec: 11
  };
  const MONTH_NAMES = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const DAY = 86400000;
  const plain = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const monthOf = w => (w = plain(w).replace(/\.$/, ''), Object.prototype.hasOwnProperty.call(MONTHS, w) ? MONTHS[w] : null);
  const strip = t => String(t || '').replace(/\[\[([^\[\]|]+)(?:\|([^\[\]]*))?\]\]/g, (_, a, b) => b || a).replace(/\s+/g, ' ').trim();
  const midnight = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  /**
   * Dates d'un fait : « 24 mars 2027 », « 1er novembre 2026 », « du 13 au 17 juillet » si le fait
   * contient une annee (« Juillet 2026 : ... »). Sans annee nulle part, on ne devine pas.
   */
  function datesIn(text) {
    const t = plain(text);
    const yearInText = (/\b(20\d\d)\b/.exec(t) || [])[1];
    const out = [];
    const re = /\b(1er|[0-3]?\d)\s+(?:au\s+(?:1er|[0-3]?\d)\s+)?([a-z]{3,9})\.?(?:\s+(20\d\d))?/g;
    let m;
    while ((m = re.exec(t)) !== null) {
      const month = monthOf(m[2]);
      if (month === null) continue;
      const day = m[1] === '1er' ? 1 : Number(m[1]);
      const year = Number(m[3] || yearInText);
      if (!year || day < 1 || day > 31) continue;
      const d = new Date(year, month, day);
      if (d.getMonth() !== month) continue;
      out.push(d);
    }
    return out;
  }

  /** Echeances (a venir) et nouvelles (passees de moins de `pastDays` jours), a partir des faits. */
  function timeline(nodes, now, pastDays = 21) {
    const today = midnight(now).getTime();
    const upcoming = [], recent = [], seen = new Set();
    for (const n of nodes || []) {
      if (/^topics\/t\d|^topics\/m\d|^topics\/p\d|trame-street-workout/.test(n.id)) continue; // les semaines de la trame ont leur bloc
      for (const f of n.facts || []) {
        if (f.tag === 'links') continue;
        const text = strip(f.text);
        for (const d of datesIn(text)) {
          const key = n.id + '|' + d.getTime();
          if (seen.has(key)) continue;
          seen.add(key);
          const delta = Math.round((d.getTime() - today) / DAY);
          const item = { node: n.id, name: n.name, date: d.getTime(), days: delta, text, tag: f.tag };
          // « 30 octobre 2026 : 38 tractions » est un journal (c'est fait), pas une echeance
          const logged = delta <= 0 && /^(?:\w+\s+)?(?:1er|\d{1,2})\s+\S+\s+20\d\d\s*:/.test(plain(text));
          if (delta >= 0 && !logged) upcoming.push(item);
          else if (logged && delta === 0) recent.push(item);
          else if (delta >= -pastDays) recent.push(item);
        }
      }
    }
    upcoming.sort((a, b) => a.date - b.date);
    // au plus deux faits pour une meme date : le reste repete souvent la meme echeance
    const perDay = {};
    const trimmed = upcoming.filter(i => (perDay[i.date] = (perDay[i.date] || 0) + 1) <= 2);
    upcoming.length = 0; upcoming.push(...trimmed);
    recent.sort((a, b) => b.date - a.date);
    return { upcoming, recent };
  }

  /**
   * Semaine en cours de la trame : on lit les lignes « S3 26 oct-1 nov : ... » des fiches de seance.
   * L'annee n'est pas ecrite : on prend celle qui place la semaine au plus pres d'aujourd'hui.
   */
  function parseWeek(label, now) {
    const m = /^S(\d+)\s+(\d{1,2})(?:\s+([a-zéèûô.]+))?\s*-\s*(\d{1,2})\s+([a-zéèûô.]+)/i.exec(label);
    if (!m) return null;
    const endMonth = monthOf(m[5]);
    const startMonth = m[3] ? monthOf(m[3]) : endMonth;
    if (endMonth === null || startMonth === null) return null;
    let best = null;
    for (const y of [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]) {
      const start = new Date(y, startMonth, Number(m[2]));
      const end = new Date(endMonth < startMonth ? y + 1 : y, endMonth, Number(m[4]));
      const dist = Math.abs(start.getTime() - now.getTime());
      if (!best || dist < best.dist) best = { week: Number(m[1]), start: start.getTime(), end: end.getTime(), dist };
    }
    return best && { week: best.week, start: best.start, end: best.end, light: /semaine legere|leger/.test(plain(label)) };
  }

  function trameWeek(nodes, now) {
    const t = midnight(now).getTime();
    const ORDER = ['T', 'M', 'P'];
    const key = n => ORDER.indexOf(n.name[0]) * 10 + Number(n.name[1]);
    const sessions = (nodes || []).filter(n => /^(T\d|M\d|P\d) ·/.test(n.name)).sort((a, b) => key(a) - key(b));
    let found = null;
    const rows = [];
    for (const s of sessions) {
      for (const f of s.facts || []) {
        const w = parseWeek(f.text, now);
        if (!w || t < w.start || t > w.end) continue;
        found = found || w;
        const done = (s.facts || []).some(g => new RegExp('seance faite \\(s' + w.week + '\\)').test(plain(g.text)));
        rows.push({ node: s.id, code: s.name.split(' ·')[0], name: s.name.split('· ')[1] || s.name, text: strip(f.text).replace(/^S\d+[^:]*:\s*/, ''), done });
        break;
      }
    }
    if (!found) {
      // entre deux semaines (ou trame finie) : la prochaine semaine a venir
      let next = null;
      for (const s of sessions) for (const f of s.facts || []) { const w = parseWeek(f.text, now); if (w && w.start > t && (!next || w.start < next.start)) next = w; }
      return { current: null, next, rows: [] };
    }
    return { current: found, rows };
  }

  function fmtDate(ms) { const d = new Date(ms); return d.getDate() + ' ' + MONTH_NAMES[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() : ''); }
  function countdown(days) { return days === 0 ? "aujourd'hui" : days === 1 ? 'demain' : 'J-' + days; }

  // ------------------------------------------------------------------ affichage

  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  const T = { runs: [], live: false, agents: null, busy: new Set() };

  function section(title, count) {
    const s = el('section', 'td-sec');
    const h = el('h3', 'label', title);
    if (count != null) h.append(el('span', 'td-count', String(count)));
    s.append(h);
    return s;
  }
  function nodeLink(id, label, cls) {
    const b = el('button', 'td-link' + (cls ? ' ' + cls : ''), label);
    b.onclick = () => {
      if (window.innerWidth < 860 && typeof setToday === 'function') setToday(false, false); // sur telephone, on laisse voir la fiche
      if (typeof focusNode === 'function') focusNode(id, true);
    };
    return b;
  }

  async function markDone(row, week) {
    if (T.busy.has(row.node)) return;
    T.busy.add(row.node); render();
    try {
      const r = await fetch('/api/brain/session-done', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session: row.node, week }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'erreur ' + r.status);
    } catch (e) { const n = $('td-note'); if (n) n.textContent = e.message; }
    T.busy.delete(row.node); render();
  }

  function render() {
    const box = $('today-body');
    if (!box || typeof S === 'undefined' || !S.ready) return;
    const now = new Date();
    box.textContent = '';
    $('today-date').textContent = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

    // seances de la semaine
    const tw = trameWeek(S.nodes, now);
    if (tw.current) {
      const w = tw.current;
      const s = section('Ta semaine · S' + w.week + (w.light ? ' · légère' : ''), tw.rows.filter(r => r.done).length + '/' + tw.rows.length);
      s.querySelector('h3').title = fmtDate(w.start) + ' → ' + fmtDate(w.end);
      for (const r of tw.rows) {
        const row = el('div', 'td-row' + (r.done ? ' done' : ''));
        const chk = el('button', 'td-check', r.done ? '✓' : '');
        chk.title = r.done ? 'Séance faite' : (T.live ? 'Cocher : séance faite' : 'Cocher depuis ton ordinateur');
        chk.disabled = r.done || !T.live || T.busy.has(r.node);
        chk.onclick = () => markDone(r, w.week);
        const txt = el('div', 'td-txt');
        txt.append(nodeLink(r.node, r.code + ' · ' + r.name, 'strong'), el('div', 'td-sub', r.text));
        row.append(chk, txt);
        s.append(row);
      }
      box.append(s);
    } else if (tw.next) {
      const s = section('Ta trame');
      s.append(el('p', 'td-sub', 'Prochaine semaine : S' + tw.next.week + ', le ' + fmtDate(tw.next.start) + '.'));
      box.append(s);
    }

    // echeances
    const tl = timeline(S.nodes, now);
    if (tl.upcoming.length) {
      const s = section('Échéances');
      for (const it of tl.upcoming.slice(0, 6)) {
        const row = el('div', 'td-row');
        row.append(el('span', 'td-cd' + (it.days <= 7 ? ' soon' : ''), countdown(it.days)));
        const txt = el('div', 'td-txt');
        txt.append(nodeLink(it.node, it.name, 'strong'), el('div', 'td-sub', fmtDate(it.date) + ' · ' + (it.text.length > 110 ? it.text.slice(0, 109) + '…' : it.text)));
        row.append(txt);
        s.append(row);
      }
      box.append(s);
    }

    // ce qui attend Mats
    const waiting = [];
    const tasks = (T.agents && T.agents.tasks) || [];
    for (const t of tasks) if (t.to === 'mats' && ['open', 'doing', 'blocked'].includes(t.status)) waiting.push({ kind: 'q', text: t.title, from: t.from, id: t.id });
    const verify = (S.nodes.find(n => n.id === 'topics/a-verifier') || { facts: [] }).facts.filter(f => f.tag === 'verify');
    if (waiting.length || verify.length) {
      const s = section('Pour toi', waiting.length + verify.length);
      for (const w of waiting.slice(0, 4)) {
        const row = el('div', 'td-row');
        const a = el('a', 'td-link strong', w.text); a.href = 'agents.html#agent=' + encodeURIComponent(w.from);
        const txt = el('div', 'td-txt'); txt.append(a, el('div', 'td-sub', 'question de ' + w.from));
        row.append(el('span', 'td-cd q', '?'), txt); s.append(row);
      }
      if (verify.length) {
        const row = el('div', 'td-row');
        const txt = el('div', 'td-txt');
        txt.append(nodeLink('topics/a-verifier', verify.length + ' point' + (verify.length > 1 ? 's' : '') + ' à trancher', 'strong'), el('div', 'td-sub', strip(verify[0].text).slice(0, 110)));
        row.append(el('span', 'td-cd q', '!'), txt); s.append(row);
      }
      box.append(s);
    }

    // recemment
    if (tl.recent.length) {
      const s = section('Récemment');
      for (const it of tl.recent.slice(0, 5)) {
        const row = el('div', 'td-row');
        row.append(el('span', 'td-cd past', fmtDate(it.date)));
        const txt = el('div', 'td-txt'); txt.append(nodeLink(it.node, it.name, 'strong'), el('div', 'td-sub', it.text.length > 110 ? it.text.slice(0, 109) + '…' : it.text));
        row.append(txt); s.append(row);
      }
      box.append(s);
    }

    // equipe et dernieres questions
    const active = tasks.filter(t => ['open', 'doing', 'blocked'].includes(t.status) && t.to !== 'mats').length;
    const ideas = tasks.filter(t => t.status === 'backlog').length;
    if (tasks.length || T.runs.length) {
      const s = section('Ton équipe');
      s.append(el('p', 'td-sub', active + ' tâche' + (active > 1 ? 's' : '') + ' en cours · ' + ideas + ' idée' + (ideas > 1 ? 's' : '') + ' en attente'));
      for (const r of T.runs.slice(0, 4)) {
        const row = el('div', 'td-row');
        const b = el('button', 'td-link strong', r.question.length > 70 ? r.question.slice(0, 69) + '…' : r.question);
        b.title = 'Relire la réponse (sans la reposer)';
        b.onclick = () => { if (window.innerWidth < 860 && typeof setToday === 'function') setToday(false, false); if (window.AG && AG.showPast) AG.showPast(r); };
        const txt = el('div', 'td-txt');
        const when = new Date(r.t);
        txt.append(b, el('div', 'td-sub', when.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ' · ' + (r.agents && r.agents.length ? r.agents.length + ' agent(s)' : 'sans agent') + (r.ok ? '' : ' · interrompue')));
        row.append(el('span', 'td-cd past', '↺'), txt);
        s.append(row);
      }
      box.append(s);
    }
    const note = el('p', 'td-note'); note.id = 'td-note'; box.append(note);
  }

  async function refreshRuns() {
    if (!T.live) return;
    try { const r = await fetch('/api/runs', { cache: 'no-store' }); if (r.ok) { T.runs = (await r.json()).runs || []; render(); } } catch (_) {}
  }

  function setAgents(state) { T.agents = state; render(); }
  function setLive(v) { T.live = v; refreshRuns(); render(); }

  const api = { datesIn, timeline, parseWeek, trameWeek, render, setAgents, setLive, refreshRuns, T };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TODAY = api;
})(typeof window !== 'undefined' ? window : globalThis);
