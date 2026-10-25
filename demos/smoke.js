// SPDX-License-Identifier: MIT
/**
 * Smoke — wispy rising volutes escaping from fire
 * Starts slow near flames, accelerates upward, curls and dissipates
 */

import { PixelArray } from '../src/pixelarray.js';

export function smoke(canvas) {
  const px = new PixelArray(canvas, { pixelSize: 1 });
  const NUM = 600;
  const particles = [];
  const emitX = px.w / 2;
  const fireTop = px.h - 50; // smoke starts above the fire zone

  function spawn(scatter) {
    const xOff = (Math.random() - 0.5) * 14;
    return {
      x: emitX + xOff,
      y: scatter ? px.h * 0.1 + Math.random() * px.h * 0.9 : fireTop + Math.random() * 10,
      vx: xOff * 0.005,
      // Start very slow — creeping out of the fire
      vy: -(0.1 + Math.random() * 0.2),
      life: scatter ? Math.random() : 1,
      decay: 0.0005 + Math.random() * 0.001,
      size: 2 + Math.floor(Math.random() * 3),
      growRate: 0.015 + Math.random() * 0.02,
      curlDir: Math.random() < 0.5 ? 1 : -1,
      curlSpeed: 0.3 + Math.random() * 0.5,
      curlPhase: Math.random() * Math.PI * 2,
      tone: 55 + Math.floor(Math.random() * 35),
    };
  }

  for (let i = 0; i < NUM; i++) particles.push(spawn(true));

  let time = 0;
  let wind = 0;
  let windTarget = 0;

  px.run(() => {
    px.fade(0, 0, 0, 0.035);
    time += 0.016;

    // Very gentle wind — shifts every ~10s
    if (Math.random() < 0.002) windTarget = (Math.random() - 0.5) * 0.15;
    wind += (windTarget - wind) * 0.001;

    for (let i = 0; i < NUM; i++) {
      const p = particles[i];
      const age = 1 - p.life;
      const h = Math.max(0, 1 - p.y / px.h);

      // Fast near fire (thermal draft), decelerates higher up (cooling)
      if (h < 0.3) {
        // Near fire — strong upward pull
        p.vy -= 0.005;
      } else {
        // Higher — air cools, smoke slows down and spreads
        p.vy *= 0.998;
        p.vy -= 0.001;
      }
      if (p.vy < -1.8) p.vy = -1.8;

      // Wind — only affects smoke above the fire, stronger higher up
      p.vx += wind * h * h;

      // Curling — tighter low, wider high
      const curlRadius = h * h * 0.8;
      const curlAngle = time * p.curlSpeed + p.curlPhase + p.y * 0.01;
      p.vx += Math.sin(curlAngle) * curlRadius * p.curlDir * 0.015;
      const pullToCenter = (emitX - p.x) * 0.0003 * (1 - h);
      p.vx += pullToCenter;
      p.vx *= 0.99;

      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      const curSize = Math.floor(p.size + p.size * p.growRate * age * 80);

      if (p.life <= 0 || p.y < -curSize) {
        particles[i] = spawn(false);
        continue;
      }

      const alpha = p.life * 0.3 * (1 - h * 0.25);

      const t = p.tone;
      const r = t + Math.floor(h * 6);
      const g = t + Math.floor(h * 3);
      const b = t + Math.floor(h * 10);

      const half = Math.floor(curSize / 2);
      px.rect(Math.floor(p.x - half), Math.floor(p.y - half),
        curSize, curSize, r, g, b, alpha);
      if (curSize > 3) {
        const drift = Math.sin(curlAngle * 2) * 2;
        px.rect(Math.floor(p.x - half + drift), Math.floor(p.y - half - 1),
          curSize, 2, r, g, b, alpha * 0.2);
        px.rect(Math.floor(p.x - half - drift), Math.floor(p.y + half - 1),
          curSize, 2, r, g, b, alpha * 0.2);
      }
    }

    // Fire — bigger, more visible
    // Core flames
    for (let i = 0; i < 40; i++) {
      const gx = emitX + (Math.random() - 0.5) * 30;
      const gy = px.h - 1 - Math.random() * 45;
      const distFromCenter = Math.abs(gx - emitX) / 15;
      const heightInFire = (px.h - gy) / 45;
      const fi = Math.max(0, 1 - distFromCenter) * (1 - heightInFire * 0.5);

      if (heightInFire < 0.3) {
        // Base — bright yellow-white
        px.dot(gx, gy, 255, Math.floor(240 * fi), Math.floor(150 * fi), fi * 0.5);
      } else if (heightInFire < 0.6) {
        // Mid — orange
        px.dot(gx, gy, 255, Math.floor(160 * fi), Math.floor(30 * fi), fi * 0.4);
      } else {
        // Tips — red-dark
        px.dot(gx, gy, Math.floor(200 * fi), Math.floor(60 * fi), 5, fi * 0.3);
      }
    }
    // Hot embers floating up from fire into smoke
    for (let i = 0; i < 5; i++) {
      const ex = emitX + (Math.random() - 0.5) * 20;
      const ey = fireTop - Math.random() * 30;
      px.dot(ex, ey, 255, Math.floor(180 * Math.random()), 30, 0.15 + Math.random() * 0.15);
    }
  });

  return px;
}
