#!/usr/bin/env bash

set -ex

wasm-pack build --target web
python -m http.server
