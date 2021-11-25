const path = require("path");
const webpack = require("webpack");

const ROOT_DIRECTORY = path.resolve(__dirname, '..');

module.exports = {
  entry: ["babel-polyfill", "./src/index.js"],
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(ROOT_DIRECTORY, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  devServer: {
    hot: true,
    contentBase: path.join(ROOT_DIRECTORY, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
    proxy: {
      '/api': {
        target: "http://[::1]:3001",
        secure: false,
        changeOrigin: true
      }
    }
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};