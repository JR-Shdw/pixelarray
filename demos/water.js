// SPDX-License-Identifier: MIT
/**
 * Water — ripple propagation + caustic light + foam
 * pixelSize=2 for ~22k cells (smooth enough, fast enough)
 */

import { PixelArray } from '../src/pixelarray.js';

export function water(canvas) {
  const px = new PixelArray(canvas, { pixelSize: 4 });
  const cols = Math.floor(px.w / px.ps);
  const rows = Math.floor(px.h / px.ps);
  const size = cols * rows;

  let buf1 = new Float32Array(size);
  let buf2 = new Float32Array(size);
  const damping = 0.965;

  function idx(x, y) { return y * cols + x; }

  function drop(cx, cy, strength) {
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 1 || nx >= cols - 1 || ny < 1 || ny >= rows - 1) continue;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= 3) buf1[idx(nx, ny)] += strength * (1 - dist / 3);
      }
    }
  }

  // Initial drops
  for (let i = 0; i < 4; i++) {
    drop(
      5 + Math.floor(Math.random() * (cols - 10)),
      5 + Math.floor(Math.random() * (rows - 10)),
      200
    );
  }

  let time = 0;

  px.run(() => {
    time += 0.016;

    // Raindrops
    if (Math.random() < 0.05) {
      drop(
        3 + Math.floor(Math.random() * (cols - 6)),
        3 + Math.floor(Math.random() * (rows - 6)),
        130 + Math.random() * 120
      );
    }

    // Propagate
    for (let y = 1; y < rows - 1; y++) {
      for (let x = 1; x < cols - 1; x++) {
        const i = idx(x, y);
        buf2[i] = (
          buf1[idx(x - 1, y)] + buf1[idx(x + 1, y)] +
          buf1[idx(x, y - 1)] + buf1[idx(x, y + 1)]
        ) / 2 - buf2[i];
        buf2[i] *= damping;
      }
    }

    // Render with refraction-based lighting
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = idx(x, y);
        const v = buf2[i];

        // Compute gradient (surface normal approximation)
        const dx = (x > 0 && x < cols - 1)
          ? buf2[idx(x + 1, y)] - buf2[idx(x - 1, y)] : 0;
        const dy = (y > 0 && y < rows - 1)
          ? buf2[idx(x, y + 1)] - buf2[idx(x, y - 1)] : 0;

        // Base ocean color with depth gradient
        const depthRatio = y / rows;
        const baseR = 5 + depthRatio * 8;
        const baseG = 20 + depthRatio * 15;
        const baseB = 60 + depthRatio * 30 + Math.sin(y * 0.1) * 5;

        // Caustic light pattern (subtle moving pattern on floor)
        const caustic = Math.sin(x * 0.3 + time * 1.5) *
                        Math.cos(y * 0.25 + time * 1.2) *
                        Math.sin((x + y) * 0.15 + time * 0.8);
        const causticLight = Math.max(0, caustic) * 15 * depthRatio;

        // Refraction highlight from gradient
        const highlight = (dx * 0.7 + dy * 0.3) * 3;

        let r = baseR + causticLight + Math.max(0, highlight * 25);
        let g = baseG + causticLight * 1.5 + Math.max(0, highlight * 35);
        let b = baseB + causticLight * 0.8 + Math.max(0, highlight * 20);

        // Specular — bright white on crests
        const specular = Math.max(0, dx * 0.8 - dy * 0.6);
        if (specular > 8) {
          const spec = Math.min(1, (specular - 8) / 15);
          r += spec * 200;
          g += spec * 220;
          b += spec * 210;
        }

        // Foam on high waves
        if (Math.abs(v) > 30) {
          const foam = Math.min(1, (Math.abs(v) - 30) / 30);
          r += foam * 120;
          g += foam * 140;
          b += foam * 130;
        }

        px.rect(x * px.ps, y * px.ps, px.ps, px.ps,
          Math.max(0, Math.min(255, Math.floor(r))),
          Math.max(0, Math.min(255, Math.floor(g))),
          Math.max(0, Math.min(255, Math.floor(b)))
        );
      }
    }

    // Swap
    const tmp = buf1;
    buf1 = buf2;
    buf2 = tmp;
  });

  return px;
}
