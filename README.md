
# pixelarray

A micro canvas-2D drawing library with no dependencies, plus a showcase of
ten animated demos built on it.

Live demo: https://jr-shdw.github.io/pixelarray/

Everything draws through `fillRect(x, y, size, size)`. There is no WebGL, no
shader, no build step and no package to install -- one class, about 110 lines.

## Demos

Open the [live page](https://jr-shdw.github.io/pixelarray/) and use the arrow
buttons, the arrow keys or the dots: black hole, solar system, matrix rain,
starfield, fire, water, smoke, dust, snow and game of life. The heaviest run
1200 to 1500 particles.

To run them locally, serve the repository and open `index.html`:

```sh
python3 -m http.server 8000
```

The demos are ES modules, so they need to be served over HTTP: opened as
`file://` the browser blocks the imports and the page stays black.

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

## Repository layout

```
index.html           the demo carousel
src/pixelarray.js    the library
demos/<name>.js      one demo per file
legacy/              the original 2017 version, kept for history
```

Every demo is self-contained: it imports `../src/pixelarray.js` and exports a
single function taking a canvas element. Copying one is the shortest way to
start something new.

`legacy/` holds the 2017 original, a flat set of global functions with French
comments, and the game of life page built on it. It is a rewrite rather than
a compatible ancestor: nothing there maps onto the current API, and nothing
outside that folder references it. See `legacy/README.md`.

## License

MIT. See `LICENSE`. Every file carries an `SPDX-License-Identifier` header,
so the licence of each one is readable without inferring anything.
