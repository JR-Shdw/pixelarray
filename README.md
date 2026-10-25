# pixelarray

A micro canvas-2D drawing library with no dependencies, plus a showcase of
twelve animated demos built on it.

Everything draws through `fillRect(x, y, size, size)`. There is no WebGL, no
shader, no build step and no package to install -- one class, about 110 lines.

## Usage

As an ES module:

```js
import { PixelArray } from './src/pixelarray.js';

const px = new PixelArray('#canvas', { pixelSize: 2, autoClear: true });

px.run((p) => {
  p.dot(Math.random() * p.w, Math.random() * p.h, 255, 80, 0);
});
```

As a plain script tag, where the class lands on `window`:

```html
<script src="src/pixelarray.js"></script>
```

## API

Construct with `new PixelArray(canvas, opts)`, where `canvas` is an element
or a CSS selector. Options are `pixelSize` (default 1) and `autoClear`
(default false, clears the canvas before each frame).

| Method | Effect |
|---|---|
| `dot(x, y, r, g, b, a)` | One pixel square at (x, y) |
| `dotc(x, y, color)` | Same, with a CSS color string |
| `rect(x, y, w, h, r, g, b, a)` | Filled rectangle |
| `fill(r, g, b, a)` | Fill the whole canvas |
| `fade(r, g, b, a)` | Overlay a translucent wash, for motion trails |
| `clear()` | Clear the whole canvas |
| `run(fn)` | Start a `requestAnimationFrame` loop calling `fn(this)` |
| `stop()` | Cancel the loop |
| `resize(w, h)` | Resize; with no arguments, fits the parent element |

The `fade()` helper is what most of the demos rely on for trails: wash the
frame with a low-alpha black instead of clearing it.

## Demos

Open `demos/index.html` and use the arrow buttons. Ten are wired into the
carousel: black hole, solar system, matrix rain, starfield, fire, water,
smoke, dust, snow and game of life. The heaviest run 1200 to 1500 particles.

Two more are not in the carousel and are used as page backgrounds:
`demos/rhorizon-blackhole.js` and `demos/rhorizon-sidepanel.js`, shown by
`rhorizon-blackhole.html` and `rhorizon-intro.html`.

Demos are ES modules importing `../src/pixelarray.js`, so they need to be
served over HTTP rather than opened as `file://`:

```sh
python3 -m http.server 8000
```

## Repository layout

`src/pixelarray.js` is the current library (v2, the `PixelArray` class) and
is what every demo imports.

The `pixelarray.js` at the repository root is the original 2017 version: a
flat set of global functions (`drawPixel`, `drawRandom`, `drawPixelToCanvas`
and so on) with French comments. It is kept because the root `index.html` and
`gol.js` still use it. New code should use `src/`.

## License

MIT. See `LICENSE`. The library and every demo carries an
`SPDX-License-Identifier` header, so the licence of each file is readable
without inferring anything.

One exception, stated in `LICENSE` and in the files themselves:
`demos/rhorizon-blackhole.js` and `demos/rhorizon-sidepanel.js` are brand
assets of the separate Resurgamus Horizon project and stay AGPL-3.0-or-later.
They are standalone demos -- `src/pixelarray.js` and the other demos neither
include nor depend on them -- so deleting those two files, plus the
`rhorizon-blackhole.html` and `rhorizon-intro.html` pages that load them,
leaves an MIT-only tree.
