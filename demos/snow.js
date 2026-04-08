/**
 * Snow — falling flakes with wind and ground accumulation
 */

import { PixelArray } from '../src/pixelarray.js';

export function snow(canvas) {
  const px = new PixelArray(canvas, { pixelSize: 1 });
  const NUM = 400;
  const flakes = [];
  const ground = new Uint8Array(px.w); // snow height per column

  function spawn(top) {
    return {
      x: Math.random() * px.w,
      y: top ? -(Math.random() * 30) : Math.random() * px.h,
      speed: 0.5 + Math.random() * 1.5,
      drift: (Math.random() - 0.5) * 0.5,
      size: Math.random() < 0.3 ? 2 : 1,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      bright: 180 + Math.floor(Math.random() * 75),
    };
  }

  for (let i = 0; i < NUM; i++) flakes.push(spawn(false));

  let wind = 0;
  let windTarget = 0;

  px.run(() => {
    // Slow fade to dark blue-black (night sky)
    px.fade(8, 10, 20, 0.03);

    // Redraw accumulated snow (permanent)
    for (let x = 0; x < px.w; x++) {
      if (ground[x] > 0) {
        for (let dy = 0; dy < ground[x] && dy < 30; dy++) {
          const y = px.h - 1 - dy;
          const bright = 200 + Math.floor(Math.random() * 20);
          px.dot(x, y, bright, bright, bright + 10, 0.9);
        }
      }
    }

    // Wind shifts slowly
    if (Math.random() < 0.005) windTarget = (Math.random() - 0.5) * 1.5;
    wind += (windTarget - wind) * 0.01;

    for (let i = 0; i < NUM; i++) {
      const f = flakes[i];

      // Sine wobble + wind
      f.wobble += f.wobbleSpeed;
      f.x += f.drift + Math.sin(f.wobble) * 0.3 + wind;
      f.y += f.speed;

      // Wrap horizontally
      if (f.x < 0) f.x += px.w;
      if (f.x >= px.w) f.x -= px.w;

      const gx = Math.floor(f.x);
      const groundY = px.h - ground[gx];

      // Land on ground
      if (f.y >= groundY - 1) {
        if (ground[gx] < 25) {
          ground[gx]++;
          // Smooth neighbors
          if (gx > 0 && ground[gx] - ground[gx - 1] > 2) ground[gx - 1]++;
          if (gx < px.w - 1 && ground[gx] - ground[gx + 1] > 2) ground[gx + 1]++;
        }
        flakes[i] = spawn(true);
        continue;
      }

      const a = 0.6 + Math.random() * 0.3;
      if (f.size > 1) {
        px.rect(f.x, f.y, 2, 2, f.bright, f.bright, f.bright + 10, a);
      } else {
        px.dot(f.x, f.y, f.bright, f.bright, f.bright + 10, a);
      }
    }
  });

  return px;
}
