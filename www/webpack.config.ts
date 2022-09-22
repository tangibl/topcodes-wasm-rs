import * as webpack from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";

const config: webpack.Configuration = {
  entry: "./bootstrap.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  mode: "development",
  plugins: [
    new CopyWebpackPlugin({
      patterns: ["index.html"]
    }),
  ],
  experiments: {
    asyncWebAssembly: true,
  },
};

export default config;
