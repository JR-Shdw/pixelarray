// SPDX-License-Identifier: MIT
/**
 * Matrix rain — grid-based for performance, proper fade to black
 */

import { PixelArray } from '../src/pixelarray.js';

export function matrix(canvas) {
  const px = new PixelArray(canvas, { pixelSize: 1 });
  const CELL = 3;
  const cols = Math.floor(px.w / CELL);
  const rows = Math.floor(px.h / CELL);

  // Brightness grid — much smaller than pixel buffer
  const grid = new Float32Array(cols * rows);
  function gIdx(x, y) { return y * cols + x; }

  const SPACING = 2; // columns apart in grid units
  const numCols = Math.floor(cols / SPACING);
  const drops = [];

  for (let i = 0; i < numCols; i++) {
    const count = 1 + Math.floor(Math.random() * 2);
    for (let j = 0; j < count; j++) {
      drops.push(makeDrop(i, true));
    }
  }

  function makeDrop(col, scatter) {
    const layer = Math.random();
    return {
      gx: col * SPACING + Math.floor(Math.random() * 2),
      y: scatter ? Math.random() * -rows * 2 : -(Math.random() * 40),
      speed: 0.08 + layer * layer * 1.8,
      len: 8 + Math.floor(Math.random() * 18),
      layer,
      col,
      chars: Array.from({ length: 30 }, () => 0.15 + Math.random() * 0.85),
      flickerTimer: Math.floor(Math.random() * 20),
    };
  }

  px.run(() => {
    // Decay grid
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] > 0) {
        grid[i] *= 0.985;
        if (grid[i] < 1) grid[i] = 0;
      }
    }

    // Update drops
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      d.y += d.speed;
      d.flickerTimer++;

      if (d.flickerTimer > 15) {
        d.flickerTimer = 0;
        d.chars[Math.floor(Math.random() * d.len)] = 0.15 + Math.random() * 0.85;
      }

      for (let j = 0; j < d.len; j++) {
        const gy = Math.floor(d.y - j);
        if (gy < 0 || gy >= rows || d.gx < 0 || d.gx >= cols) continue;

        const fade = 1 - j / d.len;
        const bright = d.chars[j] * fade;
        const depth = 0.35 + d.layer * 0.65;
        const val = bright * depth * 255;

        const gi = gIdx(d.gx, gy);
        if (j === 0) {
          grid[gi] = Math.min(255, val + 120);
        } else {
          grid[gi] = Math.max(grid[gi], val);
        }
      }

      if (d.y - d.len > rows) {
        drops[i] = makeDrop(d.col, false);
      }
    }

    // Render grid
    px.fill(0, 0, 0);
    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const v = grid[gIdx(gx, gy)];
        if (v < 2) continue;
        const g = Math.min(255, Math.floor(v));
        const r = Math.floor(g * 0.07);
        const b = Math.floor(g * 0.03);
        px.rect(gx * CELL, gy * CELL, CELL, CELL, r, g, b);
      }
    }
  });

  return px;
}
