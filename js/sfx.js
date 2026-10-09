/* Sound effects for the site. Every sound is synthesised in the browser, so
   there are no audio files to load.

     SFX.play("click")      play a sound by name
     SFX.play("note", 3)    one note of a scale, used for the texture chest
     SFX.toggle()           mute or unmute; the choice is remembered
     SFX.muted              true while muted
*/
window.SFX = (function () {
  'use strict';

  const KEY = 'pf.muted';
  const last = {};
  let ctx = null, out = null, muted = false;
  try { muted = localStorage.getItem(KEY) === '1'; } catch (err) { /* storage unavailable */ }

  // Browsers only let a page make sound once the visitor has clicked or
  // pressed a key, so the audio engine is started on the first of those.
  function unlock() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      ctx = new AudioCtx();
      out = ctx.createGain();
      out.gain.value = 0.5;
      const limiter = ctx.createDynamicsCompressor();
      out.connect(limiter);
      limiter.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
  }
  for (const ev of ['pointerdown', 'keydown', 'touchstart']) {
    window.addEventListener(ev, unlock, { capture: true, passive: true });
  }

  // a short pitched blip that can slide from one frequency to another
  function tone(o) {
    const t0 = ctx.currentTime + (o.delay || 0);
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.from, t0);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + o.dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(o.gain, t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    osc.connect(gain);
    gain.connect(out);
    osc.start(t0);
    osc.stop(t0 + o.dur + 0.03);
  }

  // filtered noise sweeping up or down: a whoosh
  function whoosh(o) {
    const t0 = ctx.currentTime + (o.delay || 0);
    const length = Math.ceil(ctx.sampleRate * o.dur);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate), data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    src.buffer = buffer;
    filter.type = 'bandpass';
    filter.Q.value = 1.1;
    filter.frequency.setValueAtTime(o.from, t0);
    filter.frequency.exponentialRampToValueAtTime(o.to, t0 + o.dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(o.gain, t0 + o.dur * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(out);
    src.start(t0);
  }

  // C D E G A across two octaves: any run of these sounds like a tune
  const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];

  const SOUNDS = {
    hover: () => tone({ from: 1250, to: 1500, dur: 0.045, gain: 0.03 }),
    click: () => tone({ type: 'triangle', from: 620, to: 380, dur: 0.07, gain: 0.15 }),
    tab: () => {
      whoosh({ from: 900, to: 3600, dur: 0.16, gain: 0.05 });
      tone({ type: 'triangle', from: 392, to: 523, dur: 0.08, gain: 0.13 });
      tone({ from: 784, to: 1046, dur: 0.14, gain: 0.08, delay: 0.05 });
    },
    sub: () => tone({ type: 'triangle', from: 520, to: 700, dur: 0.07, gain: 0.12 }),
    open: () => {
      whoosh({ from: 500, to: 4200, dur: 0.22, gain: 0.07 });
      tone({ from: 330, to: 660, dur: 0.16, gain: 0.1 });
    },
    close: () => {
      whoosh({ from: 3200, to: 500, dur: 0.16, gain: 0.055 });
      tone({ from: 560, to: 280, dur: 0.12, gain: 0.09 });
    },
    next: () => tone({ type: 'triangle', from: 480, to: 640, dur: 0.06, gain: 0.1 }),
    success: () => [0, 2, 3, 5].forEach((n, i) => tone({ type: 'triangle', from: SCALE[n], dur: 0.17, gain: 0.1, delay: i * 0.07 })),
    note: i => tone({ type: 'triangle', from: SCALE[((i % SCALE.length) + SCALE.length) % SCALE.length], dur: 0.15, gain: 0.065 }),
  };

  function play(name, arg) {
    if (muted || !ctx || ctx.state !== 'running' || !SOUNDS[name]) return;
    const now = performance.now();
    if (now - (last[name] || 0) < 35) return;
    last[name] = now;
    try { SOUNDS[name](arg); } catch (err) { /* a sound must never break the page */ }
  }

  return {
    play,
    get muted() { return muted; },
    toggle() {
      muted = !muted;
      try { localStorage.setItem(KEY, muted ? '1' : '0'); } catch (err) { /* storage unavailable */ }
      if (!muted) { unlock(); play('success'); }
      return muted;
    },
  };
})();
