'use strict';

/*
 * jarvis.js — l'equipe d'agents dans la vue 3D du cerveau, et la barre de question.
 *
 * Charge avant le script principal de index.html : rien ne s'execute au
 * chargement, tout passe par window.AG, que la page appelle (dessin, clic,
 * survol, donnees). Les variables de la page (S, cam, ctx, project, glow...)
 * sont lues au moment de l'appel.
 *
 * Chaque equipe se place derriere l'axe du cerveau qu'elle sert : l'equipe
 * sport derriere l'axe Sport, etc. L'orchestrateur flotte au-dessus du noyau.
 * Ce qui brille est ce que le moteur (engine.js) voit vraiment : un agent
 * lance brille, une fiche lue s'allume, un rapport revient a son chef.
 */
(function () {
  const ROLE_LABEL = { orchestrator: 'orchestrateur', memory: 'mémoire', lead: "chef d'équipe", specialist: 'spécialiste' };
  const DOMAIN_COLOR = { gign: '#ff4d6a', sport: '#3dffa0', entrepreneuriat: '#38d4ff', 'etudes-audencia': '#b38cff', 'developpement-perso': '#ffc04a', noyau: '#e6f7ff' };
  const SIZE = { orchestrator: 13, lead: 9.5, memory: 7, specialist: 6 };
  const GREEN = '#3dffa0', RED = '#ff4d6a';

  const A = {
    list: [], byId: new Map(), pos: new Map(), visible: true,
    hovered: null, selected: null,
    run: null, flashes: new Map(), pulses: [], beams: [], lit: new Map(),
    seenMsg: null, engine: null, live: false, conversation: null, confirmQuota: false,
    panelOpen: false, listening: false
  };
  const $ = id => document.getElementById(id);
  const colorOf = a => (a && (a.color || DOMAIN_COLOR[a.domain])) || '#8aa6c4';
  const nameOf = id => (id === 'mats' ? 'Mats' : (A.byId.get(id) || {}).title || id);
  const now = () => performance.now();

  // ------------------------------------------------------------ placement 3D

  function hubOf(domain) { return S.byId.get('hubs/' + domain); }

  /** Positions recalculees a chaque image : les equipes suivent leur axe, qui bouge un peu avec la simulation. */
  function layout() {
    A.pos.clear();
    const orch = A.list.find(a => a.role === 'orchestrator');
    if (orch) A.pos.set(orch.id, { x: 0, y: 250, z: 0 });
    A.list.filter(a => a.role === 'memory').forEach((a, i) => A.pos.set(a.id, { x: 190 + i * 50, y: 110, z: 150 }));
    const leads = A.list.filter(a => a.role === 'lead');
    const byDomain = {};
    for (const l of leads) (byDomain[l.domain] = byDomain[l.domain] || []).push(l);
    let fallback = 0;
    for (const [domain, ls] of Object.entries(byDomain)) {
      const hub = hubOf(domain);
      let ang, R, y;
      if (hub) { ang = Math.atan2(hub.z, hub.x); R = Math.hypot(hub.x, hub.z); y = hub.y; }
      else { ang = (fallback++ / 6) * TAU; R = 520; y = 0; }
      ls.forEach((l, i) => {
        const a = ang + (i - (ls.length - 1) / 2) * .42;
        const dx = Math.cos(a), dz = Math.sin(a);
        const P = { x: dx * (R + 250), y: y * .4 + 120, z: dz * (R + 250) };
        A.pos.set(l.id, P);
        const kids = A.list.filter(k => k.parent === l.id);
        kids.forEach((k, j) => {
          const t = j / kids.length * TAU + i * .7;
          const tx = -dz, tz = dx;           // tangente horizontale
          const rr = 92 + kids.length * 5;
          A.pos.set(k.id, {
            x: P.x + tx * Math.cos(t) * rr + dx * 55,
            y: P.y + Math.sin(t) * rr * .85,
            z: P.z + tz * Math.cos(t) * rr + dz * 55
          });
        });
      });
    }
  }

  function screenOf(id) {
    if (id === 'mats') { const n = S.byId.get('profile'); return n && n.on ? { x: n.sx, y: n.sy, k: n.sk, z: n.sz } : null; }
    const p = A.pos.get(id);
    if (!p) return null;
    const q = project(p.x, p.y, p.z);
    return q ? { x: q.x, y: q.y, k: q.k, z: q.z } : null;
  }

  /** Chemin entre deux acteurs dans l'arbre (par l'ancetre commun), pour faire voyager les messages. */
  function treePath(from, to) {
    const root = (A.list.find(a => a.role === 'orchestrator') || {}).id;
    const up = id => {
      const out = [id];
      if (id === 'mats') { if (root) out.push(root); return out; }
      for (let g = 0; g < 8; g++) { const a = A.byId.get(out[out.length - 1]); if (!a || !a.parent) break; out.push(a.parent); }
      return out;
    };
    if ((!A.byId.has(from) && from !== 'mats') || (!A.byId.has(to) && to !== 'mats')) return [];
    const a = up(from), b = up(to), c = a.find(x => b.includes(x));
    if (!c) return [from, to];
    return a.slice(0, a.indexOf(c) + 1).concat(b.slice(0, b.indexOf(c)).reverse());
  }

  function pulse(from, to, color, dur = 1500, delay = 0) {
    const path = treePath(from, to);
    if (path.length > 1) A.pulses.push({ path, color, t0: now() + delay, dur });
  }

  // ---------------------------------------------------------------- dessin

  function stateOf(id) { return A.run && A.run.agents ? A.run.agents[id] : null; }
  function isActive(id) { const s = stateOf(id); return !!(s && s.status === 'active' && A.run.running); }

  function draw(nowMs, t) {
    if (!A.visible || !A.list.length) return;
    layout();
    const pts = new Map();
    for (const a of A.list) { const s = screenOf(a.id); if (s) pts.set(a.id, s); }
    A._pts = pts;
    const focus = A.hovered || A.selected;
    const anyActive = A.run && A.run.running;

    // liens hierarchiques
    ctx.lineCap = 'round';
    const edge = (pa, pb, col, alpha, w) => {
      ctx.strokeStyle = rgba(hexToRgb(col), alpha); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    };
    const mats = screenOf('mats');
    for (const a of A.list) {
      const pa = pts.get(a.id); if (!pa) continue;
      const parent = a.parent ? pts.get(a.parent) : (a.role === 'orchestrator' ? mats : null);
      if (!parent) continue;
      const hot = isActive(a.id) && (a.parent ? isActive(a.parent) : true);
      const touch = focus && (focus === a.id || focus === a.parent);
      let al = hot ? .75 : touch ? .55 : anyActive ? .05 : .1;
      edge(parent, pa, colorOf(a), al, hot ? 1.8 : 1);
      if (hot) {
        const u = (t * .55 + (a.id.length % 7) / 7) % 1;
        const x = lerp(parent.x, pa.x, u), y = lerp(parent.y, pa.y, u), s = clamp(14 * lerp(parent.k, pa.k, u) * 1.6, 5, 18);
        ctx.globalAlpha = .9; ctx.drawImage(glow(colorOf(a)), x - s / 2, y - s / 2, s, s); ctx.globalAlpha = 1;
      }
    }

    // l'agent selectionne : ses fiches du cerveau
    if (A.selected) {
      const a = A.byId.get(A.selected), pa = pts.get(A.selected);
      if (a && pa) for (const r of a.reads || []) {
        const n = r.id && S.byId.get(r.id);
        if (!n || !n.on) continue;
        ctx.save(); ctx.setLineDash([3, 6]); ctx.lineDashOffset = -t * 20;
        edge(pa, { x: n.sx, y: n.sy }, colorOf(a), .45, 1); ctx.restore();
      }
    }

    // fiches lues pendant la question : halo sur le noeud et faisceau vers l'agent
    for (const [nodeId, L] of A.lit) {
      const n = S.byId.get(nodeId); if (!n || !n.on) continue;
      const age = (nowMs - L.t) / 1000;
      if (age > 12) { A.lit.delete(nodeId); continue; }
      const k = Math.max(0, 1 - age / 12);
      const s = n.rs * 12 * (1 + .25 * Math.sin(t * 6));
      ctx.globalAlpha = .9 * k; ctx.drawImage(glow('#ffffff'), n.sx - s / 2, n.sy - s / 2, s, s);
      ctx.globalAlpha = k; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(n.sx, n.sy, n.rs * 2 + 6 + age * 3, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
      const pa = pts.get(L.agent) || (L.agent === 'orchestrateur' ? null : null);
      if (pa && age < 5) {
        const g = ctx.createLinearGradient(n.sx, n.sy, pa.x, pa.y);
        g.addColorStop(0, 'rgba(255,255,255,' + (.8 * (1 - age / 5)) + ')'); g.addColorStop(1, rgba(hexToRgb(colorOf(A.byId.get(L.agent))), .5 * (1 - age / 5)));
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(n.sx, n.sy); ctx.lineTo(pa.x, pa.y); ctx.stroke();
        const u = (age * .9) % 1, x = lerp(n.sx, pa.x, u), y = lerp(n.sy, pa.y, u);
        ctx.drawImage(glow('#ffffff'), x - 7, y - 7, 14, 14);
      }
    }

    // messages et delegations qui voyagent dans l'arbre
    for (let i = A.pulses.length - 1; i >= 0; i--) {
      const P = A.pulses[i], u = (nowMs - P.t0) / P.dur;
      if (u < 0) continue;
      if (u >= 1) { A.pulses.splice(i, 1); continue; }
      const sp = P.path.map(id => (id === 'mats' ? mats : pts.get(id))).filter(Boolean);
      if (sp.length < 2) continue;
      const seg = Math.min(sp.length - 2, Math.floor(u * (sp.length - 1))), v = u * (sp.length - 1) - seg;
      const x = lerp(sp[seg].x, sp[seg + 1].x, v), y = lerp(sp[seg].y, sp[seg + 1].y, v);
      const s = 26 * (1 - u * .3);
      ctx.globalAlpha = 1 - u * .4; ctx.drawImage(glow(P.color), x - s / 2, y - s / 2, s, s);
      ctx.drawImage(glow('#ffffff'), x - 5, y - 5, 10, 10); ctx.globalAlpha = 1;
    }

    // les agents, du plus loin au plus proche
    const order = A.list.filter(a => pts.has(a.id)).sort((p, q) => pts.get(q.id).z - pts.get(p.id).z);
    for (const a of order) {
      const p = pts.get(a.id), col = colorOf(a);
      const active = isActive(a.id);
      const fl = A.flashes.get(a.id);
      const flash = fl ? Math.max(0, 1 - (nowMs - fl.t) / 2200) : 0;
      if (fl && !flash) A.flashes.delete(a.id);
      const base = SIZE[a.role] || 6, r = Math.max(2.5, base * p.k);
      const dimmed = (anyActive && !active && !flash) || (focus && focus !== a.id && !related(focus, a.id));
      const alpha = dimmed ? .22 : active ? 1 : .62;
      const beat = active ? 1 + .35 * Math.sin(t * 7 + a.id.length) : 1;
      const gs = r * (active ? 11 : 6) * beat;
      ctx.globalAlpha = alpha; ctx.drawImage(glow(col), p.x - gs / 2, p.y - gs / 2, gs, gs);
      // hexagone : la forme des agents (les fiches du cerveau sont rondes)
      ctx.strokeStyle = col; ctx.lineWidth = active ? 2 : 1.2;
      ctx.beginPath();
      const rot = active ? t * 1.4 : Math.PI / 6;
      for (let k = 0; k <= 6; k++) { const an = rot + k / 6 * TAU, R = r * 1.35; k ? ctx.lineTo(p.x + Math.cos(an) * R, p.y + Math.sin(an) * R) : ctx.moveTo(p.x + Math.cos(an) * R, p.y + Math.sin(an) * R); }
      ctx.stroke();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1.5, r * .45), 0, TAU); ctx.fill();
      if (active) {
        const ph = (t * .8 + a.id.length * .13) % 1;
        ctx.globalAlpha = 1 - ph; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, r * (1.6 + ph * 4), 0, TAU); ctx.stroke();
        ctx.globalAlpha = 1;
        const oa = t * 3 + a.id.length;
        ctx.drawImage(glow('#ffffff'), p.x + Math.cos(oa) * r * 2.4 - 4, p.y + Math.sin(oa) * r * 2.4 - 4, 8, 8);
      }
      if (flash) {
        ctx.globalAlpha = flash; ctx.strokeStyle = fl.ok ? GREEN : RED; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p.x, p.y, r * (2 + (1 - flash) * 5), 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
      }
      if (a.id === A.selected || a.id === A.hovered) {
        ctx.globalAlpha = .95; ctx.strokeStyle = '#eaf8ff'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.4 + 6, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
      }
    }
    ctx.globalAlpha = 1;
  }

  function related(a, b) {
    const x = A.byId.get(a), y = A.byId.get(b);
    if (!x || !y) return false;
    return x.parent === b || y.parent === a || (x.talks_to || []).includes(b) || (y.talks_to || []).includes(a);
  }

  function labels() {
    if (!A.visible || !A._pts) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.lineJoin = 'round';
    for (const a of A.list) {
      const p = A._pts.get(a.id); if (!p) continue;
      const active = isActive(a.id), big = a.role !== 'specialist';
      const show = big || active || a.id === A.hovered || a.id === A.selected || (SIZE[a.role] * p.k > 5.5);
      if (!show) continue;
      const r = Math.max(2.5, (SIZE[a.role] || 6) * p.k);
      const text = big ? a.title.toUpperCase() : a.title;
      ctx.font = (big ? '700 11px ' : '500 11px ') + MONO;
      if ('letterSpacing' in ctx) ctx.letterSpacing = big ? '1.5px' : '0px';
      const y = p.y + r * 1.6 + 8;
      ctx.globalAlpha = active ? 1 : (A.run && A.run.running ? .35 : .8);
      ctx.lineWidth = 3.5; ctx.strokeStyle = 'rgba(2,8,16,.85)'; ctx.strokeText(text, p.x, y);
      ctx.fillStyle = active ? '#ffffff' : colorOf(a); ctx.fillText(text, p.x, y);
      if (active) {
        const s = stateOf(a.id), d = s && (s.tool ? s.tool + (s.detail ? ' · ' + s.detail : '') : 'travaille');
        if (d) { ctx.font = '400 10px ' + MONO; const dd = d.length > 46 ? d.slice(0, 45) + '…' : d; ctx.globalAlpha = .85; ctx.strokeText(dd, p.x, y + 14); ctx.fillStyle = '#cfe9f7'; ctx.fillText(dd, p.x, y + 14); }
      }
    }
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    ctx.globalAlpha = 1;
  }

  function pick(mx, my) {
    if (!A.visible || !A._pts) return null;
    let best = null, bz = Infinity;
    for (const a of A.list) {
      const p = A._pts.get(a.id); if (!p) continue;
      const r = Math.max(11, (SIZE[a.role] || 6) * p.k * 1.8);
      if (Math.hypot(p.x - mx, p.y - my) <= r && p.z < bz) { best = { id: a.id, z: p.z }; bz = p.z; }
    }
    return best;
  }

  function points() {
    if (!A.visible || !A.list.length || !S.ready) return [];
    layout();
    return [...A.pos.values()];
  }

  // ---------------------------------------------------------- panneau agent

  function chip(label, color, onclick) {
    const b = document.createElement('button');
    b.className = 'nb'; b.style.setProperty('--c', color);
    const d = document.createElement('span'); d.className = 'dot';
    b.append(d, document.createTextNode(label));
    if (onclick) b.onclick = onclick;
    return b;
  }
  function section(title, ...kids) {
    const s = document.createElement('div');
    const h = document.createElement('h3'); h.className = 'label'; h.textContent = title;
    const box = document.createElement('div'); box.className = 'chips-row';
    for (const k of kids.flat()) if (k) box.append(k);
    s.append(h, box);
    return s;
  }

  function select(id, fly) {
    const a = A.byId.get(id); if (!a) return;
    if (typeof stopTour === 'function' && tour.on) stopTour();
    S.selected = null;
    A.selected = id;
    panel.style.setProperty('--accent', colorOf(a));
    $('p-kind').textContent = 'agent · ' + (ROLE_LABEL[a.role] || a.role);
    $('p-name').textContent = a.title;
    const desc = $('p-desc'); desc.textContent = a.description || ''; desc.style.display = '';
    $('p-facts-wrap').style.display = 'none'; $('p-nb-wrap').style.display = 'none'; $('p-meta').textContent = '';
    const box = $('p-agent'); box.textContent = ''; box.style.display = '';
    const st = stateOf(id);
    if (st && A.run) {
      const label = st.status === 'active' ? 'travaille en ce moment' : st.status === 'done' ? 'a terminé sa part' : st.status === 'failed' ? 'a échoué' : '';
      const p = document.createElement('p'); p.className = 'agent-now';
      p.textContent = label + (st.tool ? ' · ' + st.tool : '') + (st.detail ? ' · ' + st.detail : '');
      box.append(section('Pendant ta question', p));
      if (st.summary) { const q = document.createElement('p'); q.className = 'agent-sum'; q.textContent = st.summary; box.append(q); }
    }
    if (a.parent) box.append(section('Rapporte à', chip(nameOf(a.parent), colorOf(A.byId.get(a.parent)), () => select(a.parent, true))));
    const kids = A.list.filter(k => k.parent === id);
    if (kids.length) box.append(section('Ses spécialistes', kids.map(k => chip(k.title, colorOf(k), () => select(k.id, true)))));
    const reads = (a.reads || []).filter(r => r.id);
    if (reads.length) box.append(section('Lit dans le cerveau', reads.map(r => { const n = S.byId.get(r.id); return chip(r.name, n ? n.color : '#8aa6c4', () => { A.selected = null; focusNode(r.id, true); }); })));
    const stats = a.stats || {}, open = (stats.open || 0) + (stats.doing || 0) + (stats.blocked || 0);
    const tk = document.createElement('p'); tk.className = 'agent-now';
    tk.textContent = open + ' en cours · ' + (stats.done || 0) + ' terminée(s) · ' + (stats.backlog || 0) + ' idée(s)';
    const lk = document.createElement('a'); lk.href = 'agents.html#agent=' + encodeURIComponent(id); lk.textContent = 'ouvrir le tableau des tâches'; lk.className = 'agent-link';
    box.append(section('Tâches', tk, lk));
    if (a.prompt) {
      const d = document.createElement('details'); const s = document.createElement('summary'); s.className = 'label'; s.textContent = 'Ses consignes';
      const pre = document.createElement('pre'); pre.className = 'prompt'; pre.textContent = a.prompt;
      d.append(s, pre); box.append(d);
    }
    const ask = document.createElement('button'); ask.className = 'btn'; ask.textContent = 'Lui poser une question';
    ask.onclick = () => { const t = $('ask-text'); if (!t.disabled) { t.value = 'Demande à ' + a.id + ' : '; t.focus(); autosize(); } };
    box.append(ask);
    panel.classList.add('open'); panel.scrollTop = 0;
    if (fly) { const P = A.pos.get(id); if (P) flyTo(P, a.role === 'specialist' ? 360 : 520, { dur: 1000 }); }
  }

  function clearSelection() {
    A.selected = null;
    const box = $('p-agent'); if (box) { box.textContent = ''; box.style.display = 'none'; }
  }

  function hover(id) { A.hovered = id; }
  function tipText(id) {
    const a = A.byId.get(id); if (!a) return null;
    const s = stateOf(id);
    return { title: a.title, color: colorOf(a), line: (ROLE_LABEL[a.role] || a.role).toUpperCase() + (s && s.status === 'active' ? ' · AU TRAVAIL' : '') };
  }

  // ---------------------------------------------------------- donnees agents

  function onAgents(state) {
    if (!state || !Array.isArray(state.agents)) return;
    A.list = state.agents; A.byId = new Map(A.list.map(a => [a.id, a]));
    const msgs = state.messages || [];
    const last = msgs.length ? msgs[msgs.length - 1].t : '';
    if (A.seenMsg !== null) {
      msgs.filter(m => m.t > A.seenMsg).slice(-8).forEach((m, i) => pulse(m.from, m.to, colorOf(A.byId.get(m.to)) || '#ffffff', 1500, i * 300));
    }
    A.seenMsg = A.seenMsg === null ? last : (last > A.seenMsg ? last : A.seenMsg);
    const layer = $('sw-agents'); if (layer) layer.querySelector('.count').textContent = A.list.length;
    if (A.selected && A.byId.has(A.selected)) select(A.selected, false);
  }

  // ------------------------------------------------------- moteur : evenements

  function onRun(e) {
    if (!e) return;
    if (e.type === 'state') { A.run = e.state; renderAnswer(); refreshBar(); return; }
    if (!A.run || e.type === 'run_start') A.run = { agents: {}, lit: [], activity: [], interim: [], answer: '' };
    applyRunEvent(A.run, e);
    const t = now();
    if (e.type === 'run_start') {
      A.lit.clear(); A.pulses.length = 0; pulse('mats', 'orchestrateur', '#e6f7ff', 1300); openAnswer();
      // vue d'ensemble au-dessus du panneau de reponse, pour voir toute l'equipe travailler
      if (!panel.classList.contains('open') && !tour.on) requestAnimationFrame(() => flyTo({ x: 0, y: 0, z: 0 }, clamp(fitDistance(cam.yaw, .9), 200, 9000), { dur: 1200, pitch: .9 }));
    }
    if (e.type === 'agent_start') pulse(e.parent, e.agent, colorOf(A.byId.get(e.agent)), 1300);
    if (e.type === 'agent_done') { A.flashes.set(e.agent, { t, ok: e.status === 'completed' }); const a = A.byId.get(e.agent); if (a && a.parent) pulse(e.agent, a.parent, GREEN, 1400); }
    if (e.type === 'brain_hit') A.lit.set(e.node, { t, agent: e.agent });
    if (e.type === 'quota' && A.engine) A.engine.quota = { fiveHour: e.fiveHour, sevenDay: e.sevenDay };
    if (e.type === 'run_end') {
      A.flashes.set('orchestrateur', { t, ok: e.ok });
      if (e.ok && A.run.session) A.conversation = A.run.session;
      pulse('orchestrateur', 'mats', e.ok ? GREEN : RED, 1300);
      fetchEngine();
    }
    renderAnswer(e.type);
    refreshBar();
  }

  /** Meme logique que applyEvent d'engine.js, cote page. */
  function applyRunEvent(s, e) {
    const ag = id => (s.agents[id] = s.agents[id] || { status: 'idle', active: 0, tool: null, detail: '', summary: '' });
    switch (e.type) {
      case 'run_start': Object.assign(s, { id: e.id, running: true, question: e.question, startedAt: Date.now(), agents: {}, lit: [], interim: [], answer: '', cost: 0, ok: null, error: null, published: null, denials: [] }); Object.assign(ag('orchestrateur'), { status: 'active', active: 1 }); break;
      case 'session': s.session = e.session; break;
      case 'agent_start': { const a = ag(e.agent); a.active++; a.status = 'active'; a.detail = e.description || ''; break; }
      case 'agent_activity': { const a = ag(e.agent); a.tool = e.tool; a.detail = e.detail; break; }
      case 'agent_progress': { const a = ag(e.agent); a.tool = e.tool; break; }
      case 'agent_done': { const a = ag(e.agent); a.active = Math.max(0, a.active - 1); if (!a.active) a.status = e.status === 'completed' ? 'done' : 'failed'; a.summary = e.summary; break; }
      case 'brain_hit': s.lit.push({ node: e.node, agent: e.agent }); break;
      case 'answer_block': if ((s.answer || '').trim()) s.interim.push(s.answer.trim()); s.answer = ''; break;
      case 'answer_delta': s.answer = (s.answer || '') + e.text; break;
      case 'result': s.cost = e.cost; s.tokens = e.tokens; s.turns = e.turns; if (e.answer) s.answer = e.answer; s.denials = e.denials || []; break;
      case 'run_end': s.running = false; s.ok = e.ok; s.error = e.error; if (e.answer) s.answer = e.answer; s.cost = e.cost || s.cost; s.endedAt = Date.now();
        for (const a of Object.values(s.agents)) if (a.status === 'active') { a.status = e.ok ? 'done' : 'failed'; a.active = 0; } break;
      case 'published': s.published = { ok: e.ok, text: e.text }; break;
    }
  }

  // ------------------------------------------------------------- reponse

  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  /** Markdown minimal (gras, code, listes, titres), sur du texte deja echappe. */
  function md(text) {
    const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');
    const out = []; let list = null;
    for (const raw of String(text || '').split('\n')) {
      const line = raw.trimEnd();
      const li = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/.exec(line);
      if (li) { if (!list) { list = []; } list.push('<li>' + inline(li[1]) + '</li>'); continue; }
      if (list) { out.push('<ul>' + list.join('') + '</ul>'); list = null; }
      const h = /^#{1,4}\s+(.*)$/.exec(line);
      if (h) out.push('<h4>' + inline(h[1]) + '</h4>');
      else if (line.trim()) out.push('<p>' + inline(line) + '</p>');
    }
    if (list) out.push('<ul>' + list.join('') + '</ul>');
    return out.join('');
  }

  function openAnswer() { A.panelOpen = true; $('answer').classList.add('open'); }
  function closeAnswer() { A.panelOpen = false; $('answer').classList.remove('open'); }

  function renderAnswer(kind) {
    const s = A.run; if (!s || !s.question) return;
    $('ans-q').textContent = s.question;
    const team = Object.entries(s.agents || {}).filter(([id]) => id !== 'orchestrateur');
    const st = $('ans-status');
    if (s.running) {
      const act = team.filter(([, a]) => a.status === 'active').map(([id]) => nameOf(id));
      st.textContent = act.length ? 'au travail : ' + act.join(', ') : (team.length ? 'Claude rassemble les réponses…' : 'Claude réfléchit…');
      st.className = 'ans-status running';
    } else {
      st.textContent = s.ok ? 'terminé' : 'interrompu' + (s.error ? ' : ' + s.error : '');
      st.className = 'ans-status ' + (s.ok ? 'ok' : 'err');
    }
    $('ans-text').innerHTML = md(s.answer || '') || (s.running ? '<p class="ans-wait">…</p>' : '');
    const teamBox = $('ans-team'); teamBox.textContent = '';
    for (const [id, a] of team) {
      const ag = A.byId.get(id);
      const c = chip(nameOf(id), colorOf(ag), () => select(id, true));
      c.classList.add('st-' + a.status);
      teamBox.append(c);
    }
    $('ans-team-wrap').style.display = team.length ? '' : 'none';
    const litBox = $('ans-lit'); litBox.textContent = '';
    const seen = new Set();
    for (const l of s.lit || []) {
      if (seen.has(l.node)) continue; seen.add(l.node);
      const n = S.byId.get(l.node); if (!n) continue;
      litBox.append(chip(n.name, n.color, () => focusNode(n.id, true)));
    }
    $('ans-lit-wrap').style.display = seen.size ? '' : 'none';
    const meta = [];
    if (!s.running && s.cost) meta.push(s.cost.toFixed(2).replace('.', ',') + ' $');
    if (!s.running && s.endedAt && s.startedAt) meta.push(Math.round((s.endedAt - s.startedAt) / 1000) + ' s');
    if (team.length) meta.push(team.length + ' agent' + (team.length > 1 ? 's' : ''));
    if (s.published) meta.push(s.published.ok ? 'publié' : 'non publié : ' + s.published.text);
    if ((s.denials || []).length) meta.push('refusé : ' + s.denials.join(' ; '));
    $('ans-meta').textContent = meta.join(' · ');
    $('ans-new').style.display = A.conversation && !s.running ? '' : 'none';
    const body = $('ans-body');
    if (s.running) body.scrollTop = body.scrollHeight;
    else if (kind === 'run_end') body.scrollTop = 0;
  }

  // ------------------------------------------------------------- barre

  async function fetchEngine() {
    try { const r = await fetch('/api/engine', { cache: 'no-store' }); if (r.ok) { A.engine = await r.json(); refreshBar(); } } catch (_) {}
  }

  function pct(x) { return Math.round((x || 0) * 100) + ' %'; }

  function refreshBar() {
    const text = $('ask-text'), send = $('ask-send'), meter = $('ask-meter'), note = $('ask-note');
    const running = !!(A.run && A.run.running);
    if (!A.live) { text.disabled = true; send.disabled = true; text.placeholder = 'Les questions marchent sur ton ordinateur : double-clic sur demarrer-cerveau'; meter.textContent = ''; return; }
    if (A.engine && !A.engine.available) { text.disabled = true; send.disabled = true; text.placeholder = A.engine.error || 'Claude Code introuvable'; meter.textContent = ''; return; }
    text.disabled = false; send.disabled = false;
    text.placeholder = A.conversation ? 'Suite de la conversation…' : 'Pose ta question à Claude et à ton équipe…';
    send.classList.toggle('stop', running);
    send.title = running ? 'Annuler la question' : 'Envoyer (Entrée)';
    send.innerHTML = running ? '<svg viewBox="0 0 10 10"><rect x="2" y="2" width="6" height="6"/></svg>' : '<svg viewBox="0 0 10 10"><path d="M1 5h7M5 2l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
    if (!A.engine) { meter.textContent = ''; return; }
    const td = A.engine.today || {}, cfg = A.engine.config || {}, q = A.engine.quota;
    const parts = ['aujourd\'hui ' + (td.costUsd || 0).toFixed(2).replace('.', ',') + ' $ / ' + cfg.dailyCapUsd + ' $'];
    let level = '';
    if (q && q.fiveHour) { parts.push('quota 5 h ' + pct(q.fiveHour.utilization)); if (q.fiveHour.utilization >= .95) level = 'err'; else if (q.fiveHour.utilization >= .8) level = 'warn'; }
    if (q && q.sevenDay) parts.push('7 j ' + pct(q.sevenDay.utilization));
    parts.push(cfg.model);
    meter.textContent = parts.join(' · ');
    meter.className = 'ask-meter ' + level;
    if (!A.confirmQuota) note.textContent = '';
  }

  function autosize() { const t = $('ask-text'); t.style.height = 'auto'; t.style.height = Math.min(120, t.scrollHeight) + 'px'; }

  async function post(url, body) {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
    let j = {}; try { j = await r.json(); } catch (_) {}
    if (!r.ok) throw new Error(j.error || 'erreur ' + r.status);
    return j;
  }

  async function submit() {
    const text = $('ask-text'), note = $('ask-note');
    if (A.run && A.run.running) { try { await post('/api/run/cancel'); } catch (e) { note.textContent = e.message; } return; }
    const q = text.value.trim();
    if (!q) return;
    const u = A.engine && A.engine.quota && A.engine.quota.fiveHour && A.engine.quota.fiveHour.utilization;
    if (u >= .9 && !A.confirmQuota) {
      A.confirmQuota = true;
      note.textContent = 'Ton quota 5 h est à ' + pct(u) + '. Entrée à nouveau pour envoyer quand même.';
      return;
    }
    A.confirmQuota = false; note.textContent = '';
    try {
      await post('/api/ask', { question: q, conversation: A.conversation });
      text.value = ''; autosize();
    } catch (e) { note.textContent = e.message; }
  }

  // ------------------------------------------------------------- voix

  function setupVoice() {
    const mic = $('ask-mic');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { mic.style.display = 'none'; return; }
    let rec = null, base = '';
    mic.onclick = () => {
      if (A.listening) { rec && rec.stop(); return; }
      rec = new SR(); rec.lang = 'fr-FR'; rec.interimResults = true; rec.continuous = true;
      const text = $('ask-text'); base = text.value ? text.value.replace(/\s*$/, ' ') : '';
      rec.onresult = ev => {
        let fin = '', tmp = '';
        for (let i = 0; i < ev.results.length; i++) (ev.results[i].isFinal ? (fin += ev.results[i][0].transcript) : (tmp += ev.results[i][0].transcript));
        text.value = base + fin + tmp; autosize();
      };
      rec.onend = () => { A.listening = false; mic.classList.remove('on'); $('ask-text').focus(); };
      rec.onerror = ev => { $('ask-note').textContent = 'dictée : ' + (ev.error || 'erreur'); };
      try { rec.start(); A.listening = true; mic.classList.add('on'); } catch (_) {}
    };
  }

  // ------------------------------------------------------------- reglages

  function openSettings() {
    const box = $('ask-settings');
    if (box.classList.toggle('open') && A.engine) {
      const c = A.engine.config;
      $('cfg-model').value = c.model; $('cfg-run').value = c.maxBudgetUsd; $('cfg-day').value = c.dailyCapUsd;
      $('cfg-pub').checked = !!c.publishAfterRun;
    }
  }
  async function saveSettings() {
    try {
      const j = await post('/api/engine/config', { model: $('cfg-model').value, maxBudgetUsd: Number($('cfg-run').value), dailyCapUsd: Number($('cfg-day').value), publishAfterRun: $('cfg-pub').checked });
      if (A.engine) A.engine.config = j.config;
      $('ask-settings').classList.remove('open'); refreshBar();
    } catch (e) { $('cfg-err').textContent = e.message; }
  }

  // ------------------------------------------------------------- demarrage

  async function boot(live) {
    A.live = live;
    $('ask-text').addEventListener('input', autosize);
    $('ask-text').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); }
      if (e.key === 'Escape') { e.stopPropagation(); $('ask-text').blur(); }
    });
    $('ask-send').onclick = submit;
    $('ask-meter').onclick = () => { if (A.live) openSettings(); };
    $('cfg-save').onclick = saveSettings;
    $('ans-close').onclick = closeAnswer;
    $('ans-new').onclick = () => { A.conversation = null; refreshBar(); $('ask-text').focus(); $('ans-new').style.display = 'none'; };
    $('sw-agents').onclick = () => { A.visible = !A.visible; $('sw-agents').classList.toggle('off', !A.visible); };
    setupVoice();
    try {
      const r = await fetch(live ? '/api/agents' : 'agents.json?t=' + Date.now(), { cache: 'no-store' });
      if (r.ok) onAgents(await r.json());
    } catch (_) {}
    // le cadrage initial a ete calcule sans les agents : on recadre une fois qu'ils sont la
    if (S.ready && A.list.length && !panel.classList.contains('open')) overview(1500);
    if (live) await fetchEngine();
    refreshBar();
  }

  window.AG = {
    A, draw, labels, pick, points, select, clearSelection, hover, tipText, onAgents, onRun, boot,
    panelOpen: () => A.panelOpen, md, treePath,
    selected: () => A.selected
  };
})();
