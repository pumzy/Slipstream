var path = require("path");

module.exports = {
  context: __dirname,
  entry: "./lib/slipstream.js",
  output: {
    filename: "./lib/bundle.js"
  },
  module: {

  },
  devtool: 'source-maps',
  resolve: {
    extensions: [".js", ".jsx", "*"]
  },
};
