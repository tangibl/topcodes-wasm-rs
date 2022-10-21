# TopCodes in WASM

[![npm](https://img.shields.io/npm/v/@tangibl/topcodes-wasm)](https://www.npmjs.com/package/@tangibl/topcodes-wasm)

This package relies on the [Rust
implementation](https://github.com/tangibl/topcodes-rs) of the TopCode library
originally implemented by Michael Horn. This can be seen as a simple web and
JavaScript-compatible interface for the TopCode scanner.

The advantage of this package is that any performance improvements to the Rust
package will be absorbed by this package for free.

## Demo

[![Deployment](https://github.com/tangibl/topcodes-wasm-rs/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/tangibl/topcodes-wasm-rs/actions/workflows/deploy.yml)

A demo of this package is available on [GitHub pages](https://tangibl.github.io/topcodes-wasm-rs/)

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
