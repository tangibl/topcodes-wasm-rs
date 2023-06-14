import {defineConfig, UserConfigExport} from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

const config: UserConfigExport = {
  base: "/topcodes-wasm-rs/",
  plugins: [
    wasm(),
    topLevelAwait(),
  ],
  server: {
    fs: {
      allow: ['..'],
    },
  },
};

export default defineConfig(config);
