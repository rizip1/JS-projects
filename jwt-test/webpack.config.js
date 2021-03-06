const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/template.ejs',
      inject: 'body'
    })
  ],
  devtool: 'eval-source-map',
  watch: true,
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3000/',
      'webpack/hot/dev-server',
      './app/index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]-[hash].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  devServer: {
    lazy: false,
    contentBase: path.resolve(__dirname, 'public'),
    inline: true,
    port: 3000,
    colors: true,
    historyApiFallback: true,
    hot: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
};
