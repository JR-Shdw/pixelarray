/**
 * Black hole — accretion disk, photon ring, relativistic jets
 * 100% pixelarray API — every pixel is a px.dot()
 */

import { PixelArray } from '../src/pixelarray.js';

export function blackhole(canvas) {
  const px = new PixelArray(canvas, { pixelSize: 1 });
  const cx = px.w / 2, cy = px.h / 2;
  const NUM = 1200;
  const particles = [];

  function spawn() {
    const angle = Math.random() * Math.PI * 2;
    const maxDist = Math.min(cx, cy) * 0.9;
    const dist = 20 + Math.random() * maxDist;
    return {
      angle,
      dist,
      speed: 0.004 + Math.random() * 0.012,
      decay: 0.993 + Math.random() * 0.005,
      brightness: 120 + Math.random() * 135,
      temp: Math.random(),
    };
  }

  for (let i = 0; i < NUM; i++) particles.push(spawn());

  // Background stars
  const stars = [];
  for (let i = 0; i < 300; i++) {
    const t = Math.random();
    let sr, sg, sb;
    if (t < 0.2) { sr = 130; sg = 150; sb = 255; }
    else if (t < 0.7) { sr = 220; sg = 220; sb = 230; }
    else { sr = 255; sg = 220; sb = 170; }
    stars.push({
      x: Math.random() * px.w,
      y: Math.random() * px.h,
      sr, sg, sb,
      bright: 15 + Math.floor(Math.random() * 50),
      phase: Math.random() * Math.PI * 2,
    });
  }

  let time = 0;

  px.run(() => {
    px.fade(0, 0, 0, 0.05);
    time += 0.016;

    // Stars
    for (const s of stars) {
      const f = 0.3 + Math.sin(s.phase + time * 1.5) * 0.3;
      px.dot(s.x, s.y,
        Math.floor(s.sr * f), Math.floor(s.sg * f), Math.floor(s.sb * f));
    }

    // Accretion disk glow — multiple elliptical rings
    for (let ring = 0; ring < 3; ring++) {
      const baseD = 25 + ring * 18;
      const alpha = 0.04 - ring * 0.01;
      for (let a = 0; a < Math.PI * 2; a += 0.015) {
        const d = baseD + Math.sin(a * 4 + time + ring) * 4;
        const x = cx + Math.cos(a) * d;
        const y = cy + Math.sin(a) * d * 0.35;
        // Inner rings hotter (blue-white), outer cooler (blue-purple)
        const rr = 40 + ring * 20;
        const gg = 60 + ring * 15;
        const bb = 160 - ring * 20;
        px.dot(Math.floor(x), Math.floor(y), rr, gg, bb, alpha);
      }
    }

    // Particles
    for (let i = 0; i < NUM; i++) {
      const p = particles[i];

      // Kepler: faster when closer
      const speedMult = 1 + (80 / (p.dist + 15));
      p.angle += p.speed * speedMult;
      p.dist *= p.decay;

      const x = cx + Math.cos(p.angle) * p.dist;
      const y = cy + Math.sin(p.angle) * p.dist * 0.35;

      // Consumed or off screen
      if (p.dist < 3 || x < -5 || x > px.w + 5 || y < -5 || y > px.h + 5) {
        particles[i] = spawn();
        continue;
      }

      const ratio = Math.min(p.dist / 100, 1);

      // Thermal palette: blue-white (inner) → blue → purple-dim (outer)
      let r, g, b;
      if (ratio < 0.2) {
        // Very inner: bright white-blue
        r = Math.floor(200 + 55 * (1 - ratio * 5));
        g = Math.floor(210 + 45 * (1 - ratio * 5));
        b = 255;
      } else if (ratio < 0.45) {
        // Inner disk: blue
        const t = (ratio - 0.2) / 0.25;
        r = Math.floor(120 - 40 * t + p.temp * 60);
        g = Math.floor(150 - 30 * t);
        b = Math.floor(255 - 50 * t);
      } else if (ratio < 0.7) {
        // Mid: blue-purple
        const t = (ratio - 0.45) / 0.25;
        r = Math.floor(80 + 40 * p.temp - 20 * t);
        g = Math.floor(70 - 30 * t);
        b = Math.floor(180 - 60 * t);
      } else {
        // Outer: dim, almost gone
        const t = (ratio - 0.7) / 0.3;
        r = Math.floor(50 * (1 - t * 0.6));
        g = Math.floor(35 * (1 - t * 0.7));
        b = Math.floor(90 * (1 - t * 0.4));
      }

      const bright = p.brightness / 255;
      const alpha = Math.min(0.85, ratio * 0.5 + 0.35);
      px.dot(Math.floor(x), Math.floor(y),
        Math.floor(r * bright), Math.floor(g * bright), Math.floor(b * bright), alpha);

      // Trail — ghost behind the particle
      if (ratio < 0.5) {
        const prevAngle = p.angle - p.speed * speedMult * 1.5;
        const tx = cx + Math.cos(prevAngle) * (p.dist + 1.5);
        const ty = cy + Math.sin(prevAngle) * (p.dist + 1.5) * 0.35;
        px.dot(Math.floor(tx), Math.floor(ty),
          Math.floor(r * 0.35), Math.floor(g * 0.35), Math.floor(b * 0.4), 0.12);
      }
    }

    // Event horizon — elliptical, matching disk perspective
    const ehRx = 12;
    const ehRy = Math.floor(ehRx * 0.35);
    const fadeZone = 6;
    for (let dy = -(ehRy + fadeZone); dy <= ehRy + fadeZone; dy++) {
      for (let dx = -(ehRx + fadeZone); dx <= ehRx + fadeZone; dx++) {
        // Elliptical distance
        const ed = Math.sqrt((dx / ehRx) * (dx / ehRx) + (dy / ehRy) * (dy / ehRy));
        if (ed <= 1) {
          px.dot(cx + dx, cy + dy, 0, 0, 0);
        } else if (ed <= 1 + fadeZone / ehRx) {
          const fade = 1 - (ed - 1) / (fadeZone / ehRx);
          px.dot(cx + dx, cy + dy, 0, 0, 0, fade * fade * 0.9);
        }
      }
    }

    // Photon ring — elliptical, hugging the event horizon
    for (let a = 0; a < Math.PI * 2; a += 0.03) {
      const ringRx = ehRx + 3;
      const ringRy = ehRy + 2;
      const rx = cx + Math.cos(a) * ringRx;
      const ry = cy + Math.sin(a) * ringRy;
      const pulse = 0.18 + Math.sin(time * 3 + a * 5) * 0.1;
      px.dot(Math.floor(rx), Math.floor(ry), 140, 175, 255, pulse);
      // Outer glow
      const rx2 = cx + Math.cos(a) * (ringRx + 2);
      const ry2 = cy + Math.sin(a) * (ringRy + 1);
      px.dot(Math.floor(rx2), Math.floor(ry2), 70, 110, 210, pulse * 0.3);
    }

    // Relativistic jets — narrow beams top and bottom
    for (let j = 0; j < 25; j++) {
      const spread = 1 + j * 0.15;
      // Top jet
      const jy = cy - 6 - j * 3 - Math.random() * 2;
      const jx = cx + (Math.random() - 0.5) * spread;
      const ja = Math.max(0, 0.1 - j * 0.003);
      px.dot(Math.floor(jx), Math.floor(jy), 90, 120, 255, ja);
      // Bottom jet
      const jy2 = cy + 6 + j * 3 + Math.random() * 2;
      const jx2 = cx + (Math.random() - 0.5) * spread;
      px.dot(Math.floor(jx2), Math.floor(jy2), 90, 120, 255, ja);
    }
  });

  return px;
}
