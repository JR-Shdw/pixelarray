/**
 * Rhorizon black hole — Resurgamus Horizon brand skin (full-screen hero).
 *
 * Accretion disk + event horizon + photon ring + continuous cyan jets.
 *
 * Morphable: pass opts.view = { x, y, scale, morph } and mutate it over time.
 * The black hole is simulated in fixed "unit" space and only its DRAWING is
 * placed at (x, y) and multiplied by `scale` — i.e. the geometry shrinks while
 * the pixels stay full size (crisp at any scale, no bitmap blur). `morph` 0->1
 * lerps the palette from the hero look (magenta #D946EF / cyan #22D3EE) to the
 * app side-panel look (violet #7C3AED / cyan #06B6D4), so the hero morphs
 * smoothly down into the real sidebar badge.
 *
 * 100% pixelarray dot() API; the event horizon uses one radial-gradient fill.
 */

import { PixelArray } from '../src/pixelarray.js';

const MAGENTA   = [217, 70, 239];   // #D946EF hero accretion
const CYAN      = [34, 211, 238];   // #22D3EE hero jets
const VIOLET    = [124, 58, 237];   // #7C3AED side-panel accretion
const SIDE_CYAN = [6, 182, 212];    // #06B6D4 side-panel jets
const WHITE     = [248, 250, 252];  // #F8FAFC core / stars

const lerp = (a, b, t) => a + (b - a) * t;
const lerp3 = (A, B, t) => [lerp(A[0], B[0], t) | 0, lerp(A[1], B[1], t) | 0, lerp(A[2], B[2], t) | 0];

