# TopCodes in WASM

This package relies on the [Rust
implementation](https://github.com/battesonb/topcodes-rs) of the TopCode library
originally implemented by Michael Horn. This can be seen as a simple web and
JavaScript-compatible interface for the TopCode scanner.

The advantage of this package is that any performance improvements to the Rust
package will be absorbed by this package for free.

## Screenshot

![Screenshot](docs/screenshot.png)

## Development

Build with the following:

```sh
wasm-pack build
```

Test in a headless browser:

```sh
wasm-pack test --headless --firefox
```

## Integration

If you would like to test the integration of your changes, you can use the NPM
example project under [www/](www/).

## Demo

A demo of this package is available on [GitHub pages](https://battesonb.github.io/topcodes-wasm-rs/)
