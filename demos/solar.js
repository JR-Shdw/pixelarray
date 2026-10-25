// SPDX-License-Identifier: MIT
/**
 * Solar system — 100% pixelarray API (dot + rect + fill only)
 * Planet colors pre-calculated in arrays, drawn with px.dot() each frame
 */

import { PixelArray } from '../src/pixelarray.js';

export function solar(canvas) {
  const px = new PixelArray(canvas, { pixelSize: 1 });
  const cx = px.w / 2, cy = px.h / 2;
  const scale = Math.min(px.w, px.h * 2) / 600;
  const SUN_R = Math.floor(18 * scale);

  // ── Pre-calculate planet pixel colors (stored as arrays) ────
  function calcPixels(radius, colorFn) {
    const pixels = [];
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > radius * radius) continue;
        const dist = Math.sqrt(dx * dx + dy * dy) / radius;
        const nx = dx / radius, ny = dy / radius;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        const light = Math.max(0.12, 0.3 * nx - 0.2 * ny + 0.7 * nz);
        const [r, g, b] = colorFn(nx, ny, nz, dist);
        pixels.push({
          dx, dy,
          r: Math.max(0, Math.min(255, Math.floor(r * light))),
          g: Math.max(0, Math.min(255, Math.floor(g * light))),
          b: Math.max(0, Math.min(255, Math.floor(b * light))),
        });
      }
    }
    return pixels;
  }

  // Sun pixels
  const sunPixels = [];
  for (let dy = -SUN_R; dy <= SUN_R; dy++) {
    for (let dx = -SUN_R; dx <= SUN_R; dx++) {
      if (dx * dx + dy * dy > SUN_R * SUN_R) continue;
      const dist = Math.sqrt(dx * dx + dy * dy) / SUN_R;
      const limb = 1 - dist * dist * 0.4;
      sunPixels.push({
        dx, dy,
        r: Math.floor(255 * limb),
        g: Math.floor((235 - 55 * dist) * limb),
        b: Math.max(0, Math.floor((170 - 155 * dist) * limb)),
      });
    }
  }

  // Planet definitions
  const defs = [
    { name: 'mercury', orbit: 50 * scale, speed: 0.013,
      size: Math.max(2, Math.floor(3 * scale)), tilt: 0.38, moons: [],
      texFn: (nx, ny, nz, d) => {
        const v = 170 - Math.sin(nx * 12 + ny * 8) * 20 * (1 - d);
        return [v, v - 10, v - 20];
      }},
    { name: 'venus', orbit: 72 * scale, speed: 0.0095,
      size: Math.max(3, Math.floor(5 * scale)), tilt: 0.38, moons: [],
      atmo: [255, 235, 170], texFn: (nx, ny) => {
        const band = Math.sin(ny * 8 + nx * 2) * 12;
        return [235 + band, 210 + band * 0.7, 140 - 5];
      }},
    { name: 'earth', orbit: 100 * scale, speed: 0.0065,
      size: Math.max(4, Math.floor(5 * scale)), tilt: 0.38,
      moons: [{ orbit: 9 * scale, speed: 0.035, size: 2, col: [200, 200, 210], angle: 0 }],
      atmo: [80, 140, 255], texFn: (nx, ny, nz) => {
        const lon = Math.atan2(nx, nz), lat = Math.asin(Math.max(-1, Math.min(1, ny)));
        const c = Math.sin(lon * 2.5) * Math.cos(lat * 3) +
                  Math.sin(lon * 5 + 1) * Math.cos(lat * 4 + 2) * 0.5;
        if (Math.abs(lat) > 1.2) return [230, 240, 250];
        if (c > 0.3) return [45 + c * 25, 130 + c * 15, 55];
        if (c > 0.15) return [30, 100, 170];
        return [30, 70, 190];
      }},
    { name: 'mars', orbit: 130 * scale, speed: 0.005,
      size: Math.max(3, Math.floor(4 * scale)), tilt: 0.38,
      moons: [
        { orbit: 6 * scale, speed: 0.06, size: 1, col: [170, 160, 150], angle: 0 },
        { orbit: 9 * scale, speed: 0.04, size: 1, col: [160, 150, 140], angle: 2.5 },
      ],
      texFn: (nx, ny, nz) => {
        const lon = Math.atan2(nx, nz), lat = Math.asin(Math.max(-1, Math.min(1, ny)));
        const t = Math.sin(lon * 4) * Math.cos(lat * 3) * 18;
        if (Math.abs(lat) > 1.1) return [235, 230, 220];
        return [195 + t, 85 + t * 0.4, 45];
      }},
    { name: 'jupiter', orbit: 180 * scale, speed: 0.003,
      size: Math.max(7, Math.floor(11 * scale)),  tilt: 0.35,
      moons: [
        { orbit: 15 * scale, speed: 0.026, size: 2, col: [230, 210, 160], angle: 0 },
        { orbit: 19 * scale, speed: 0.019, size: 3, col: [200, 170, 120], angle: 1.5 },
        { orbit: 24 * scale, speed: 0.013, size: 2, col: [180, 160, 140], angle: 3 },
        { orbit: 29 * scale, speed: 0.009, size: 2, col: [160, 150, 140], angle: 4.5 },
      ],
      texFn: (nx, ny) => {
        const band = Math.sin(ny * 14) * 22;
        const turb = Math.sin(nx * 10 + ny * 18) * 6;
        const gd = (nx - 0.2) * (nx - 0.2) + (ny - 0.25) * (ny - 0.25);
        if (gd < 0.03) return [210, 90, 55];
        return [210 + band + turb, 180 + (band + turb) * 0.6, 140 + turb * 0.3];
      }},
    { name: 'saturn', orbit: 225 * scale, speed: 0.0018,
      size: Math.max(6, Math.floor(9 * scale)), tilt: 0.35, rings: true,
      moons: [
        { orbit: 20 * scale, speed: 0.02, size: 2, col: [235, 220, 180], angle: 0 },
        { orbit: 25 * scale, speed: 0.014, size: 1, col: [200, 190, 165], angle: 2 },
      ],
      texFn: (nx, ny) => {
        const band = Math.sin(ny * 10) * 10;
        return [220 + band, 200 + band * 0.7, 150 + band * 0.4];
      }},
    { name: 'uranus', orbit: 262 * scale, speed: 0.0012,
      size: Math.max(4, Math.floor(6 * scale)), tilt: 0.35,
      moons: [{ orbit: 10 * scale, speed: 0.028, size: 1, col: [180, 200, 215], angle: 0 }],
      atmo: [170, 230, 245], texFn: () => [150, 215, 230] },
    { name: 'neptune', orbit: 292 * scale, speed: 0.0008,
      size: Math.max(4, Math.floor(6 * scale)), tilt: 0.35,
      moons: [{ orbit: 11 * scale, speed: 0.024, size: 1, col: [170, 175, 200], angle: 0 }],
      atmo: [60, 100, 240], texFn: (nx, ny) => {
        const streak = Math.sin(ny * 8 + nx * 4) * 8;
        return [40 + streak * 0.3, 70 + streak * 0.5, 200 + streak];
      }},
  ];

  // Build pixel arrays + planet state
  const planets = defs.map(d => ({
    ...d,
    pixels: calcPixels(d.size, d.texFn),
    angle: Math.random() * Math.PI * 2,
  }));

  // Moon pixel cache
  const moonPixCache = {};
  function getMoonPx(size, col) {
    const key = `${size}_${col.join(',')}`;
    if (!moonPixCache[key]) {
      moonPixCache[key] = calcPixels(size, () => col);
    }
    return moonPixCache[key];
  }

  // Stars
  const stars = [];
  for (let i = 0; i < 600; i++) {
    const t = Math.random();
    let sr, sg, sb;
    if (t < 0.15) { sr = 140; sg = 160; sb = 255; }
    else if (t < 0.6) { sr = 255; sg = 255; sb = 255; }
    else if (t < 0.85) { sr = 255; sg = 240; sb = 180; }
    else { sr = 255; sg = 190; sb = 130; }
    stars.push({
      x: Math.random() * px.w, y: Math.random() * px.h,
      bright: 15 + Math.floor(Math.random() * 100),
      sr, sg, sb,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 3,
    });
  }

  // Corona
  const corona = [];
  for (let i = 0; i < 350; i++) {
    corona.push({
      angle: Math.random() * Math.PI * 2,
      dist: SUN_R + 1 + Math.random() * 16 * scale,
      speed: 0.001 + Math.random() * 0.004,
      bright: 0.1 + Math.random() * 0.55,
    });
  }

  // Sunspots
  const sunspots = [];
  for (let i = 0; i < 5; i++) {
    sunspots.push({
      lon: Math.random() * Math.PI * 2,
      lat: (Math.random() - 0.5) * 1.2,
      size: (1.5 + Math.random() * 2.5) * scale,
      life: 0.5 + Math.random() * 0.5,
      decay: 0.0003 + Math.random() * 0.0005,
    });
  }

  // Solar flares
  const NUM_FLARES = 6;
  const flares = [];
  function makeFlare() {
    return {
      baseAngle: Math.random() * Math.PI * 2,
      height: (10 + Math.random() * 20) * scale,
      width: 0.15 + Math.random() * 0.35,
      life: 1,
      decay: 0.003 + Math.random() * 0.005,
    };
  }
  for (let i = 0; i < NUM_FLARES; i++) flares.push(makeFlare());

  // CME
  const cme = [];
  function makeCme() {
    return {
      angle: Math.random() * Math.PI * 2,
      dist: SUN_R + 2,
      speed: 0.3 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.01,
      life: 1,
      decay: 0.008 + Math.random() * 0.012,
      size: 1 + Math.floor(Math.random() * 2),
    };
  }
  for (let i = 0; i < 20; i++) cme.push(makeCme());

  // Asteroids
  const asteroids = [];
  const beltIn = 148 * scale, beltOut = 163 * scale;
  for (let i = 0; i < 200; i++) {
    asteroids.push({
      angle: Math.random() * Math.PI * 2,
      dist: beltIn + Math.random() * (beltOut - beltIn),
      speed: 0.0008 + Math.random() * 0.002,
      bright: 25 + Math.floor(Math.random() * 50),
    });
  }

  let time = 0;

  px.run(() => {
    px.fill(2, 2, 6);
    time += 0.016;

    // Stars
    for (const s of stars) {
      const f = 0.4 + Math.sin(s.phase + time * s.speed) * 0.6;
      const b = f * s.bright / 255;
      px.dot(s.x, s.y, Math.floor(s.sr * b), Math.floor(s.sg * b), Math.floor(s.sb * b));
    }

    // Orbit ellipses
    for (const p of planets) {
      for (let a = 0; a < Math.PI * 2; a += 0.012) {
        px.dot(
          Math.floor(cx + Math.cos(a) * p.orbit),
          Math.floor(cy + Math.sin(a) * p.orbit * p.tilt),
          35, 45, 70, 0.45);
      }
    }

    // Asteroids
    for (const a of asteroids) {
      a.angle += a.speed;
      px.dot(
        Math.floor(cx + Math.cos(a.angle) * a.dist),
        Math.floor(cy + Math.sin(a.angle) * a.dist * 0.36),
        a.bright, a.bright - 5, a.bright - 10, 0.45);
    }

    // Sun glow
    for (let layer = 0; layer < 3; layer++) {
      const gr = SUN_R + 4 + layer * 4;
      const a = 0.04 + layer * 0.015;
      for (let ang = 0; ang < Math.PI * 2; ang += 0.04) {
        px.dot(Math.floor(cx + Math.cos(ang) * gr),
          Math.floor(cy + Math.sin(ang) * gr), 255, 200, 60, a);
        px.dot(Math.floor(cx + Math.cos(ang) * (gr + 1)),
          Math.floor(cy + Math.sin(ang) * (gr + 1)), 255, 190, 50, a * 0.7);
      }
    }

    // Sun body — pre-calculated pixels, drawn with px.dot()
    for (const p of sunPixels) {
      px.dot(cx + p.dx, cy + p.dy, p.r, p.g, p.b);
    }

    // Sun granulation
    for (let i = 0; i < 30; i++) {
      const a = time * 2 + i * 0.5;
      const d = Math.random() * SUN_R * 0.8;
      const sx = cx + Math.cos(a) * d;
      const sy = cy + Math.sin(a + i) * d;
      if ((sx - cx) * (sx - cx) + (sy - cy) * (sy - cy) < SUN_R * SUN_R) {
        px.dot(Math.floor(sx), Math.floor(sy), 255, 255, 220, 0.15);
      }
    }

    // Sunspots
    const sunRot = time * 0.15;
    for (let si = 0; si < sunspots.length; si++) {
      const sp = sunspots[si];
      sp.life -= sp.decay;
      if (sp.life <= 0) {
        sunspots[si] = { lon: Math.random() * Math.PI * 2,
          lat: (Math.random() - 0.5) * 1.2,
          size: (1.5 + Math.random() * 2.5) * scale,
          life: 0.5 + Math.random() * 0.5,
          decay: 0.0003 + Math.random() * 0.0005 };
        continue;
      }
      const lon = sp.lon + sunRot;
      const cosLon = Math.cos(lon);
      if (cosLon < 0) continue;
      const spotX = cx + Math.sin(lon) * Math.cos(sp.lat) * SUN_R * 0.85;
      const spotY = cy + Math.sin(sp.lat) * SUN_R * 0.85;
      const drawSize = Math.max(1, Math.floor(sp.size * cosLon));
      for (let dy = -drawSize; dy <= drawSize; dy++) {
        for (let dx = -drawSize; dx <= drawSize; dx++) {
          if (dx * dx + dy * dy > drawSize * drawSize) continue;
          const px2 = spotX + dx, py2 = spotY + dy;
          if ((px2 - cx) * (px2 - cx) + (py2 - cy) * (py2 - cy) > SUN_R * SUN_R) continue;
          const dist = Math.sqrt(dx * dx + dy * dy) / drawSize;
          if (dist < 0.45) {
            px.dot(Math.floor(px2), Math.floor(py2), 140, 70, 25, 0.45 * sp.life);
          } else {
            px.dot(Math.floor(px2), Math.floor(py2), 190, 120, 50, 0.25 * sp.life * (1 - dist));
          }
        }
      }
    }

    // Corona
    for (const c of corona) {
      c.angle += c.speed;
      const w = Math.sin(time * 2 + c.angle * 5) * 1.5;
      px.dot(Math.floor(cx + Math.cos(c.angle) * (c.dist + w)),
        Math.floor(cy + Math.sin(c.angle) * (c.dist + w)),
        255, 210, 80, c.bright * 0.25);
    }

    // Flares
    for (let fi = 0; fi < NUM_FLARES; fi++) {
      const f = flares[fi];
      f.life -= f.decay;
      if (f.life <= 0) { flares[fi] = makeFlare(); continue; }
      for (let t = 0; t < 20; t++) {
        const frac = t / 20;
        const arcH = Math.sin(frac * Math.PI) * f.height * f.life;
        const a = f.baseAngle + (frac - 0.5) * f.width;
        const d = SUN_R + arcH;
        const bright = (1 - frac * 0.6) * f.life;
        px.dot(Math.floor(cx + Math.cos(a) * d), Math.floor(cy + Math.sin(a) * d),
          255, 180, 50, bright * 0.6);
        px.dot(Math.floor(cx + Math.cos(a) * d + 1), Math.floor(cy + Math.sin(a) * d),
          255, 140, 30, bright * 0.35);
        if (frac < 0.3) {
          px.dot(Math.floor(cx + Math.cos(a) * d), Math.floor(cy + Math.sin(a) * d - 1),
            255, 230, 150, bright * 0.3);
        }
      }
    }

    // CME
    for (let ci = 0; ci < cme.length; ci++) {
      const c = cme[ci];
      c.dist += c.speed; c.angle += c.drift; c.life -= c.decay;
      if (c.life <= 0 || c.dist > SUN_R + 35 * scale) { cme[ci] = makeCme(); continue; }
      const ex = cx + Math.cos(c.angle) * c.dist;
      const ey = cy + Math.sin(c.angle) * c.dist;
      px.dot(Math.floor(ex), Math.floor(ey), 255, 190, 60, c.life * 0.5);
      if (c.size > 1) {
        px.dot(Math.floor(ex + 1), Math.floor(ey), 255, 160, 40, c.life * 0.3);
      }
    }

    // Planets
    for (const p of planets) {
      p.angle += p.speed;
      const ppx = cx + Math.cos(p.angle) * p.orbit;
      const ppy = cy + Math.sin(p.angle) * p.orbit * p.tilt;

      if (p.rings) drawRings(px, ppx, ppy, p.size, true);

      // Atmosphere halo
      if (p.atmo) {
        const ar = p.size + 2;
        for (let ang = 0; ang < Math.PI * 2; ang += 0.12) {
          px.dot(Math.floor(ppx + Math.cos(ang) * ar),
            Math.floor(ppy + Math.sin(ang) * ar),
            p.atmo[0], p.atmo[1], p.atmo[2], 0.1);
        }
      }

      // Planet body — pre-calculated pixel array, drawn with px.dot()
      for (const pix of p.pixels) {
        px.dot(Math.floor(ppx + pix.dx), Math.floor(ppy + pix.dy), pix.r, pix.g, pix.b);
      }

      if (p.rings) drawRings(px, ppx, ppy, p.size, false);

      // Moons
      for (const m of p.moons) {
        m.angle += m.speed;
        const mx = ppx + Math.cos(m.angle) * m.orbit;
        const my = ppy + Math.sin(m.angle) * m.orbit * 0.35;
        const mpx = getMoonPx(m.size, m.col);
        for (const pix of mpx) {
          px.dot(Math.floor(mx + pix.dx), Math.floor(my + pix.dy), pix.r, pix.g, pix.b);
        }
      }
    }
  });

  return px;
}

function drawRings(px, x, y, planetSize, behind) {
  const rings = [
    { inner: planetSize + 2, outer: planetSize + 4, bright: 0.2 },
    { inner: planetSize + 5, outer: planetSize + 8, bright: 0.32 },
    { inner: planetSize + 9, outer: planetSize + 12, bright: 0.25 },
  ];
  for (const ring of rings) {
    for (let ra = 0; ra < Math.PI * 2; ra += 0.04) {
      if ((Math.sin(ra) < 0) !== behind) continue;
      for (let rd = ring.inner; rd <= ring.outer; rd += 0.8) {
        px.dot(Math.floor(x + Math.cos(ra) * rd),
          Math.floor(y + Math.sin(ra) * rd * 0.25),
          220, 205, 170, ring.bright);
      }
    }
  }
}
