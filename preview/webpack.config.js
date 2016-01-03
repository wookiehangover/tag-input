'use strict'

const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const loaders = require('../build/loaders').dev

const previewDir = path.resolve(__dirname)

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    'webpack/hot/dev-server', path.join(previewDir, 'main.jsx')
  ],
  resolve: {
    extensions: ['', '.jsx', '.js']
  },
  output: {
    path: previewDir,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: loaders
  },
  devServer: {
    hot: true,
    inline: true,
    port: 3000,
    host: '0.0.0.0',
    contentBase: previewDir
  },
  postcss: function() {
    return [ autoprefixer ]
  }
}
