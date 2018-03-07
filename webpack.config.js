/** Load module for .env support */
require("dotenv").config();

let
  envBoot = require("./boot/env"),
  env = envBoot.env,
  isDevelopment = envBoot.isDevelopment,
  isProduction = envBoot.isProduction,
  webpack = require('webpack'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin');

console.log(env, 'environment', "\r\n");

/** Holds webpack plugins */
var plugins = [];

plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env)
  })
);

/** Loads plugins only for production env */
if(isProduction) {
  plugins.push(
    new UglifyJsPlugin()
  );
}

const config = {
  entry: {
    app: './src/client/index.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/public/assets/dist/'
  },
  plugins: plugins,
  mode: env,
  watch: (isDevelopment)
};

module.exports = config;