const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals');

const client = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devtool: "source-map",
  plugins: [
  ],
}

const server = {
  mode: 'development',
  target: 'node',
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  externals: [nodeExternals()],
  devtool: "source-map",
  plugins: [
    new webpack.BannerPlugin({ 
      banner: 'require("source-map-support").install();', 
      raw: true, 
      entryOnly: false 
    }),
    new webpack.ProvidePlugin({
        _: "lodash"
    })
  ],
}

module.exports = [client, server]