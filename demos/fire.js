/**
 * Fire — narrow concentrated flame with lots of floating embers
 * Heat buffer at pixelSize=4 (light) + embers at pixel-level (smooth)
 */

import { PixelArray } from '../src/pixelarray.js';

export function fire(canvas) {
  const px = new PixelArray(canvas, { pixelSize: 1 });
  const GRID = 4;
  const cols = Math.floor(px.w / GRID);
  const rows = Math.floor(px.h / GRID);

  const heat = new Float32Array(cols * rows);

  function idx(x, y) { return y * cols + x; }

  // Smooth 256-entry palette
  const palette = new Array(256);
  const stops = [
    [0, 0, 0, 0],
    [40, 15, 0, 0],
    [80, 70, 5, 0],
    [120, 170, 25, 0],
    [160, 225, 75, 0],
    [200, 255, 155, 15],
    [230, 255, 220, 70],
    [255, 255, 255, 190],
  ];
  for (let i = 0; i < 256; i++) {
    const t = i / 255 * (stops.length - 1);
    const lo = Math.floor(t);
    const hi = Math.min(lo + 1, stops.length - 1);
    const f = t - lo;
    palette[i] = [
      Math.floor(stops[lo][1] + (stops[hi][1] - stops[lo][1]) * f),
      Math.floor(stops[lo][2] + (stops[hi][2] - stops[lo][2]) * f),
      Math.floor(stops[lo][3] + (stops[hi][3] - stops[lo][3]) * f),
    ];
  }

  // Embers — pixel-level sparks
  const NUM_EMBERS = 200;
  const embers = [];
  for (let i = 0; i < NUM_EMBERS; i++) embers.push(makeEmber(true));

  function makeEmber(scatter) {
    return {
      x: px.w * 0.35 + Math.random() * px.w * 0.3,
      y: scatter ? px.h * 0.3 + Math.random() * px.h * 0.7 : px.h - 20 - Math.random() * 40,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(1.5 + Math.random() * 3),
      life: scatter ? Math.random() : 0.6 + Math.random() * 0.4,
      decay: 0.003 + Math.random() * 0.007,
      size: Math.random() < 0.3 ? 2 : 1,
    };
  }

  let wind = 0;

  px.run(() => {
    wind += (Math.random() - 0.5) * 0.008;
    wind *= 0.99;

    // Ignite bottom — narrow base (~30% of width)
    const fireLeft = Math.floor(cols * 0.35);
    const fireRight = Math.floor(cols * 0.65);
    for (let x = 0; x < cols; x++) {
      let intensity = 0;
      if (x >= fireLeft && x <= fireRight) {
        const center = Math.abs(x - cols / 2) / ((fireRight - fireLeft) / 2);
        intensity = Math.max(0, 1 - center * center);
      }
      heat[idx(x, rows - 1)] = (210 + Math.random() * 45) * intensity;
      heat[idx(x, rows - 2)] = (190 + Math.random() * 45) * intensity * 0.85;
      heat[idx(x, rows - 3)] = (120 + Math.random() * 45) * intensity * 0.5;
    }

    // Propagate
    for (let y = 0; y < rows - 3; y++) {
      for (let x = 1; x < cols - 1; x++) {
        const windOff = Math.round(wind * 2);
        const b  = heat[idx(x, y + 1)];
        const bl = heat[idx(Math.max(0, x - 1 + windOff), y + 1)];
        const br = heat[idx(Math.min(cols - 1, x + 1 + windOff), y + 1)];
        const b2 = y + 2 < rows ? heat[idx(x, y + 2)] : b;
        const b3 = y + 3 < rows ? heat[idx(x, y + 3)] : b;

        const avg = (b + bl + br + b2 + b3) / 5;
        const coolFactor = 0.6 + (1 - y / rows) * 0.5;
        heat[idx(x, y)] = Math.max(0, avg - coolFactor - Math.random() * 0.7);
      }
    }

    // Render heat grid
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const h = heat[idx(x, y)];
        const pi = Math.min(255, Math.floor(h));
        const c = palette[pi];
        px.rect(x * GRID, y * GRID, GRID, GRID, c[0], c[1], c[2]);
      }
    }

    // Embers — drawn at pixel level on top of the grid
    for (let i = 0; i < NUM_EMBERS; i++) {
      const e = embers[i];
      e.vx += (Math.random() - 0.5) * 0.2 + wind * 0.8;
      e.vy -= Math.random() * 0.03;
      e.vx *= 0.995;
      e.x += e.vx;
      e.y += e.vy;
      e.life -= e.decay;

      if (e.life <= 0 || e.y < -5 || e.x < 0 || e.x >= px.w) {
        embers[i] = makeEmber(false);
        continue;
      }

      const b = e.life;
      const r = 255;
      const g = Math.floor(180 * b + 40 * (1 - b));
      const bl = Math.floor(40 * b);
      if (e.size > 1) {
        px.rect(Math.floor(e.x), Math.floor(e.y), 2, 2, r, g, bl, b * 0.8);
      } else {
        px.dot(Math.floor(e.x), Math.floor(e.y), r, g, bl, b * 0.9);
      }
      // Tiny glow around bright embers
      if (b > 0.6) {
        px.dot(Math.floor(e.x - 1), Math.floor(e.y), r, g, bl, b * 0.15);
        px.dot(Math.floor(e.x + 1), Math.floor(e.y), r, g, bl, 0.15);
        px.dot(Math.floor(e.x), Math.floor(e.y - 1), r, g, bl, b * 0.1);
      }
    }
  });

  return px;
}
