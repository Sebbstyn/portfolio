/* Sample content for previewing the layout. Only loaded when the page is
   opened with ?demo, and only fills sections that are still empty. Nothing
   here is saved or shown on the normal site. */
window.PORTFOLIO_DEMO = function (C) {
  'use strict';

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // a flat colour card standing in for a real thumbnail
  function slate(text, hue, w, h) {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="hsl(' + hue + ' 72% 48%)"/><stop offset="1" stop-color="hsl(' + ((hue + 46) % 360) + ' 76% 20%)"/>' +
      '</linearGradient></defs>' +
      '<rect width="100%" height="100%" fill="url(#g)"/>' +
      '<circle cx="' + w * 0.8 + '" cy="' + h * 0.28 + '" r="' + Math.min(w, h) * 0.42 + '" fill="hsl(' + ((hue + 24) % 360) + ' 92% 64%)" opacity=".35"/>' +
      '<rect x="' + w * 0.06 + '" y="' + h * 0.6 + '" width="' + w * 0.5 + '" height="' + h * 0.07 + '" rx="6" fill="#fff"/>' +
      '<rect x="' + w * 0.06 + '" y="' + h * 0.72 + '" width="' + w * 0.34 + '" height="' + h * 0.07 + '" rx="6" fill="#fff" opacity=".7"/>' +
      '<text x="' + w * 0.06 + '" y="' + h * 0.2 + '" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="' + Math.min(w, h) * 0.12 + '" fill="#fff" opacity=".85">' + text + '</text>' +
      '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  // a random symmetric 16x16 sprite standing in for a real texture
  function sprite(seed) {
    const c = document.createElement('canvas');
    c.width = c.height = 16;
    const x = c.getContext('2d'), r = rng(seed), hue = (r() * 360) | 0;
    const pal = ['hsl(' + hue + ' 60% 28%)', 'hsl(' + hue + ' 72% 48%)', 'hsl(' + hue + ' 82% 68%)', 'hsl(' + ((hue + 40) % 360) + ' 85% 62%)'];
    for (let y = 2; y < 14; y++) for (let px = 2; px < 8; px++) {
      if (r() < 0.82 - Math.hypot(px - 8, y - 8) * 0.085) {
        x.fillStyle = pal[(r() * pal.length) | 0];
        x.fillRect(px, y, 1, 1);
        x.fillRect(15 - px, y, 1, 1);
      }
    }
    return c.toDataURL();
  }

  const empty = v => !Array.isArray(v) || !v.length;

  C.edits = C.edits || {};
  if (empty(C.edits.longform)) {
    C.edits.longform = [
      ['Building a Mega Base in 24 Hours', '18:42', '1.2M'], ['The Update Nobody Asked For, Explained', '11:07', '640K'],
      ['I Tried Every Farm So You Don\'t Have To', '22:15', '2.1M'], ['Ranking 50 Mods From Worst to Best', '14:33', '410K'],
      ['A Calm Survival Let\'s Play, Episode 12', '31:20', '88K'], ['How This Server Hit 10,000 Players', '09:58', '305K'],
    ].map((v, i) => ({ title: v[0], duration: v[1], views: v[2], client: 'Sample channel', role: 'Edit · Sound design', poster: slate('SAMPLE', 12 + i * 58, 640, 360), sample: true }));
  }
  if (empty(C.edits.shortform)) {
    C.edits.shortform = ['Clutch of the year', 'One block challenge', 'This glitch is wild', 'Speedrun fail', 'Secret room build', 'Mod in 30 seconds', 'Texture glow-up', 'Wait for it']
      .map((t, i) => ({ title: t, views: ['3.4M', '890K', '1.1M', '240K', '5.2M', '77K', '460K', '2.0M'][i], client: 'Sample channel', poster: slate('SAMPLE', 200 + i * 41, 360, 640), sample: true }));
  }

  if (empty(C.thumbnails)) {
    C.thumbnails = ['I Survived 100 Days', 'The Final Boss', 'Rating Your Builds', 'Worst Mod Ever?', '1 vs 100 Players', 'Secret Update', 'New World Tour', 'Hardcore Day 1', 'Biggest Farm Yet']
      .map((t, i) => ({ src: slate('SAMPLE', 330 + i * 37, 640, 360), title: t, client: 'Sample channel', stat: ['2.4M views · 11.2% CTR', '760K views · 8.9% CTR', '1.3M views · 9.6% CTR'][i % 3], sample: true }));
  }

  const M = C.minecraft = C.minecraft || {};
  if (empty(M.mods)) {
    M.mods = [
      { name: 'Sample Mod', description: 'A short pitch for what the mod adds and why players would want it installed.', version: '1.4.2', mc: '1.21.11', loader: 'Fabric', side: 'Client', links: { modrinth: '#', github: '#' } },
      { name: 'Another Mod', description: 'Second example entry. Descriptions wrap onto several lines without breaking the card.', version: '0.9.0', mc: '1.21.11', loader: 'Fabric', side: 'Both', links: { download: '#' } },
      { name: 'Third Mod', description: 'One more, so the grid shows how a row of cards fills up.', version: '2.0.1', mc: '1.21.11', loader: 'Fabric', side: 'Server', links: { modrinth: '#' } },
    ].map((m, i) => Object.assign(m, { icon: sprite(40 + i), sample: true }));
  }
  if (empty(M.plugins)) {
    M.plugins = [
      { name: 'Sample Plugin', description: 'What the plugin does on a server, in a sentence or two.', version: '1.0.0', mc: '1.21.11', loader: 'Paper', side: 'Server', links: { hangar: '#', github: '#' }, sample: true },
      { name: 'Another Plugin', description: 'A second example entry without an icon, which falls back to a letter tile.', version: '1.2.0', mc: '1.21.11', loader: 'Paper', side: 'Server', links: { download: '#' }, sample: true },
    ];
  }
  if (empty(M.models)) {
    M.models = ['Sample model A', 'Sample model B', 'Sample model C', 'Sample model D']
      .map((n, i) => ({ src: sprite(90 + i * 3), name: n, note: 'Blockbench · sample', pixel: true, sample: true }));
  }
  if (empty(M.textures)) {
    M.textures = Array.from({ length: 22 }, (_, i) => ({ src: sprite(200 + i * 7), name: 'Sample item ' + (i + 1), note: '16x · sample' }));
  }

  const A = C.analytics = C.analytics || {};
  const fake = (n, base, seed, stepDays) => {
    const r = rng(seed), start = Date.UTC(2026, 3, 2);
    return Array.from({ length: n }, (_, i) => {
      const views = Math.round(base * (0.25 + r() * 1.2) * (1 + i * 0.07) * (r() < 0.12 ? 3 : 1));
      return {
        title: 'Sample video ' + (i + 1), views,
        likes: Math.round(views * (0.03 + r() * 0.03)), comments: Math.round(views * (0.002 + r() * 0.003)),
        published: new Date(start + i * stepDays * 864e5).toISOString().slice(0, 10),
        thumb: slate('SAMPLE', (seed * 30 + i * 47) % 360, 320, 180), sample: true,
      };
    });
  };
  A.longform = A.longform || {};
  A.shortform = A.shortform || {};
  if (empty(A.longform.videos) && !(A.apiKey && A.channel)) {
    A.longform.videos = fake(12, 180000, 3, 12);
    if (empty(A.longform.highlights)) A.longform.highlights = [{ label: 'Avg. view duration', value: '6:48', note: 'sample figure' }];
  }
  if (empty(A.shortform.videos) && !(A.apiKey && A.channel)) {
    A.shortform.videos = fake(18, 520000, 8, 5);
    if (empty(A.shortform.highlights)) A.shortform.highlights = [{ label: 'Viewed vs swiped away', value: '74%', note: 'sample figure' }];
  }

  const K = C.contact = C.contact || {};
  if (!['email', 'youtube', 'discord', 'twitter', 'tiktok', 'instagram', 'github', 'modrinth'].some(k => K[k])) {
    Object.assign(K, { email: 'hello@example.com', youtube: '@yourchannel', discord: 'yourname', twitter: '@yourname' });
  }
};
