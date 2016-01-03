exports.dev = [
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

exports.test = [
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
    loaders: ['css', 'postcss']
  }
]
