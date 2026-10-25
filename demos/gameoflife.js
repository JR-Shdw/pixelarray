// SPDX-License-Identifier: MIT
/**
 * Game of Life — Conway's cellular automaton, optimized
 * No more setInterval, no globals, typed arrays
 */

import { PixelArray } from '../src/pixelarray.js';

export function gameoflife(canvas) {
  const px = new PixelArray(canvas, { pixelSize: 3 });
  const cols = Math.floor(px.w / px.ps);
  const rows = Math.floor(px.h / px.ps);
  const size = cols * rows;

  let grid = new Uint8Array(size);
  let next = new Uint8Array(size);

  function idx(x, y) { return y * cols + x; }

  // Random seed — ~30% density
  for (let i = 0; i < size; i++) {
    grid[i] = Math.random() < 0.3 ? 1 : 0;
  }

  // Color palette: new cells bright green, old cells dim
  const ages = new Uint16Array(size);

  px.run(() => {
    // Compute next generation
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Count neighbors (toroidal wrap)
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = (x + dx + cols) % cols;
            const ny = (y + dy + rows) % rows;
            n += grid[idx(nx, ny)];
          }
        }

        const i = idx(x, y);
        const alive = grid[i];

        if (alive) {
          next[i] = (n === 2 || n === 3) ? 1 : 0;
        } else {
          next[i] = (n === 3) ? 1 : 0;
        }

        // Track age
        if (next[i]) {
          ages[i] = alive ? Math.min(ages[i] + 1, 500) : 0;
        }
      }
    }

    // Render
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = idx(x, y);
        const sx = x * px.ps;
        const sy = y * px.ps;

        if (next[i]) {
          const age = ages[i];
          // New: bright cyan → old: dim green
          const r = Math.max(0, 30 - age);
          const g = Math.max(60, 220 - age);
          const b = Math.max(30, 180 - age * 2);
          px.rect(sx, sy, px.ps, px.ps, r, g, b);
        } else {
          // Dead: very dark
          px.rect(sx, sy, px.ps, px.ps, 5, 5, 8);
        }
      }
    }

    // Swap
    const tmp = grid;
    grid = next;
    next = tmp;

    // Inject random cells if population is low (prevents stagnation)
    let pop = 0;
    for (let i = 0; i < size; i++) pop += grid[i];
    if (pop < size * 0.05) {
      for (let i = 0; i < size * 0.1; i++) {
        grid[Math.floor(Math.random() * size)] = 1;
      }
    }
  });

  return px;
}
