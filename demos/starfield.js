// SPDX-License-Identifier: MIT
/**
 * Starfield — 3D perspective stars rushing toward camera
 */

import { PixelArray } from '../src/pixelarray.js';

export function starfield(canvas) {
  const px = new PixelArray(canvas, { pixelSize: 1 });
  const cx = px.w / 2, cy = px.h / 2;
  const NUM = 500;
  const stars = [];

  function spawn(far) {
    return {
      x: (Math.random() - 0.5) * px.w * 2,
      y: (Math.random() - 0.5) * px.h * 2,
      z: far ? Math.random() * 1500 + 500 : Math.random() * 2000,
    };
  }

  for (let i = 0; i < NUM; i++) stars.push(spawn(true));

  px.run(() => {
    px.fade(0, 0, 0, 0.15);

    for (let i = 0; i < NUM; i++) {
      const s = stars[i];
      s.z -= 4;

      if (s.z <= 1) {
        stars[i] = spawn(false);
        stars[i].z = 2000;
        continue;
      }

      const sx = cx + (s.x / s.z) * 300;
      const sy = cy + (s.y / s.z) * 300;

      if (sx < 0 || sx >= px.w || sy < 0 || sy >= px.h) {
        stars[i] = spawn(false);
        stars[i].z = 2000;
        continue;
      }

      // Size and brightness increase as star gets closer
      const ratio = 1 - s.z / 2000;
      const bright = Math.floor(100 + 155 * ratio);
      const size = ratio < 0.3 ? 1 : ratio < 0.7 ? 2 : 3;

      // Slight blue tint for distant, warm white for close
      const r = bright;
      const g = bright;
      const b = Math.min(255, bright + Math.floor(40 * (1 - ratio)));

      if (size === 1) {
        px.dot(sx, sy, r, g, b, 0.6 + ratio * 0.4);
      } else {
        px.rect(sx, sy, size, size, r, g, b, 0.6 + ratio * 0.4);
      }

      // Motion trail for close stars
      if (ratio > 0.6) {
        const tx = cx + (s.x / (s.z + 15)) * 300;
        const ty = cy + (s.y / (s.z + 15)) * 300;
        px.dot(tx, ty, r, g, b, 0.2);
      }
    }
  });

  return px;
}
