/** Load module for .env support */
require("dotenv").config();

let
  envBoot = require("./boot/env"),
  versionClass = require("./src/server/lib/version"),
  version = new versionClass(),
  env = envBoot.env,
  isDevelopment = envBoot.isDevelopment,
  isProduction = envBoot.isProduction,
  webpack = require('webpack'),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin');

console.log(env, 'environment', "\r\n");

/** Holds webpack plugins */
var
  entries = {},
  plugins = [];

entries["app" + version.hash] = './src/client/index.js';

plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env)
  })
);

plugins.push(
  new ExtractTextPlugin({
    filename: "[name].css",
    allChunks: true
  })
);

/** Loads plugins only for production env */
if(isProduction) {
  plugins.push(
    new UglifyJsPlugin()
  );
}

const config = {
  entry: entries,
  output: {
    filename: '[name].js',
    path: __dirname + '/public/assets/dist/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:
          [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: (isDevelopment ? '[name]__[local]___[hash:base64:5]' : '[hash:base64:5]')
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                use: [require('nib')()],
                import: ['~nib/lib/nib/index.styl']
              }
            }
          ]
        })
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.styl']
  },
  plugins: plugins,
  mode: env,
  watch: (isDevelopment)
};

module.exports = config;