const webpack = require('webpack')

const merge = require('webpack-merge')
const base = require('./webpack.config.base')

module.exports = merge(base, {
  devServer: {
    historyApiFallback: false,
    host: '0.0.0.0',
    port: 8080,
    hot: true
  },
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true
    })
  ]
})
