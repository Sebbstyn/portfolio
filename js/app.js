/* Portfolio app. Content lives in content.js; this file only draws it. */
(function () {
  'use strict';

  const C = window.PORTFOLIO || {};
  const DEMO = new URLSearchParams(location.search).has('demo');
  const SVGNS = 'http://www.w3.org/2000/svg';

  /* ------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------ */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const arr = v => (Array.isArray(v) ? v : []);
  const pad = n => String(n).padStart(2, '0');
  const frag = () => document.createDocumentFragment();

  // sounds live in sfx.js; the site still works if that file is missing
  const sfx = (name, arg) => { if (window.SFX) window.SFX.play(name, arg); };
  // visitors who ask their system for less motion get no tilt, bursts or reveals
  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function fill(el, props, kids) {
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'text') el.textContent = v;
        else if (k === 'style') { for (const p in v) el.style.setProperty(p, v[p]); }
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false || kid === '') continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }
  const h = (tag, props, ...kids) => fill(document.createElement(tag), props, kids);
  const s = (tag, props, ...kids) => fill(document.createElementNS(SVGNS, tag), props, kids);

  // seeded random, so the decorative pixels look the same on every load
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const ICONS = {
    home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6.5 10v9.5h11V10"/>',
    edits: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.3v5.4l4.6-2.7z" fill="currentColor"/>',
    thumbs: '<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="8.5" cy="10" r="1.5"/><path d="m4 17 5-4.5 3.5 3 3-2.5 4.5 4"/>',
    cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    bars: '<path d="M5.5 20v-8M12 20V5M18.5 20v-5" stroke-width="3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 8 8 6 8-6"/>',
    spark: '<path d="m12 3 2.2 6.3 6.3 2.7-6.3 2.7L12 21l-2.2-6.3L3.5 12l6.3-2.7z" fill="currentColor"/>',
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    left: '<path d="m15 5-7 7 7 7"/>',
    right: '<path d="m9 5 7 7-7 7"/>',
    out: '<path d="M8 16 16.5 7.5M9 7h8v8"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="currentColor" stroke="none"/><path d="M10 9.2v5.6l5-2.8z" fill="var(--c)" stroke="none"/>',
    discord: '<path d="M6.2 6.6c3.8-1.5 7.8-1.5 11.6 0l2 9.2c-1.6 1.4-3.3 2.2-5 2.6l-.9-1.9h-3.8l-.9 1.9c-1.7-.4-3.4-1.2-5-2.6z" fill="currentColor" stroke="none"/><circle cx="9.4" cy="12.4" r="1.5" fill="var(--c)" stroke="none"/><circle cx="14.6" cy="12.4" r="1.5" fill="var(--c)" stroke="none"/>',
    twitter: '<path d="M5 4.5 19 19.5M19 4.5 5 19.5" stroke-width="2.6"/>',
    tiktok: '<path d="M14 4v10.4a3.6 3.6 0 1 1-3.2-3.6" stroke-width="2.6"/><path d="M14 4.2c.5 2.4 2.1 3.9 4.6 4.2" stroke-width="2.6"/>',
    instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.9" cy="7.1" r="1" fill="currentColor" stroke="none"/>',
    github: '<path d="m9 8-4 4 4 4M15 8l4 4-4 4"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
    sound: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.6 7.6 0 0 1 0 11"/>',
    mute: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
  };
  function icon(name) {
    const svg = s('svg', { class: 'ic', viewBox: '0 0 24 24', 'aria-hidden': 'true' });
    svg.innerHTML = ICONS[name] || '';
    return svg;
  }

  function ytId(v) {
    if (!v) return '';
    v = String(v).trim();
    if (/^[\w-]{11}$/.test(v)) return v;
    const m = v.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : '';
  }

  // The part of a video an entry is limited to, or null when it plays in full.
  function clipOf(it) {
    const end = Number(it.end), start = Math.max(0, Number(it.start) || 0);
    return end > start ? { start, end } : null;
  }
  const clock = secs => Math.floor(secs / 60) + ':' + pad(Math.round(secs % 60));

  function safeUrl(u) {
    u = String(u || '').trim();
    return /^(https?:|mailto:)/i.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u) ? u : '#';
  }

  // "1.2M", "45,300", 1200 -> number
  function num(v) {
    if (v == null || v === '') return null;
    if (typeof v === 'number') return isFinite(v) ? v : null;
    const m = String(v).replace(/,/g, '').trim().match(/^([\d.]+)\s*([kmb])?/i);
    if (!m) return null;
    return Math.round(parseFloat(m[1]) * ({ k: 1e3, m: 1e6, b: 1e9 }[(m[2] || '').toLowerCase()] || 1));
  }
  const COMPACT = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
  const fmt = n => (n == null ? '–' : COMPACT.format(n));
  const fmtFull = n => (n == null ? '–' : Math.round(n).toLocaleString('en'));
  const sum = (list, key) => list.reduce((t, v) => t + (v[key] || 0), 0);
  const dateOf = v => { const t = Date.parse(v); return isNaN(t) ? null : new Date(t); };
  const fmtDate = (v, opts) => { const d = dateOf(v); return d ? d.toLocaleDateString('en', opts || { month: 'short', day: 'numeric', year: 'numeric' }) : ''; };
  function ago(t) {
    const m = Math.round((Date.now() - t) / 60000);
    return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : Math.round(m / 60) + ' h ago';
  }

  /* ------------------------------------------------------------------
     Sections
     ------------------------------------------------------------------ */
  const SECTIONS = [
    { id: 'home', label: 'Home', hint: 'Start here', icon: 'home' },
    { id: 'edits', label: 'Edits', hint: 'Long · Short', icon: 'edits', kicker: 'Longform · Shortform', title: ['Video', 'Edits'],
      subs: [{ id: 'longform', label: 'Longform' }, { id: 'shortform', label: 'Shortform' }] },
    { id: 'thumbnails', label: 'Thumbnails', hint: 'Gallery', icon: 'thumbs', kicker: 'Design', title: ['Thumbnail', 'Gallery'] },
    { id: 'minecraft', label: 'Minecraft', hint: 'Mods · Art', icon: 'cube', kicker: 'Mods · Plugins · Art', title: ['Minecraft', 'Creations'],
      subs: [{ id: 'mods', label: 'Mods' }, { id: 'plugins', label: 'Plugins' }, { id: 'models', label: 'Models' }, { id: 'textures', label: 'Textures' }] },
    { id: 'analytics', label: 'Analytics', hint: 'YouTube', icon: 'bars', kicker: 'YouTube', title: ['Channel', 'Analytics'],
      subs: [{ id: 'longform', label: 'Longform' }, { id: 'shortform', label: 'Shortform' }] },
  ];
  const section = id => SECTIONS.find(x => x.id === id);

  const state = { sec: -1, subs: {} };
  const RENDER = {};
  let D, main, tabsEl, bodyEl, segEl;

  function readContent() {
    const e = C.edits || {}, m = C.minecraft || {}, a = C.analytics || {};
    D = {
      edits: { longform: arr(e.longform), shortform: arr(e.shortform) },
      thumbnails: arr(C.thumbnails),
      minecraft: {
        mods: arr(m.mods), plugins: arr(m.plugins), models: arr(m.models), textures: arr(m.textures),
        comingSoon: arr(m.comingSoon),
      },
      analytics: {
        comingSoon: !!a.comingSoon,
        channel: String(a.channel || '').trim(),
        apiKey: String(a.apiKey || '').trim(),
        maxVideos: Math.min(50, Math.max(1, a.maxVideos | 0 || 12)),
        longform: a.longform || {},
        shortform: a.shortform || {},
      },
      contact: C.contact || {},
    };
    if (D.analytics.comingSoon) {
      const sec = section('analytics');
      sec.hint = sec.kicker = 'Coming soon';
      delete sec.subs;
    }
  }

  function count(secId, subId) {
    if (secId === 'edits') return D.edits[subId].length;
    if (secId === 'minecraft') return D.minecraft[subId].length;
    return 0;
  }

  /* ------------------------------------------------------------------
     Banner, logo and decoration
     ------------------------------------------------------------------ */
  function wordmark(name) {
    const text = name.toUpperCase();
    const SIZE = 64, BASE = 64, CAP = SIZE * 0.72, P = 13;
    const svg = s('svg', { class: 'wm', viewBox: '0 0 420 ' + (CAP + P * 2 + 7), role: 'img', 'aria-label': name });
    const layers = ['wm-shadow', 'wm-stroke', 'wm-fill'].map(c => s('text', { class: c, x: 0, y: BASE }, text));
    svg.append(...layers);
    const fit = () => {
      let b;
      try { b = layers[2].getBBox(); } catch (err) { return; }
      if (!b.width) return;
      svg.setAttribute('viewBox', [b.x - P, BASE - CAP - P, b.width + P * 2, CAP + P * 2 + 7].join(' '));
    };
    requestAnimationFrame(fit);
    if (document.fonts) {
      if (document.fonts.load) document.fonts.load('900 64px "Unbounded"').then(fit, () => {});
      if (document.fonts.ready) document.fonts.ready.then(fit);
    }
    return svg;
  }

  // loose pixels drifting in from the sides of the banner
  function scatter(seed) {
    const W = 1600, H = 240, cell = 20, r = rng(seed);
    const svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'xMidYMid slice' });
    for (let y = 0; y < H; y += cell) {
      for (let x = 0; x < W; x += cell) {
        const edge = Math.abs(x / W - 0.5) * 2;
        if (r() < 0.025 + edge * edge * 0.2 + (y / H) * 0.05) {
          // each pixel twinkles on its own clock
          svg.append(s('rect', {
            x, y, width: cell, height: cell, class: r() < 0.5 ? 'px-d' : 'px-l',
            style: { '--t': (3.5 + r() * 5).toFixed(2) + 's', '--d': (-r() * 8).toFixed(2) + 's' },
          }));
        }
      }
    }
    return svg;
  }

  // the jagged pixel edge where the banner meets the page
  function edgeTile(color) {
    const cols = 64, cell = 12, rows = 3, r = rng(77);
    let rects = '';
    for (let c = 0; c < cols; c++) {
      const v = r(), n = v < 0.1 ? 3 : v < 0.36 ? 2 : v < 0.8 ? 1 : 0;
      if (n) rects += '<rect x="' + c * cell + '" y="' + (rows - n) * cell + '" width="' + cell + '" height="' + n * cell + '"/>';
    }
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + cols * cell + '" height="' + rows * cell + '" fill="' + color + '">' + rects + '</svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }

  // faint pixel texture laid over the colour cards
  function pxTile() {
    const r = rng(5), cell = 20, n = 13;
    let rects = '';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (r() < 0.09) rects += '<rect x="' + x * cell + '" y="' + y * cell + '" width="' + cell + '" height="' + cell + '"/>';
    }
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + n * cell + '" height="' + n * cell + '" fill="#fff">' + rects + '</svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }

  function paintChrome() {
    const name = String(C.name || 'Your Name');
    const logo = $('#logo');
    logo.setAttribute('aria-label', name + ', home');
    logo.append(C.logo ? h('img', { src: C.logo, alt: name }) : wordmark(name));

    const b = C.banner || {};
    $('#hello-small').textContent = b.small || 'Welcome to my';
    $('#hello-big').textContent = b.big || 'Creative portfolio';
    $('#hello-ic').append(icon('spark'));

    // the "Views generated" number sits to the left of that
    const views = num(C.viewsGenerated);
    if (views > 0) {
      $('#banner-side').prepend(h('div', { class: 'hello stat', role: 'img', 'aria-label': fmtFull(views) + ' views generated' },
        h('span', { class: 'hello-ic', 'aria-hidden': 'true' }, icon('eye')),
        h('span', { class: 'hello-t', 'aria-hidden': 'true' }, h('small', { text: 'Views generated' }), countUp(views, 1800))));
    }

    $('#banner-fx').append(scatter(11));
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#151517';
    $('#banner-edge').style.backgroundImage = edgeTile(bg);
    document.documentElement.style.setProperty('--px-tile', pxTile());

    tabsEl.append(...SECTIONS.map((sec, i) => h('a', { class: 'tabcard c-' + sec.id, href: '#' + sec.id, style: { '--i': i } },
      h('span', { class: 'tab-ic' }, icon(sec.icon)),
      h('span', { class: 'tab-tx' },
        h('span', { class: 'tab-t', text: sec.label }),
        h('span', { class: 'tab-s', text: sec.hint })))));

    // faint pixels drifting up behind the whole page
    const r = rng(23);
    document.body.prepend(h('div', { class: 'bg-px', 'aria-hidden': 'true' }, Array.from({ length: 16 }, () => {
      const size = 10 + Math.round(r() * 3) * 8;
      return h('i', { style: {
        left: (r() * 100).toFixed(1) + '%', width: size + 'px', height: size + 'px',
        '--t': (16 + r() * 22).toFixed(1) + 's', '--d': (-r() * 38).toFixed(1) + 's',
      } });
    })));

    // the sound on/off button
    if (window.SFX) {
      const btn = h('button', { class: 'sound-btn', type: 'button' });
      const paint = () => {
        btn.replaceChildren(icon(window.SFX.muted ? 'mute' : 'sound'));
        btn.setAttribute('aria-label', window.SFX.muted ? 'Turn sound on' : 'Turn sound off');
        btn.setAttribute('aria-pressed', !window.SFX.muted);
        btn.title = window.SFX.muted ? 'Sound is off' : 'Sound is on';
      };
      btn.addEventListener('click', () => { window.SFX.toggle(); paint(); });
      paint();
      document.body.append(btn);
    }

    if (DEMO) {
      document.body.append(h('div', { class: 'demo-flag' }, 'Demo preview · sample content',
        h('a', { href: location.pathname + location.hash, text: 'Exit' })));
    }
  }

  /* ------------------------------------------------------------------
     Routing
     ------------------------------------------------------------------ */
  const hashFor = () => {
    const sec = SECTIONS[Math.max(0, state.sec)];
    return '#' + sec.id + (sec.subs ? '/' + state.subs[sec.id] : '');
  };

  function route() {
    if (viewer) viewer.close();
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    if (parts[0] === 'contact') {
      if (state.sec < 0) show(0);
      history.replaceState(null, '', hashFor());
      $('#contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    let i = SECTIONS.findIndex(x => x.id === parts[0]);
    if (i < 0) i = 0;
    const sec = SECTIONS[i];
    let sub = null;
    if (sec.subs) sub = sec.subs.some(x => x.id === parts[1]) ? parts[1] : (state.subs[sec.id] || sec.subs[0].id);
    show(i, sub);
  }

  function show(i, sub) {
    const sec = SECTIONS[i];
    const first = state.sec < 0;
    const secChanged = i !== state.sec;
    const subChanged = !!sub && state.subs[sec.id] !== sub;
    state.sec = i;
    if (sub) state.subs[sec.id] = sub;

    if (secChanged) mount();
    else if (subChanged) fillBody();
    if (!first) sfx(secChanged ? 'tab' : subChanged ? 'sub' : '');

    [...tabsEl.children].forEach((el, k) => {
      if (k === i) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
    const active = tabsEl.children[i];
    if (tabsEl.scrollWidth > tabsEl.clientWidth) {
      tabsEl.scrollTo({ left: active.offsetLeft - (tabsEl.clientWidth - active.offsetWidth) / 2, behavior: 'smooth' });
    }
    document.title = (sec.id === 'home' ? '' : sec.label + ' · ') + (C.name || 'Portfolio');

    if (!first && (secChanged || subChanged)) {
      const top = $('.banner').offsetHeight;
      if (window.scrollY > top) window.scrollTo(0, top);
    }
  }

  function mount() {
    const sec = SECTIONS[state.sec];
    const view = h('div', { class: 'view c-' + sec.id });
    bodyEl = segEl = null;
    if (sec.id === 'home') {
      view.append(renderHome());
    } else {
      view.append(strip(sec));
      if (sec.subs) view.append(segEl = segs(sec));
      view.append(bodyEl = h('div', { class: 'vbody' }));
    }
    tipHide();
    main.replaceChildren(view);
    reveal(view);
    if (bodyEl) fillBody();
  }

  function fillBody() {
    const sec = SECTIONS[state.sec], sub = state.subs[sec.id];
    if (segEl) {
      for (const b of segEl.children) {
        const on = b.dataset.sub === sub;
        b.setAttribute('aria-selected', on);
        b.tabIndex = on ? 0 : -1;
      }
    }
    tipHide();
    bodyEl.className = 'vbody ' + (sub || '');
    bodyEl.replaceChildren(RENDER[sec.id](sub));
    reveal(bodyEl);
  }

  /* ------------------------------------------------------------------
     Motion: things rise into place as they scroll into view
     ------------------------------------------------------------------ */
  const REVEAL = '.about, .bento > .bc, .strip, .seg, .grid > *, .tiles > *, .panel, .channel, .inv, .nosignal, .note, .foot-h, .socials > *, .biz';
  const watcher = !REDUCED && 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      // everything that comes into view together rises one after the other
      entries.filter(e => e.isIntersecting).forEach((e, i) => {
        watcher.unobserve(e.target);
        e.target.style.setProperty('--i', Math.min(i, 9));
        e.target.classList.remove('rv-wait');
        e.target.classList.add('rise');
      });
    })
    : null;

  function reveal(root) {
    if (!watcher) return;
    for (const el of root.querySelectorAll(REVEAL)) {
      if (el.classList.contains('rise') || el.classList.contains('rv-wait')) continue;
      el.classList.add('rv-wait');
      watcher.observe(el);
    }
  }

  /* ------------------------------------------------------------------
     Shared pieces
     ------------------------------------------------------------------ */
  function cardInner(ic, kicker, title, tag) {
    return [
      h('span', { class: 'bc-k' }, icon(ic), kicker),
      h(tag, { class: 'bc-t' }, title.map(t => h('span', { text: t }))),
      h('i', { class: 'bc-rule' }),
    ];
  }

  function strip(sec) {
    const blurb = (C.blurbs || {})[sec.id];
    return h('header', { class: 'bc wide strip c-' + sec.id },
      cardInner(sec.icon, sec.kicker, sec.title, 'h1'),
      blurb && h('p', { class: 'bc-p', text: blurb }),
      h('span', { class: 'bc-peek2', 'aria-hidden': 'true' }),
      h('span', { class: 'bc-peek', 'aria-hidden': 'true' }, illo(sec.id)));
  }

  function segs(sec) {
    const el = h('div', { class: 'seg', role: 'tablist', 'aria-label': sec.label });
    for (const sb of sec.subs) {
      const n = count(sec.id, sb.id);
      const soon = sec.id === 'minecraft' && D.minecraft.comingSoon.includes(sb.id);
      el.append(h('button', {
        class: 'seg-b', type: 'button', role: 'tab', 'data-sub': sb.id,
        onclick: () => { location.hash = '#' + sec.id + '/' + sb.id; },
      }, sb.label, soon ? h('span', { class: 'seg-n', text: 'Soon' }) : n > 0 && h('span', { class: 'seg-n', text: n })));
    }
    el.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const list = [...el.children], at = list.indexOf(document.activeElement);
      if (at < 0) return;
      const to = list[(at + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length];
      to.focus();
      to.click();
      e.preventDefault();
    });
    return el;
  }

  // the test-card panel for a tab that isn't ready yet
  const comingSoon = () => h('div', { class: 'nosignal soon' },
    h('span', { 'aria-label': 'Coming soon' }, 'COMING SOON', h('i', { text: '.' }), h('i', { text: '.' }), h('i', { text: '.' })));

  // the hint an empty section shows its owner
  function note(lead, text, file, tail) {
    return h('p', { class: 'note' }, h('b', { text: lead }), text, h('code', { text: file }), tail);
  }
  const sampleChip = () => h('span', { class: 'chip-sample', text: 'SAMPLE' });

  /* ------------------------------------------------------------------
     Card illustrations (the white panel peeking out of each colour card)
     ------------------------------------------------------------------ */
  // The "an-" classes are the moving parts: see the illustration keyframes in
  // styles.css. --i staggers elements that take turns.
  const ILLO = {
    edits:
      '<rect class="il-k" x="16" y="16" width="268" height="124" rx="8"/>' +
      '<g class="an-pulse"><circle class="il-a" cx="150" cy="72" r="24"/><path class="il-w" d="M143 60v24l20-12z"/></g>' +
      '<rect x="30" y="122" width="240" height="5" rx="2.5" fill="#fff" opacity=".25"/>' +
      '<rect class="il-a an-fill" x="30" y="122" width="240" height="5" rx="2.5"/>' +
      '<rect class="il-g" x="16" y="154" width="160" height="12" rx="6"/><rect class="il-d" x="16" y="174" width="100" height="9" rx="4.5"/>',
    thumbnails:
      '<g class="an-turn" style="--i:0"><rect class="il-a" x="16" y="16" width="128" height="72" rx="7"/>' +
      '<circle class="il-w" cx="48" cy="52" r="17" opacity=".9"/><rect class="il-w" x="76" y="38" width="54" height="10" rx="3"/><rect class="il-w" x="76" y="56" width="38" height="10" rx="3" opacity=".7"/></g>' +
      '<g class="an-turn" style="--i:1"><rect class="il-k" x="156" y="16" width="128" height="72" rx="7"/><rect class="il-a" x="170" y="60" width="70" height="12" rx="3"/><rect class="il-w" x="170" y="34" width="46" height="12" rx="3" opacity=".85"/></g>' +
      '<g class="an-turn" style="--i:3"><rect class="il-g" x="16" y="100" width="128" height="72" rx="7"/><rect class="il-d" x="30" y="118" width="60" height="12" rx="3"/><circle class="il-d" cx="116" cy="136" r="16"/></g>' +
      '<g class="an-turn" style="--i:2"><rect class="il-d" x="156" y="100" width="128" height="72" rx="7"/><rect class="il-w" x="170" y="140" width="80" height="12" rx="3"/></g>',
    analytics:
      '<rect class="il-g" x="16" y="16" width="86" height="10" rx="5"/><rect class="il-k" x="16" y="34" width="58" height="18" rx="4"/>' +
      '<rect class="il-g an-grow" style="--i:0" x="24" y="124" width="24" height="34" rx="4"/><rect class="il-g an-grow" style="--i:1" x="62" y="104" width="24" height="54" rx="4"/>' +
      '<rect class="il-g an-grow" style="--i:2" x="100" y="112" width="24" height="46" rx="4"/><rect class="il-g an-grow" style="--i:3" x="138" y="86" width="24" height="72" rx="4"/>' +
      '<rect class="il-g an-grow" style="--i:4" x="176" y="96" width="24" height="62" rx="4"/><rect class="il-a an-grow" style="--i:5" x="214" y="58" width="24" height="100" rx="4"/>' +
      '<rect class="il-a an-grow" style="--i:6" x="252" y="30" width="24" height="128" rx="4"/><rect class="il-d" x="16" y="158" width="268" height="2"/>',
    contact:
      '<g class="an-chat" style="--i:0"><rect class="il-g" x="16" y="18" width="176" height="42" rx="14"/><rect class="il-d" x="34" y="34" width="110" height="9" rx="4.5"/></g>' +
      '<g class="an-chat" style="--i:1"><rect class="il-k" x="104" y="70" width="180" height="42" rx="14"/><rect class="il-w" x="122" y="86" width="126" height="9" rx="4.5" opacity=".85"/></g>' +
      '<g class="an-chat" style="--i:2"><rect class="il-g" x="16" y="122" width="124" height="42" rx="14"/><rect class="il-d" x="34" y="138" width="70" height="9" rx="4.5"/></g>',
  };

  // a blank Minecraft inventory, with a highlight hopping from slot to slot
  function mcIllo() {
    const svg = s('svg', { viewBox: '0 0 300 200', preserveAspectRatio: 'xMinYMin slice' });
    svg.append(s('rect', { width: 300, height: 200, fill: '#c6c6c6' }));
    const S = 54;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
      const x = 14 + c * S, y = 14 + r * S;
      svg.append(
        s('rect', { x, y, width: S, height: S, fill: '#373737' }),
        s('rect', { x: x + 3, y: y + 3, width: S - 3, height: S - 3, fill: '#fff' }),
        s('rect', { x: x + 3, y: y + 3, width: S - 6, height: S - 6, fill: '#8b8b8b' }));
    }
    svg.append(s('rect', { class: 'an-hop', x: 17, y: 17, width: S - 6, height: S - 6, fill: '#fff', opacity: 0.5 }));
    return svg;
  }

  function illo(id) {
    if (id === 'minecraft') return mcIllo();
    const svg = s('svg', { viewBox: '0 0 300 200', preserveAspectRatio: 'xMinYMin slice' });
    svg.innerHTML = ILLO[id] || '';
    return svg;
  }

  const peek = id => h('span', { class: 'bc-peek', 'aria-hidden': 'true' }, illo(id));

  /* ------------------------------------------------------------------
     Home
     ------------------------------------------------------------------ */
  function renderHome() {
    const f = frag();
    const big = (id, wide) => {
      const sec = section(id);
      return h('a', { class: 'bc c-' + id + (wide ? ' wide' : ''), href: '#' + id },
        cardInner(sec.icon, sec.kicker, sec.title, 'h2'),
        wide && h('span', { class: 'bc-peek2', 'aria-hidden': 'true' }),
        peek(id));
    };
    const skills = arr(C.skills);
    if (C.about || skills.length) {
      f.append(h('section', { class: 'about' },
        h('div', { class: 'about-tx' },
          h('h2', { text: 'About me' }),
          C.about && h('p', { text: C.about }),
          skills.length > 0 && h('div', { class: 'tags' }, skills.map(t => h('span', { class: 'tag', text: t })))),
        h('a', { class: 'about-cta', href: '#contact' }, icon('mail'), 'Message me')));
    }

    f.append(h('div', { class: 'bento' },
      big('edits'), big('thumbnails'), big('minecraft'), big('analytics', true),
      h('a', { class: 'bc wide c-contact', href: '#contact' },
        cardInner('mail', 'Got a project?', ['Work', 'With me'], 'h2'),
        h('span', { class: 'bc-peek2', 'aria-hidden': 'true' }),
        peek('contact'))));
    return f;
  }

  /* ------------------------------------------------------------------
     Edits
     ------------------------------------------------------------------ */
  RENDER.edits = sub => {
    const items = D.edits[sub], kind = sub === 'shortform' ? 'short' : 'long';
    const duo = items.length === 2 || items.length === 4;
    const f = frag(), grid = h('div', { class: 'grid ' + kind + (duo ? ' duo' : '') });
    if (items.length) {
      items.forEach((it, i) => grid.append(editCard(it, i, items, kind)));
      f.append(grid);
    } else {
      for (let i = 0; i < (kind === 'short' ? 4 : 3); i++) grid.append(emptyEdit(i, kind));
      f.append(grid, note('This bin is empty.', 'Add your ' + sub + ' edits in', 'js/content.js', 'under edits.' + sub + '.'));
    }
    return f;
  };

  // A card shows its cover and plays a muted preview while the mouse is over it.
  function editCard(it, i, items, kind) {
    const clip = clipOf(it), start = clip ? clip.start : 0;
    const media = h('span', { class: 'cc-media' });
    const length = h('span', { class: 'cc-dur', text: it.duration || (clip ? clock(clip.end - clip.start) : '') });
    const sub = h('span', { class: 'cc-sub', text: [it.client, it.role, it.views && it.views + ' views'].filter(Boolean).join(' · ') });
    const card = h('button', {
      class: 'cc ' + kind, type: 'button', 'aria-label': 'Play ' + (it.title || 'video'),
      onclick: () => openViewer(items, i, kind),
    }, media, h('span', { class: 'cc-meta' }, h('span', { class: 'cc-title', text: it.title || 'Untitled' }), sub));

    // no file, or a file that isn't in the folder yet
    const offline = () => {
      card.classList.add('is-empty');
      card.disabled = true;
      media.replaceChildren(h('span', { class: 'slate slate-off' }, h('b', { text: 'Media offline' })));
      sub.textContent = it.file ? 'Waiting for ' + it.file : 'No video file set';
    };

    if (it.file) {
      // the cover sits on top of the video and fades away once the preview is running
      const cover = it.poster && h('img', { class: 'cc-cover', src: it.poster, alt: '', loading: 'lazy' });
      let video = null, over = false;

      // With a cover the video is only created on the first hover, so opening the
      // page downloads no video at all. Without one it has to load to show a frame.
      const makeVideo = eager => {
        let source = it.preview || it.file;
        video = h('video', {
          src: source + (eager ? '#t=' + (start + 0.1) : ''),
          preload: eager ? 'metadata' : 'auto', playsinline: true, loop: !clip, tabindex: -1, 'aria-hidden': 'true',
        });
        video.muted = true;
        video.addEventListener('error', () => {
          if (source !== it.file) { source = it.file; video.src = source; if (over) play(); }
          else if (!cover) offline();
        });
        video.addEventListener('loadedmetadata', () => {
          if (length.textContent || !isFinite(video.duration)) return;
          length.textContent = clock(clip ? Math.min(clip.end, video.duration) - start : video.duration);
        });
        video.addEventListener('playing', () => { if (over) card.classList.add('previewing'); });
        if (clip) video.addEventListener('timeupdate', () => { if (video.currentTime >= clip.end) video.currentTime = start; });
        media.prepend(video);
      };
      const play = () => {
        const playing = video.play();
        if (playing) playing.catch(() => {});
      };

      card.addEventListener('pointerenter', e => {
        if (e.pointerType !== 'mouse' || card.disabled) return;
        over = true;
        if (!video) makeVideo(false);
        play();
      });
      card.addEventListener('pointerleave', () => {
        over = false;
        card.classList.remove('previewing');
        if (!video) return;
        video.pause();
        if (video.readyState) video.currentTime = start + (cover ? 0 : 0.1);
      });
      fill(media, null, [cover, h('span', { class: 'cc-play' }, icon('play')), length, it.sample && sampleChip()]);
      if (!cover) makeVideo(true);
    } else if (it.poster) {
      fill(media, null, [h('img', { src: it.poster, alt: '', loading: 'lazy' }), h('span', { class: 'cc-play' }, icon('play')), length, it.sample && sampleChip()]);
    } else {
      offline();
    }
    return card;
  }

  function emptyEdit(i, kind) {
    return h('div', { class: 'cc is-empty ' + kind },
      h('span', { class: 'cc-media' }, h('span', { class: 'slate slate-off' },
        h('b', { text: 'Media offline' }),
        kind === 'long' && h('small', { text: 'Média hors ligne · Medien offline · Medios sin conexión' }))),
      h('span', { class: 'cc-meta' },
        h('span', { class: 'cc-title', text: 'Slot ' + pad(i + 1) }),
        h('span', { class: 'cc-sub', text: 'Waiting for footage' })));
  }

  /* ------------------------------------------------------------------
     Thumbnails
     ------------------------------------------------------------------ */
  RENDER.thumbnails = () => {
    const items = D.thumbnails, f = frag();
    const n = items.length || 6;
    const grid = h('div', { class: 'grid thumbs' + (n >= 5 ? ' feature' : n === 3 ? '' : ' duo') });
    if (items.length) {
      items.forEach((it, i) => {
        const cap = [it.client, it.stat].filter(Boolean).join(' · ');
        grid.append(h('button', {
          class: 'cc th', type: 'button', 'aria-label': 'View ' + (it.title || 'thumbnail ' + (i + 1)),
          onclick: () => openViewer(items, i, 'image'),
        }, h('span', { class: 'cc-media' },
          h('img', { src: it.src, alt: it.title || '', loading: 'lazy' }),
          it.sample && sampleChip(),
          (it.title || cap) && h('span', { class: 'cc-cap' },
            it.title && h('span', { class: 'cc-title', text: it.title }),
            cap && h('span', { class: 'cc-sub', text: cap })))));
      });
      f.append(grid);
    } else {
      for (let i = 0; i < 6; i++) {
        grid.append(h('div', { class: 'cc is-empty th' }, h('span', { class: 'cc-media' },
          h('span', { class: 'slate slate-art' }, h('b', { text: 'Empty artboard' }), h('small', { text: '1280 × 720' })),
          h('span', { class: 'bbox' }, Array.from({ length: 8 }, () => h('i'))))));
      }
      f.append(grid, note('No thumbnails yet.', 'Drop images into assets/thumbnails and list them in', 'js/content.js', 'under thumbnails.'));
    }
    return f;
  };

  /* ------------------------------------------------------------------
     Minecraft
     ------------------------------------------------------------------ */
  const LINK_LABEL = { modrinth: 'Modrinth', curseforge: 'CurseForge', github: 'GitHub', download: 'Download', spigot: 'SpigotMC', hangar: 'Hangar', website: 'Website' };

  RENDER.minecraft = sub => {
    if (D.minecraft.comingSoon.includes(sub)) return comingSoon();
    if (sub === 'models') return modelsView();
    if (sub === 'textures') return texturesView();
    const items = D.minecraft[sub], one = sub === 'mods' ? 'mod' : 'plugin';
    const f = frag(), grid = h('div', { class: 'grid mods' });
    if (items.length) {
      items.forEach(it => {
        let card = modCard(it);
        grid.append(card);
        if (!modrinthSlug(it)) return;
        // draw what content.js has straight away, then fill in from Modrinth
        modrinthProject(modrinthSlug(it)).then(live => {
          const full = modCard(Object.assign({}, live, pruned(it), { links: Object.assign({}, live.links, pruned(it.links || {})) }));
          card.replaceWith(full);
          card = full;
        }, () => {});
      });
      f.append(grid);
    } else {
      for (let i = 0; i < 2; i++) {
        grid.append(h('article', { class: 'mod is-empty' },
          h('span', { class: 'mod-icon missing' }),
          h('div', null,
            h('div', { class: 'mod-top' }, h('h3', { class: 'mod-name', text: 'Empty ' + one + ' slot' })),
            h('p', { class: 'mod-desc', text: 'Name, description, version and download links go here.' }))));
      }
      f.append(grid, note('No ' + sub + ' yet.', 'Add them in', 'js/content.js', 'under minecraft.' + sub + '.'));
    }
    return f;
  };

  // an object without its blank fields, so "" in content.js never hides a live value
  const pruned = o => Object.fromEntries(Object.entries(o).filter(e => e[1] != null && e[1] !== ''));

  // "https://modrinth.com/mod/my-mod" or just "my-mod" -> "my-mod"
  const modrinthSlug = it => {
    const m = String(it.modrinth || '').trim().replace(/[?#].*$/, '').match(/([\w.-]+)\/?$/);
    return m ? m[1] : '';
  };
  const titleCase = s => String(s).replace(/(^|[\s-])([a-z])/g, (_, a, b) => a + b.toUpperCase());

  // public project details from Modrinth, kept for half an hour
  async function modrinthProject(slug) {
    let data = cacheGet('modrinth|' + slug);
    if (!data) {
      const res = await fetch('https://api.modrinth.com/v2/project/' + encodeURIComponent(slug));
      if (!res.ok) throw new Error('Modrinth answered ' + res.status);
      const p = await res.json();
      const needs = side => side === 'required' || side === 'optional';
      const versions = arr(p.game_versions);
      data = {
        t: Date.now(),
        mod: {
          name: p.title, description: p.description, icon: p.icon_url || '', downloads: p.downloads,
          loader: arr(p.loaders).filter(l => l !== 'datapack').map(titleCase).join(' / '),
          mc: versions.length > 1 ? versions[0] + ' to ' + versions[versions.length - 1] : versions[0] || '',
          side: needs(p.client_side) && needs(p.server_side) ? 'Client and server' : needs(p.client_side) ? 'Client' : needs(p.server_side) ? 'Server' : '',
          links: { modrinth: 'https://modrinth.com/' + (p.project_type || 'mod') + '/' + p.slug },
        },
      };
      cacheSet('modrinth|' + slug, data);
    }
    return data.mod;
  }

  function modCard(it) {
    const slug = modrinthSlug(it);
    const links = Object.assign({}, slug && { modrinth: 'https://modrinth.com/mod/' + slug }, pruned(it.links || {}));
    const name = it.name || (slug ? titleCase(slug.replace(/-/g, ' ')) : 'Untitled');
    const tags = [it.loader, it.mc && 'MC ' + it.mc, it.side].filter(Boolean);
    const downloads = num(it.downloads);
    const linkEls = Object.keys(links).filter(k => links[k]).map(k =>
      h('a', { class: 'btn', href: safeUrl(links[k]), target: '_blank', rel: 'noopener' }, LINK_LABEL[k] || k, icon('out')));
    let iconEl;
    if (it.icon) {
      iconEl = h('img', { class: 'mod-icon', src: it.icon, alt: '', loading: 'lazy' });
      // small pixel-art icons are scaled up and must stay sharp; big ones are scaled down
      iconEl.addEventListener('load', () => iconEl.classList.toggle('px', iconEl.naturalWidth < 64));
    } else {
      iconEl = h('span', { class: 'mod-icon letter', text: name.charAt(0).toUpperCase() });
    }
    return h('article', { class: 'mod' },
      iconEl,
      h('div', null,
        h('div', { class: 'mod-top' },
          h('h3', { class: 'mod-name', text: name }),
          it.version && h('span', { class: 'mod-ver', text: 'v' + it.version }),
          it.sample && h('span', { class: 'tag', text: 'Sample' })),
        it.description && h('p', { class: 'mod-desc', text: it.description }),
        downloads != null && h('p', { class: 'mod-stat' }, icon('download'), countUp(downloads), ' downloads'),
        tags.length > 0 && h('div', { class: 'tags' }, tags.map(t => h('span', { class: 'tag', text: t }))),
        linkEls.length > 0 && h('div', { class: 'mod-links' }, linkEls)));
  }

  function modelsView() {
    const items = D.minecraft.models, f = frag(), grid = h('div', { class: 'grid models' });
    if (items.length) {
      items.forEach((it, i) => grid.append(h('button', {
        class: 'cc model', type: 'button', 'aria-label': 'View ' + (it.name || 'model ' + (i + 1)),
        onclick: () => openViewer(items, i, it.pixel ? 'pixel' : 'image'),
      }, h('span', { class: 'cc-media' },
        h('img', { class: it.pixel ? 'px' : null, src: it.src, alt: it.name || '', loading: 'lazy' }),
        it.sample && sampleChip()),
      h('span', { class: 'cc-meta' },
        h('span', { class: 'cc-title', text: it.name || 'Untitled' }),
        it.note && h('span', { class: 'cc-sub', text: it.note })))));
      f.append(grid);
    } else {
      for (let i = 0; i < 4; i++) {
        grid.append(h('div', { class: 'cc is-empty model' },
          h('span', { class: 'cc-media' }, h('span', { class: 'slate slate-cube' },
            h('span', { class: 'cube', style: { 'animation-delay': -i * 3 + 's' } }, Array.from({ length: 6 }, () => h('i', { class: 'missing' }))))),
          h('span', { class: 'cc-meta' },
            h('span', { class: 'cc-title', text: 'Missing model' }),
            h('span', { class: 'cc-sub', text: 'Nothing loaded in this slot' }))));
      }
      f.append(grid, note('No models yet.', 'Put renders in assets/minecraft/models and list them in', 'js/content.js', 'under minecraft.models.'));
    }
    return f;
  }

  // a number that counts up to its value when it first appears
  function countUp(value, ms) {
    const el = h('b', { text: fmtFull(value) });
    if (REDUCED) return el;
    const start = performance.now();
    ms = ms || 1100;
    const step = now => {
      const t = Math.min(1, (now - start) / ms);
      el.textContent = fmtFull(value * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    return el;
  }

  function slotItem(it) {
    const n = Math.max(1, it.frames | 0);
    return h('span', {
      class: 'slot-item' + (n > 1 ? ' anim' : ''),
      style: n > 1 ? { '--n': n, '--dur': (n * 0.12).toFixed(2) + 's' } : null,
    }, h('img', { src: it.src, alt: '', loading: 'lazy' }));
  }

  function texturesView() {
    const items = D.minecraft.textures;
    const cells = Math.max(27, Math.ceil(items.length / 9) * 9);
    const grid = h('div', { class: 'inv-grid' });
    for (let i = 0; i < cells; i++) {
      const it = items[i];
      if (!it) { grid.append(h('span', { class: 'slot' })); continue; }
      const b = h('button', {
        class: 'slot', type: 'button', 'aria-label': it.name || 'Texture ' + (i + 1), style: { '--i': i },
        onclick: () => openViewer(items, i, 'pixel'),
      }, slotItem(it));
      bindTip(b, () => [h('b', { text: it.name || 'Texture' }), it.note], 'mc');
      // each slot plays its own note, so sweeping across the chest makes a tune
      b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') sfx('note', (i % 9) + Math.floor(i / 9)); });
      grid.append(b);
    }
    const wrap = h('div', { class: 'inv-wrap' },
      h('div', { class: 'inv' }, h('h2', { class: 'inv-title', text: 'Textures' }), grid));
    if (!items.length) wrap.append(note('This chest is empty.', 'Put textures in assets/minecraft/textures and list them in', 'js/content.js', 'under minecraft.textures.'));
    return wrap;
  }

  /* ------------------------------------------------------------------
     Analytics
     ------------------------------------------------------------------ */
  const YT = 'https://www.googleapis.com/youtube/v3/';

  async function yt(path, query) {
    const res = await fetch(YT + path + '?' + new URLSearchParams(query), { headers: { 'X-Goog-Api-Key': D.analytics.apiKey } });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error((json.error && json.error.message) || 'YouTube answered with an error (' + res.status + ').');
      err.status = res.status;
      throw err;
    }
    return json;
  }

  async function ytChannel() {
    const ch = D.analytics.channel, query = { part: 'snippet,statistics' };
    const idMatch = ch.match(/UC[\w-]{22}/), handle = ch.match(/@[\w.-]+/);
    if (idMatch) query.id = idMatch[0];
    else if (handle) query.forHandle = handle[0];
    else query.forHandle = '@' + ch.replace(/^.*\//, '');
    const it = ((await yt('channels', query)).items || [])[0];
    if (!it) throw new Error('Could not find the channel "' + ch + '".');
    const st = it.statistics || {};
    return {
      id: it.id, title: it.snippet.title,
      avatar: ((it.snippet.thumbnails || {}).default || {}).url || '',
      subs: st.hiddenSubscriberCount ? null : +st.subscriberCount, views: +st.viewCount, videos: +st.videoCount,
    };
  }

  // UULF... holds a channel's long-form uploads, UUSH... its Shorts
  async function ytUploads(channelId, sub) {
    try {
      const json = await yt('playlistItems', {
        part: 'contentDetails', maxResults: D.analytics.maxVideos,
        playlistId: (sub === 'shortform' ? 'UUSH' : 'UULF') + channelId.slice(2),
      });
      return (json.items || []).map(x => x.contentDetails.videoId);
    } catch (err) {
      if (err.status === 404) return [];
      throw err;
    }
  }

  async function ytVideos(ids) {
    const out = [];
    for (let i = 0; i < ids.length; i += 50) {
      const json = await yt('videos', { part: 'snippet,statistics', id: ids.slice(i, i + 50).join(',') });
      for (const v of json.items || []) {
        const st = v.statistics || {};
        out.push({
          id: v.id, title: v.snippet.title, published: v.snippet.publishedAt,
          views: st.viewCount != null ? +st.viewCount : null,
          likes: st.likeCount != null ? +st.likeCount : null,
          comments: st.commentCount != null ? +st.commentCount : null,
        });
      }
    }
    return out;
  }

  const CACHE_MS = 30 * 60 * 1000;
  function cacheGet(key) {
    try {
      const c = JSON.parse(localStorage.getItem('pf.yt') || '{}')[key];
      return c && Date.now() - c.t < CACHE_MS ? c : null;
    } catch (err) { return null; }
  }
  function cacheSet(key, value) {
    try {
      const all = JSON.parse(localStorage.getItem('pf.yt') || '{}');
      all[key] = value;
      localStorage.setItem('pf.yt', JSON.stringify(all));
    } catch (err) { /* storage unavailable: just refetch next time */ }
  }

  async function loadAnalytics(sub) {
    const A = D.analytics;
    const manual = arr(A[sub].videos).map(v => ({
      id: ytId(v.youtube), title: v.title || '', published: v.published || '', thumb: v.thumb || '',
      views: num(v.views), likes: num(v.likes), comments: num(v.comments), sample: !!v.sample,
    }));
    if (!manual.length && !(A.apiKey && A.channel)) return { state: 'empty' };
    if (!A.apiKey) return { state: 'ok', source: manual.some(v => v.sample) ? 'sample' : 'manual', videos: manual };

    try {
      const key = [sub, A.channel, A.maxVideos, manual.map(v => v.id).join(',')].join('|');
      let data = cacheGet(key);
      if (!data) {
        const channel = A.channel ? await ytChannel() : null;
        const ids = manual.length ? manual.map(v => v.id).filter(Boolean) : await ytUploads(channel.id, sub);
        data = { t: Date.now(), channel, stats: ids.length ? await ytVideos(ids) : [] };
        cacheSet(key, data);
      }
      let videos = data.stats;
      if (manual.length) {
        const live = new Map(data.stats.map(v => [v.id, v]));
        videos = manual.map(m => Object.assign({}, m, live.get(m.id), m.title ? { title: m.title } : null));
      }
      if (!videos.length) return { state: 'empty', channel: data.channel };
      return { state: 'ok', source: 'live', videos, channel: data.channel, t: data.t };
    } catch (err) {
      const error = 'Could not reach YouTube: ' + err.message;
      return manual.length ? { state: 'ok', source: 'manual', videos: manual, error } : { state: 'empty', error };
    }
  }

  RENDER.analytics = sub => {
    if (D.analytics.comingSoon) return comingSoon();
    const box = h('div', { class: 'an' }, h('p', { class: 'src' }, h('i', { class: 'src-dot' }), 'Loading'));
    loadAnalytics(sub).then(d => {
      if (box.isConnected) box.replaceChildren(analyticsBody(sub, d));
    });
    return box;
  };

  function tile(label, value, noteText) {
    return h('div', { class: 'tile' },
      h('div', { class: 'tile-label', text: label }),
      h('div', { class: 'tile-value', text: value }),
      noteText && h('div', { class: 'tile-note', text: noteText, title: noteText }));
  }

  function analyticsBody(sub, d) {
    const f = frag();
    const highlights = arr(D.analytics[sub].highlights).filter(x => x && x.label);
    const noun = sub === 'shortform' ? 'Shorts' : 'videos';

    if (d.state !== 'ok') {
      if (d.error) f.append(h('p', { class: 'src' }, h('span', { class: 'src-err', text: d.error })));
      if (highlights.length) f.append(h('div', { class: 'tiles', style: { 'margin-bottom': '12px' } }, highlights.map(x => tile(x.label, x.value, x.note))));
      f.append(h('div', { class: 'nosignal' }, h('span', { text: d.channel ? 'NO ' + noun.toUpperCase() + ' FOUND' : 'NO SIGNAL' })));
      if (!d.channel) {
        f.append(h('ol', { class: 'steps' },
          h('li', null, h('b', { text: 'Go live. ' }), 'Open ', h('code', { text: 'js/content.js' }), ' and fill in ',
            h('code', { text: 'analytics.channel' }), ' and ', h('code', { text: 'analytics.apiKey' }),
            '. Your latest ' + (sub === 'shortform' ? 'Shorts' : 'long-form videos') + ' then load by themselves.'),
          h('li', null, h('b', { text: 'Or by hand. ' }), 'List videos with their view counts under ',
            h('code', { text: 'analytics.' + sub + '.videos' }), '.')));
      }
      return f;
    }

    const vids = d.videos.filter(v => v.views != null);
    const label = d.source === 'live' ? 'Live from YouTube · updated ' + ago(d.t)
      : d.source === 'sample' ? 'Sample data' : 'Numbers entered by hand';
    f.append(h('p', { class: 'src' + (d.source === 'live' ? ' live' : '') },
      h('i', { class: 'src-dot' }), label,
      d.error && h('span', { class: 'src-err', text: d.error })));

    if (d.channel) {
      f.append(h('div', { class: 'channel' },
        d.channel.avatar && h('img', { src: d.channel.avatar, alt: '', referrerpolicy: 'no-referrer' }),
        h('div', null,
          h('div', { class: 'channel-name', text: d.channel.title }),
          h('div', { class: 'channel-sub', text: [
            d.channel.subs != null && fmt(d.channel.subs) + ' subscribers',
            fmt(d.channel.views) + ' channel views',
            fmtFull(d.channel.videos) + ' uploads',
          ].filter(Boolean).join(' · ') }))));
    }

    if (!vids.length) {
      f.append(h('div', { class: 'nosignal' }, h('span', { text: 'NO VIEW COUNTS' })),
        note('These videos have no numbers.', 'Add views to each one, or set', 'analytics.apiKey', 'to fetch them live.'));
      return f;
    }

    const total = sum(vids, 'views');
    const top = vids.reduce((a, b) => (b.views > a.views ? b : a), vids[0]);
    const liked = vids.filter(v => v.likes != null);
    const tiles = [
      tile('Total views', fmt(total), 'across ' + vids.length + ' ' + noun),
      tile('Average per video', fmt(total / vids.length), 'views'),
      tile('Best performer', fmt(top.views), top.title || 'Untitled'),
    ];
    if (liked.length) {
      const rate = (sum(liked, 'likes') + sum(liked, 'comments')) / Math.max(1, sum(liked, 'views'));
      tiles.push(tile('Engagement', (rate * 100).toFixed(1) + '%', 'likes and comments per view'));
    }
    highlights.forEach(x => tiles.push(tile(x.label, x.value, x.note)));
    f.append(h('div', { class: 'tiles' }, tiles));

    if (vids.length > 1) f.append(chart(vids));
    f.append(table(vids));
    return f;
  }

  function ticks(max) {
    if (!(max > 0)) return [0, 1];
    const raw = max / 4, exp = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / exp;
    const step = (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * exp;
    const out = [];
    for (let v = 0; v < max + step * 0.999; v += step) out.push(v);
    return out;
  }

  function chart(vids) {
    const dated = vids.every(v => dateOf(v.published));
    let list = dated ? vids.slice().sort((a, b) => dateOf(a.published) - dateOf(b.published)) : vids.slice();
    const MAX = 24, cut = list.length > MAX;
    if (cut) list = list.slice(-MAX);

    const max = Math.max(...list.map(v => v.views));
    const tk = ticks(max), top = tk[tk.length - 1];
    const best = list.findIndex(v => v.views === max);

    const yAxis = h('div', { class: 'chart-y', 'aria-hidden': 'true' }, h('span', { class: 'sizer', text: fmt(top) }),
      tk.map(t => h('span', { style: { '--at': t / top }, text: fmt(t) })));
    const cols = h('div', { class: 'chart-cols' });
    const xAxis = h('div', { class: 'chart-x', 'aria-hidden': 'true' });

    list.forEach((v, i) => {
      const when = fmtDate(v.published);
      const col = h('button', {
        class: 'col', type: 'button', style: { '--v': Math.max(0, v.views / top) },
        'aria-label': (v.title || 'Video ' + (i + 1)) + ': ' + fmtFull(v.views) + ' views' + (when ? ', ' + when : ''),
      }, h('span', { class: 'bar' }), i === best && h('span', { class: 'cap', text: fmt(v.views) }));
      bindTip(col, () => [
        h('b', { text: fmtFull(v.views) + ' views' }),
        h('span', { class: 'tip-k' }), v.title || 'Video ' + (i + 1),
        when && h('div', { text: when }),
      ]);
      cols.append(col);
      xAxis.append(h('span', { text: dated ? fmtDate(v.published, { month: 'short', day: 'numeric' }) : '#' + (i + 1) }));
    });

    const plot = h('div', { class: 'chart-plot' },
      h('div', { class: 'chart-grid', 'aria-hidden': 'true' }, tk.map(t => h('i', { style: { '--at': t / top } }))), cols);

    // thin the date labels out until they stop colliding
    const layout = () => {
      const stride = Math.max(1, Math.ceil(50 / (plot.clientWidth / list.length || 1)));
      [...xAxis.children].forEach((el, i) => el.classList.toggle('off', (list.length - 1 - i) % stride !== 0));
    };
    if (window.ResizeObserver) new ResizeObserver(layout).observe(plot);

    return h('section', { class: 'panel' },
      h('div', { class: 'panel-head' },
        h('h2', { class: 'panel-title', text: 'Views per video' }),
        h('span', { class: 'panel-sub', text: (cut ? 'Latest ' + MAX + ', ' : '') + (dated ? 'oldest to newest' : 'in listed order') })),
      h('div', { class: 'chart' }, yAxis, plot, xAxis));
  }

  function table(vids) {
    const rows = vids.slice().sort((a, b) => b.views - a.views);
    const cell = (v, cls) => h('td', { class: cls }, v);
    return h('section', { class: 'panel' },
      h('div', { class: 'panel-head' },
        h('h2', { class: 'panel-title', text: 'Every video' }),
        h('span', { class: 'panel-sub', text: 'Ranked by views' })),
      h('div', { class: 'vt-wrap' }, h('table', { class: 'vt' },
        h('thead', null, h('tr', null,
          h('th', { text: '#' }), h('th', { text: 'Video' }), h('th', { class: 'opt', text: 'Published' }),
          h('th', { class: 'num', text: 'Views' }), h('th', { class: 'num opt', text: 'Likes' }), h('th', { class: 'num opt', text: 'Comments' }))),
        h('tbody', null, rows.map((v, i) => {
          const thumb = v.thumb || (v.id ? 'https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg' : '');
          const inner = [thumb && h('img', { src: thumb, alt: '', loading: 'lazy' }), h('span', { class: 'vt-title', text: v.title || 'Untitled' })];
          return h('tr', null,
            cell(i + 1, 'rank'),
            cell(v.id
              ? h('a', { class: 'vt-video', href: 'https://www.youtube.com/watch?v=' + v.id, target: '_blank', rel: 'noopener' }, inner)
              : h('span', { class: 'vt-video' }, inner)),
            cell(fmtDate(v.published) || '–', 'muted opt'),
            cell(fmtFull(v.views), 'num'),
            cell(fmtFull(v.likes), 'num opt'),
            cell(fmtFull(v.comments), 'num opt'));
        })))));
  }

  /* ------------------------------------------------------------------
     Footer / contact
     ------------------------------------------------------------------ */
  const bare = v => String(v).trim().replace(/^@/, '');
  const PLATFORMS = [
    { key: 'email', label: 'Email', color: 'var(--brand)', ink: 'var(--brand-ink)', icon: 'mail', url: v => 'mailto:' + v, show: v => v },
    { key: 'youtube', label: 'YouTube', color: '#ff0033', icon: 'youtube', url: v => 'https://www.youtube.com/@' + bare(v) },
    { key: 'discord', label: 'Discord', color: '#5865f2', icon: 'discord', copy: true },
    { key: 'twitter', label: 'Twitter/X', color: '#3b3b44', icon: 'twitter', url: v => 'https://x.com/' + bare(v) },
    { key: 'tiktok', label: 'TikTok', color: '#fe2c55', icon: 'tiktok', url: v => 'https://www.tiktok.com/@' + bare(v) },
    { key: 'instagram', label: 'Instagram', color: '#e1306c', icon: 'instagram', url: v => 'https://www.instagram.com/' + bare(v) },
    { key: 'github', label: 'GitHub', color: '#6e7681', icon: 'github', url: v => 'https://github.com/' + bare(v) },
    { key: 'modrinth', label: 'Modrinth', color: '#1bd96a', ink: '#04240f', icon: 'cube', url: v => 'https://modrinth.com/user/' + bare(v) },
  ];

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const ta = h('textarea', { style: { position: 'fixed', opacity: '0' } });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (err) { /* nothing more to try */ }
    ta.remove();
    return Promise.resolve();
  }

  function socialCard(p, value) {
    const isUrl = /^https?:\/\//i.test(value);
    const shown = isUrl ? value.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '') : (p.show ? p.show(value) : '@' + bare(value));
    const sub = h('span', { class: 'social-s', text: shown });
    const inner = [
      h('span', { class: 'social-ic' }, icon(p.icon)),
      h('span', { class: 'social-tx' }, h('span', { class: 'social-t', text: p.label }), sub),
    ];
    const style = { '--c': p.color, '--ink': p.ink || '#fff' };
    if (p.copy && !isUrl) {
      return h('button', {
        class: 'social', type: 'button', style, 'aria-label': 'Copy ' + p.label + ' username ' + value,
        onclick: () => copyText(value).then(() => {
          sfx('success');
          sub.textContent = 'Copied';
          setTimeout(() => { sub.textContent = shown; }, 1600);
        }),
      }, inner);
    }
    const href = isUrl ? value : p.url(value);
    return h('a', { class: 'social', style, href: safeUrl(href), target: href.slice(0, 7) === 'mailto:' ? null : '_blank', rel: 'noopener' }, inner);
  }

  function renderFoot() {
    const c = D.contact, cards = [];
    for (const p of PLATFORMS) {
      const v = String(c[p.key] || '').trim();
      if (v) cards.push(socialCard(p, v));
    }
    for (const l of arr(c.links)) {
      if (l && l.url) cards.push(socialCard({ label: l.label || 'Link', color: '#4b4b55', icon: 'link', url: v => v }, String(l.url)));
    }
    const email = String(c.email || '').trim();
    $('#contact').append(
      h('h2', { class: 'foot-h', text: 'Get in touch' }),
      cards.length
        ? h('div', { class: 'socials' }, cards)
        : note('No contact links yet.', 'Add your email and socials in', 'js/content.js', 'under contact.'),
      email && h('p', { class: 'biz' }, 'Business inquiries:', h('br'), h('a', { href: 'mailto:' + email, text: email })),
      h('p', { class: 'copy', text: '© ' + new Date().getFullYear() + ' ' + (C.name || '') }));
    reveal($('#contact'));
  }

  /* ------------------------------------------------------------------
     Viewer: video player and image lightbox
     ------------------------------------------------------------------ */
  let viewer = null;

  function openViewer(items, index, kind) {
    const opener = document.activeElement;
    let at = index;
    const stage = h('div', { class: 'mv-stage' });
    const title = h('span', { class: 'mv-title' });
    const counter = h('span', { class: 'mv-count' });
    const cap = h('p', { class: 'mv-cap' });
    const closeBtn = h('button', { class: 'mv-x', type: 'button', 'aria-label': 'Close', onclick: close }, icon('x'));
    const many = items.length > 1;
    const el = h('div', { class: 'mv c-' + SECTIONS[state.sec].id, role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Viewer' },
      h('div', { class: 'mv-bar' }, title, many && counter, closeBtn),
      stage,
      many && h('button', { class: 'mv-nav mv-prev', type: 'button', 'aria-label': 'Previous', onclick: () => go(at - 1) }, icon('left')),
      many && h('button', { class: 'mv-nav mv-next', type: 'button', 'aria-label': 'Next', onclick: () => go(at + 1) }, icon('right')),
      cap);

    function media(it) {
      if (kind === 'image') return h('img', { class: 'mv-img', src: it.src, alt: it.title || it.name || '' });
      if (kind === 'pixel') return h('div', { class: 'mv-px' }, slotItem(it));
      const frame = h('div', { class: 'mv-frame ' + kind });
      const clip = clipOf(it);
      if (it.file) {
        // the cover shows straight away, with a spinner until the video can play
        const video = h('video', { src: it.file, poster: it.poster, preload: 'auto', controls: true, autoplay: true, playsinline: true });
        frame.classList.add('loading');
        for (const ev of ['playing', 'canplay']) video.addEventListener(ev, () => frame.classList.remove('loading'));
        video.addEventListener('waiting', () => frame.classList.add('loading'));
        // keep a clip inside its window, even if the seek bar is dragged past it
        if (clip) {
          if (clip.start) video.addEventListener('loadedmetadata', () => { video.currentTime = clip.start; });
          video.addEventListener('timeupdate', () => {
            if (video.currentTime > clip.end || video.currentTime < clip.start - 0.5) { video.pause(); video.currentTime = clip.start; }
          });
        }
        video.addEventListener('error', () => {
          frame.classList.remove('loading');
          frame.replaceChildren(h('span', { class: 'slate slate-off' }, h('b', { text: 'Media offline' })));
        });
        frame.append(video);
      } else {
        if (it.poster) frame.append(h('img', { src: it.poster, alt: '' }));
        frame.append(h('span', { class: 'slate', style: { background: 'rgba(0,0,0,.55)' } }, h('b', { text: 'No video attached to this sample' })));
      }
      return frame;
    }

    function go(n) {
      at = (n + items.length) % items.length;
      const it = items[at];
      stage.replaceChildren(media(it));
      title.textContent = it.title || it.name || 'Untitled';
      counter.textContent = (at + 1) + ' / ' + items.length;
      const clip = (kind === 'long' || kind === 'short') && clipOf(it);
      const clipNote = clip && (clip.start ? 'Clip ' + clock(clip.start) + ' to ' + clock(clip.end) : 'First ' + Math.round(clip.end) + ' seconds');
      cap.textContent = [clipNote, it.client, it.role, it.stat, it.note, it.views && it.views + ' views'].filter(Boolean).join(' · ');
    }

    function close() {
      sfx('close');
      el.remove();
      document.documentElement.classList.remove('locked');
      viewer = null;
      if (opener && opener.focus) opener.focus();
    }

    el.addEventListener('click', e => { if (e.target === el || e.target === stage) close(); });
    el.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focusable = [...el.querySelectorAll('button')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (!el.contains(document.activeElement)) { first.focus(); e.preventDefault(); }
      else if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    });

    const turn = n => { if (many) { sfx('next'); go(n); } };
    viewer = { close, next: () => turn(at + 1), prev: () => turn(at - 1) };
    document.documentElement.classList.add('locked');
    tipHide();
    document.body.append(el);
    go(at);
    sfx('open');
    closeBtn.focus();
  }

  document.addEventListener('keydown', e => {
    if (!viewer) return;
    if (e.key === 'Escape') viewer.close();
    else if (e.key === 'ArrowRight') viewer.next();
    else if (e.key === 'ArrowLeft') viewer.prev();
  });

  /* ------------------------------------------------------------------
     Tooltip
     ------------------------------------------------------------------ */
  const tipEl = $('#tip');

  function tipMove(x, y) {
    const r = tipEl.getBoundingClientRect();
    let left = x + 14, top = y - r.height - 12;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - 14;
    if (left < 8) left = 8;
    if (top < 8) top = y + 20;
    tipEl.style.left = left + 'px';
    tipEl.style.top = top + 'px';
  }
  function tipShow(kids, x, y, cls) {
    tipEl.className = 'tip on' + (cls ? ' ' + cls : '');
    tipEl.replaceChildren(...[].concat(kids).filter(k => k != null && k !== false && k !== ''));
    tipMove(x, y);
  }
  function tipHide() { tipEl.classList.remove('on'); }

  function bindTip(el, build, cls) {
    el.addEventListener('pointerenter', e => tipShow(build(), e.clientX, e.clientY, cls));
    el.addEventListener('pointermove', e => tipMove(e.clientX, e.clientY));
    el.addEventListener('pointerleave', tipHide);
    el.addEventListener('focus', () => {
      const r = el.getBoundingClientRect();
      tipShow(build(), r.left + r.width / 2, r.top + 8, cls);
    });
    el.addEventListener('blur', tipHide);
  }

  /* ------------------------------------------------------------------
     Feel: hover and click sounds, tilting cards, a pixel burst on click
     ------------------------------------------------------------------ */
  const HOVERABLE = '.tabcard, a.bc, .cc:not(.is-empty), .seg-b, .social, .btn, .about-cta, .mv-nav, .mv-x, .sound-btn, .vt-video';

  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse' || !e.target.closest) return;
    const el = e.target.closest(HOVERABLE);
    // only when the pointer arrives from outside, not when it moves within the element
    if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) sfx('hover');
  });

  document.addEventListener('pointerdown', e => {
    if (e.button || !e.target.closest) return;
    const el = e.target.closest('a, button');
    // tabs make their own sound when the page changes
    if (el && !el.disabled && !el.matches('.tabcard, .seg-b')) sfx('click');
    burst(e.clientX, e.clientY, el);
  });

  // a few pixels flying out from wherever the visitor clicks
  function burst(x, y, from) {
    if (REDUCED) return;
    const colour = from ? getComputedStyle(from).getPropertyValue('--c').trim() : '';
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.8, reach = 26 + Math.random() * 30;
      const bit = h('i', { class: 'bit', style: {
        left: x + 'px', top: y + 'px',
        '--dx': (Math.cos(angle) * reach).toFixed(1) + 'px', '--dy': (Math.sin(angle) * reach).toFixed(1) + 'px',
        '--s': (5 + Math.round(Math.random() * 5)) + 'px',
        background: i % 3 === 0 ? '#fff' : colour || 'var(--brand)',
      } });
      bit.addEventListener('animationend', () => bit.remove());
      document.body.append(bit);
    }
  }

  // the big colour cards lean towards the pointer, with a soft light under it
  if (!REDUCED) {
    document.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || !e.target.closest) return;
      const card = e.target.closest('a.bc');
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((px - 0.5) * 7).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    });
    document.addEventListener('pointerout', e => {
      const card = e.target.closest && e.target.closest('a.bc');
      if (card && !(e.relatedTarget && card.contains(e.relatedTarget))) {
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
      }
    });
  }

  /* ------------------------------------------------------------------
     Start
     ------------------------------------------------------------------ */
  function boot() {
    main = $('#main');
    tabsEl = $('#tabs');
    readContent();
    paintChrome();
    renderFoot();
    window.addEventListener('hashchange', route);
    route();
  }

  if (DEMO) {
    const sc = h('script', { src: 'js/demo.js' });
    sc.onload = () => { if (window.PORTFOLIO_DEMO) window.PORTFOLIO_DEMO(C); boot(); };
    sc.onerror = boot;
    document.head.append(sc);
  } else {
    boot();
  }
})();
