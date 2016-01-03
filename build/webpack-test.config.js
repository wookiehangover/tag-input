'use strict'

const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const loaders = require('./loaders').test

const testDir = path.resolve(
  path.join(__dirname, '..', 'test')
)

module.exports = {
  devtool: 'sourcemap',
  entry: [
    path.join(testDir, 'TagInput-test.js')
  ],
  resolve: {
    extensions: ['', '.jsx', '.js']
  },
  output: {
    path: testDir,
    filename: 'bundle.js'
  },
  module: {
    loaders,
    noParse: [
      /node_modules\/sinon/,
    ]
  },
  postcss: function() {
    return [ autoprefixer ]
  }
}
