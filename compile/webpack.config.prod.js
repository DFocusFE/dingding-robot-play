const { resolve } = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer-stylus')

module.exports = {
  entry: {
    index: resolve(__dirname, '..', 'src', 'index.js')
  },
  mode: 'production',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        use: ['eslint-loader']
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'stylus-loader',
            options: {
              use: [autoprefixer()]
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: ['babel-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)\w*/,
        use: ['file-loader']
      }
    ]
  },
  node: {
    __filename: true
  },
  output: {
    chunkFilename: '[id].prod.js',
    filename: '[name].prod.js',
    path: resolve(__dirname, '..', 'build')
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __DEV__: false
    }),
    new HtmlWebpackPlugin({
      favicon: resolve(__dirname, '..', 'assets', 'favicon.ico'),
      filename: 'index.html',
      hash: false,
      inject: 'body',
      template: resolve(__dirname, '..', 'src', 'index.html')
    })
  ],
  resolve: {
    extensions: ['.js', '.vue']
  },
  target: 'electron-renderer'
}
