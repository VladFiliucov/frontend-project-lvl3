import path from 'path';
import webpack from 'webpack';
// const path = require('path');
// const webpack = require('webpack');

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __dirname = './';

// module.exports = {
export default {
  mode: 'development',

  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({ filename: 'main.[contenthash].css' }),
  ],

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader',
    }, {
      test: /.css$/,

      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: 'css-loader',

        options: {
          sourceMap: true,
        },
      }],
    }],
  },
};
