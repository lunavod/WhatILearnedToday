const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'local',
                localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                context: path.resolve(__dirname),
              }
            }
          },
        ],
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devtool: "source-map",
  plugins: [
    new MiniCssExtractPlugin(),
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
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'local',                                
                localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                context: path.resolve(__dirname),
              }
            }
          },
        ],
      },
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
      entryOnly: false,
      exclude: /.+\.css/gm
    }),
    new webpack.ProvidePlugin({
        _: "lodash"
    }),
    new MiniCssExtractPlugin(),
  ],
}

module.exports = [client, server]
