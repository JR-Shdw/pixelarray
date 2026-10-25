// SPDX-License-Identifier: MIT
/**
 * Dust — thick billowing plume, opaque cloud buildup
 * Rectangular puffs that overlap into a dense mass
 */

import { PixelArray } from '../src/pixelarray.js';

export function dust(canvas) {
  const px = new PixelArray(canvas, { pixelSize: 1 });
  const NUM = 1000;
  const particles = [];
  const emitX = px.w / 2;

  function spawn(scatter) {
    const w = 4 + Math.floor(Math.random() * 6);
    const h = 3 + Math.floor(Math.random() * 4);
    return {
      x: emitX + (Math.random() - 0.5) * 14,
      y: scatter ? px.h * 0.15 + Math.random() * px.h * 0.85 : px.h + Math.random() * 4,
      vx: 0,
      vy: -(0.35 + Math.random() * 0.55),
      life: scatter ? Math.random() : 1,
      decay: 0.0005 + Math.random() * 0.0012,
      w, h,
      growW: 12 + Math.floor(Math.random() * 14),
      growH: 6 + Math.floor(Math.random() * 8),
      phase: Math.random() * Math.PI * 2,
      tone: 45 + Math.floor(Math.random() * 45),
    };
  }

  for (let i = 0; i < NUM; i++) particles.push(spawn(true));

  let time = 0;
  let wind = 0;
  let windTarget = 0;

  px.run(() => {
    // Full clear each frame — no trails, no tails
    px.fill(0, 0, 0);
    time += 0.016;

    if (Math.random() < 0.004) windTarget = (Math.random() - 0.5) * 0.25;
    wind += (windTarget - wind) * 0.002;

    // Sort by Y so lower (newer) particles draw on top
    particles.sort((a, b) => a.y - b.y);

    for (let i = 0; i < NUM; i++) {
      const p = particles[i];
      const age = 1 - p.life;
      const heightRatio = Math.max(0, 1 - p.y / px.h);

      // Slow curl — volute rolling
      const curl = Math.sin(time * 0.25 + p.phase + p.y * 0.004) * heightRatio * 0.04;
      p.vx += curl + wind * 0.004;
      p.vx *= 0.98;

      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      // Puffs expand as they rise — wider than tall (cloud shape)
      const curW = Math.floor(p.w + p.growW * age * age);
      const curH = Math.floor(p.h + p.growH * age * age);

      if (p.life <= 0 || p.y < -curH * 2) {
        particles[i] = spawn(false);
        continue;
      }

      // Thick opacity — the whole point is blocking the view
      const alpha = Math.min(0.6, p.life * 0.55) * (1 - heightRatio * 0.3);

      const t = p.tone;
      const r = t + Math.floor(heightRatio * 8);
      const g = t + Math.floor(heightRatio * 4);
      const b = t + Math.floor(heightRatio * 12);

      // Draw as wide soft rectangle — wider than tall = cloud puff
      // Core (full opacity)
      const coreW = Math.floor(curW * 0.6);
      const coreH = Math.floor(curH * 0.6);
      const ox = Math.floor(p.x - curW / 2);
      const oy = Math.floor(p.y - curH / 2);
      px.rect(ox + (curW - coreW) / 2, oy + (curH - coreH) / 2,
        coreW, coreH, r, g, b, alpha);
      // Outer edge (softer)
      px.rect(ox, oy, curW, curH, r, g, b, alpha * 0.35);
    }

    // Fire glow at base
    for (let i = 0; i < 15; i++) {
      const gx = emitX + (Math.random() - 0.5) * 16;
      const gy = px.h - 1 - Math.random() * 10;
      const fi = Math.random();
      px.dot(gx, gy,
        Math.floor(255 * fi), Math.floor(130 * fi), Math.floor(25 * fi),
        0.2 + fi * 0.15);
    }
  });

  return px;
}