export function rhorizonBlackhole(canvas, opts = {}) {
  const fullscreen = opts.fullscreen !== false;
  const px = new PixelArray(canvas, { pixelSize: opts.pixelSize || 2 });
  const view = opts.view || {};   // { x, y, scale, morph }; mutated by caller

  let cx, cy, NUM, particles, stars, jets, jetLen, ehRx, ehRy;

  function fit() {
    if (fullscreen) px.resize(window.innerWidth, window.innerHeight);
    cx = px.w / 2;
    cy = px.h / 2;
    jetLen = Math.min(cx, cy) * 1.55;
    ehRx = Math.max(12, Math.min(cx, cy) * 0.10);   // unit-space horizon radii
    ehRy = ehRx * 0.35;
  }

  function spawn() {
    return {
      angle: Math.random() * Math.PI * 2,
      dist: 24 + Math.random() * Math.min(cx, cy) * 0.95,
      speed: 0.004 + Math.random() * 0.012,
      decay: 0.992 + Math.random() * 0.006,
      brightness: 130 + Math.random() * 125,
      temp: Math.random(),
    };
  }

  function spawnJet(side, atBase) {
    const knot = Math.random() < 0.05;
    return {
      side,
      s: atBase ? Math.random() * 8 : Math.random() * jetLen,
      speed: 0.7 + Math.random() * 0.5,
      accel: 1.005 + Math.random() * 0.004,
      amp: 1.5 + Math.random() * 4,
      freq: 0.5 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.025,
      size: knot ? 2 : 1,
      bright: knot ? 1 : 0.5 + Math.random() * 0.4,
    };
  }

  function build() {
    fit();
    NUM = Math.min(3000, Math.max(900, Math.floor((px.w * px.h) / 700)));
    particles = [];
    for (let i = 0; i < NUM; i++) particles.push(spawn());
    jets = [];
    const NJETS = Math.floor(Math.min(cx, cy) * 2.6);
    for (let i = 0; i < NJETS; i++) jets.push(spawnJet(i % 2 ? 1 : -1, false));
    stars = [];
    const NSTARS = Math.floor((px.w * px.h) / 5200);
    for (let i = 0; i < NSTARS; i++) {
      const cyanish = Math.random() < 0.25;
      stars.push({
        x: Math.random() * px.w, y: Math.random() * px.h,
        sr: cyanish ? CYAN[0] : WHITE[0],
        sg: cyanish ? CYAN[1] : WHITE[1],
        sb: cyanish ? CYAN[2] : WHITE[2],
        bright: 12 + Math.floor(Math.random() * 48),
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  build();
  window.addEventListener('resize', build);

  function diskColor(ratio, temp, mag) {
    if (ratio < 0.18) {
      const t = ratio / 0.18;
      return [
        Math.floor(WHITE[0] - (WHITE[0] - mag[0]) * t),
        Math.floor(WHITE[1] - (WHITE[1] - mag[1]) * t),
        Math.floor(WHITE[2] - (WHITE[2] - mag[2]) * t * 0.4),
      ];
    }
    if (ratio < 0.55) {
      const t = (ratio - 0.18) / 0.37;
      return [Math.floor(mag[0] - 30 * t + temp * 30), Math.floor(mag[1] + 10 * t), Math.floor(mag[2] - 50 * t)];
    }
    const t = Math.min(1, (ratio - 0.55) / 0.45);
    return [Math.floor(mag[0] * 0.7 * (1 - t * 0.7)), Math.floor(mag[1] * 0.6 * (1 - t * 0.5) + 10), Math.floor(mag[2] * 0.75 * (1 - t * 0.55))];
  }

  let time = 0;

  px.run(() => {
    const ctx = px.ctx;
    const ws = view.scale == null ? 1 : view.scale;          // world (geometry) scale
    const vx = view.x == null ? cx : view.x;                 // draw centre
    const vy = view.y == null ? cy : view.y;
    const morph = view.morph || 0;
    const collapse = view.collapse || 0;     // 0..1 implosion into the core
    const vis = 1 - collapse;
    const mag = lerp3(MAGENTA, VIOLET, morph);
    const jcy = lerp3(CYAN, SIDE_CYAN, morph);

    px.fade(10, 10, 15, 0.06);
    time += 0.016;

    // Stars — full-screen field, fade out as we morph to the corner badge
    const starF = 1 - morph;
    if (starF > 0.01) {
      for (const s of stars) {
        const f = (0.35 + Math.sin(s.phase + time * 1.5) * 0.35) * starF;
        px.dot(s.x, s.y, Math.floor(s.sr * f), Math.floor(s.sg * f), Math.floor(s.sb * f));
      }
    }

    // Accretion glow rings (geometry * ws, centred at vx,vy)
    for (let ring = 0; ring < 3; ring++) {
      const baseD = 30 + ring * 22;
      const alpha = (0.05 - ring * 0.012) * vis;
      for (let a = 0; a < Math.PI * 2; a += 0.014) {
        const d = (baseD + Math.sin(a * 4 + time + ring) * 5) * ws;
        px.dot((vx + Math.cos(a) * d) | 0, (vy + Math.sin(a) * d * 0.35) | 0,
          mag[0] - ring * 25, 50 + ring * 10, mag[2] - ring * 20, alpha);
      }
    }

    // Accretion particles (Keplerian) — simulated in units, drawn * ws
    for (let i = 0; i < NUM; i++) {
      const p = particles[i];
      const speedMult = 1 + (90 / (p.dist + 16));
      p.angle += p.speed * speedMult * (1 + collapse * 2);    // spin up as it implodes
      p.dist *= p.decay;
      if (collapse > 0) p.dist -= p.dist * 0.45 * collapse;    // rush into the core
      if (p.dist < 4) { if (collapse < 0.3) particles[i] = spawn(); continue; }
      const x = vx + Math.cos(p.angle) * p.dist * ws;
      const y = vy + Math.sin(p.angle) * p.dist * 0.35 * ws;
      if (x < -5 || x > px.w + 5 || y < -5 || y > px.h + 5) { particles[i] = spawn(); continue; }
      const ratio = Math.min(p.dist / Math.max(120, Math.min(cx, cy) * 0.6), 1);
      const [r, g, b] = diskColor(ratio, p.temp, mag);
      const bright = p.brightness / 255;
      const alpha = Math.min(0.85, ratio * 0.5 + 0.35) * vis;
      px.dot(x | 0, y | 0, Math.floor(r * bright), Math.floor(g * bright), Math.floor(b * bright), alpha);
      if (ratio < 0.5) {
        const pa = p.angle - p.speed * speedMult * 1.5;
        px.dot((vx + Math.cos(pa) * (p.dist + 1.5) * ws) | 0, (vy + Math.sin(pa) * (p.dist + 1.5) * 0.35 * ws) | 0,
          Math.floor(r * 0.35), Math.floor(g * 0.35), Math.floor(b * 0.4), 0.12 * vis);
      }
    }

    // Jets — continuous cyan plasma flow, both poles (geometry * ws)
    const sway = Math.sin(time * 0.5) * 7;
    for (let i = 0; i < jets.length; i++) {
      const j = jets[i];
      j.s += j.speed;
      j.speed *= j.accel;
      const prog = j.s / jetLen;
      if (prog >= 1) { jets[i] = spawnJet(j.side, true); continue; }
      const widen = 1 + prog * 3.2;
      const lat =
        Math.sin(j.s * 0.035 * j.freq + j.phase + time * 1.4) * j.amp * widen +
        Math.sin(j.s * 0.012 + j.phase * 1.7) * j.amp * 0.5 * widen +
        j.drift * j.s + sway * prog;
      const x = vx + lat * ws;
      const y = vy + j.side * (14 + j.s) * ws * (1 - collapse * 0.7);   // retract on collapse
      const t = Math.min(1, prog * 2.2);
      const r = Math.floor(225 - (225 - jcy[0]) * t);
      const g = Math.floor(248 - (248 - jcy[1]) * t);
      const bl = Math.floor(255 - (255 - jcy[2]) * t);
      const a = Math.max(0, j.bright * (1 - prog) * (1 - prog)) * vis;
      px.dot(x | 0, y | 0, r, g, bl, a);
      if (j.size > 1) px.dot(x | 0, (y + j.side) | 0, r, g, bl, a * 0.7);
      px.dot((x + (lat > 0 ? 1 : -1)) | 0, y | 0, jcy[0], jcy[1], jcy[2], a * 0.28);
    }

    // Event horizon — one elliptical radial-gradient fill (soft edge, crisp, cheap)
    const hrx = ehRx * ws, hry = ehRy * ws;
    ctx.save();
    ctx.translate(vx, vy);
    ctx.scale(1, hry / hrx);
    const grd = ctx.createRadialGradient(0, 0, hrx * 0.55, 0, 0, hrx * 1.45);
    grd.addColorStop(0, 'rgba(0,0,0,1)');
    grd.addColorStop(0.62, 'rgba(0,0,0,1)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, hrx * 1.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Photon ring — hugging the horizon
    for (let a = 0; a < Math.PI * 2; a += 0.025) {
      const pulse = (0.22 + Math.sin(time * 3 + a * 5) * 0.12) * vis;
      px.dot((vx + Math.cos(a) * (ehRx + 3) * ws) | 0, (vy + Math.sin(a) * (ehRy + 2) * ws) | 0,
        lerp(255, mag[0], morph) | 0, lerp(180, mag[1], morph) | 0, lerp(250, mag[2], morph) | 0, pulse);
      px.dot((vx + Math.cos(a) * (ehRx + 5) * ws) | 0, (vy + Math.sin(a) * (ehRy + 3) * ws) | 0,
        mag[0], 90, mag[2], pulse * 0.3);
    }
  });

  return px;
}
