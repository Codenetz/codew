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

entries["app" + version.hash] = './src/client/desktop/App.js';
entries["appmobile" + version.hash] = './src/client/mobile/App.js';

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

if(isProduction) {
  plugins.push(
    new UglifyJsPlugin()
  );
}

let
  stylus_loader = () => {
    return {
      loader: 'stylus-loader',
      options: {
        use: [require('nib')()],
        import: ['~nib/lib/nib/index.styl']
      }
    }
  },

  css_loader = (localIdentName) => {
    return {
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: localIdentName
      }
    };
  };

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
        test: /common\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:
            [
              css_loader('[local]'),
              stylus_loader()
            ]
        })
      },

      {
        test: /[^common]\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:
          [
            css_loader(isDevelopment ? '[name]__[local]___[hash:base64:5]' : '[hash:base64:5]'),
            stylus_loader()
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