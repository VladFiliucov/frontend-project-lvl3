import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  mode: 'development',

  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new MiniCssExtractPlugin({ filename: 'main.[contenthash].css' }),
  ],

  entry: './src/entry.js',
  output: {
    filename: 'bundle.js',
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    },
    {
      test: /\.(css)$/,
      use: [{
        // inject CSS to page
        loader: 'style-loader',
      }, {
        // translates CSS into CommonJS modules
        loader: 'css-loader',
      }],
    },
    ],
  },
};
