'use strict'

const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

const previewDir = path.resolve(__dirname)

const loaders = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      presets: [
        'react', 'es2015'
      ]
    }
  },
  {
    test: /\.css$/,
    exclude: /node_modules/,
    loaders: ['style', 'css', 'postcss']
  }
]

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
