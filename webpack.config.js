const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const client = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-flow', '@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-runtime'],
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
      {
        test: /.+(?<!global)\.css/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'local',
                localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                context: path.resolve(__dirname),
              },
            },
          },
        ],
      },
      {
        test: /.+\.global\.css/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin(
      {
        SERVER_BUILD: false,
        CLIENT_BUILD: true,
      },
      new LodashModuleReplacementPlugin()
    ),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}

const server = {
  mode: 'development',
  target: 'node',
  entry: path.resolve(__dirname, 'src/serverIndex.js'),
  output: {
    filename: 'serverBundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'serverBundle',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-flow', '@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-runtime'],
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'local',
                localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                context: path.resolve(__dirname),
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  externals: [nodeExternals()],
  devtool: 'source-map',
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
      exclude: /.+\.css/gm,
    }),
    new webpack.ProvidePlugin({
      _: 'lodash',
      fetch: 'node-fetch',
    }),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin(
      {
        SERVER_BUILD: true,
        CLIENT_BUILD: false,
      },
      new LodashModuleReplacementPlugin()
    ),
  ],
}

module.exports = [client, server]
