# legacy (2017)

The original pixelarray, kept for history. Not maintained, not imported by
anything outside this folder.

- `pixelarray.js` - a flat set of global functions (`pixelDataCreate`,
  `drawPixel`, `drawRandom`, `drawPixelToCanvas`...) sharing one mutable
  `Pixeldata` object. Comments are in French.
- `gol.js` - Conway's game of life written against it.
- `index.html` - the page that runs them. Opens from `file://`: no module,
  no import.

The current library is `../src/pixelarray.js` (the `PixelArray` class). It is
a rewrite, not a compatible successor: nothing here maps onto it. For a game
of life on the current library, see `../demos/gameoflife.js`.
