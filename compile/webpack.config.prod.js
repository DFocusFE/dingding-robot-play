const webpack = require('webpack')

const merge = require('webpack-merge')
const base = require('./webpack.config.base')

module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false
    })
  ]
})
