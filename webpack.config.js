/** Load module for .env support */
require('dotenv').config();

const PUBLIC_DIR = __dirname + '/public/assets/dist/';

let fs = require('fs'),
  path = require('path'),
  envBoot = require('./boot/env'),
  versionClass = require('./src/server/lib/version'),
  version = new versionClass(),
  env = envBoot.env,
  isDevelopment = envBoot.isDevelopment,
  isProduction = envBoot.isProduction,
  webpack = require('webpack'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin');

console.log('ENV', '=', env, '\r\n');

let stylus_loader = () => {
    return {
      loader: 'stylus-loader',
      options: {
        use: [require('nib')()],
        import: ['~nib/lib/nib/index.styl'],
        importLoaders: 0
      }
    };
  },
  css_loader = localIdentName => {
    return {
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: localIdentName,
        importLoaders: 0
      }
    };
  };

const config = {
  entry: {
    ['desktop' + version.hash]: './src/client/desktop/app.js',
    ['mobile' + version.hash]: './src/client/mobile/app.js'
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name]chunk' + version.hash + '.js',
    path: PUBLIC_DIR,
    publicPath: envBoot.vars.RESOURCE_HOST + '/assets/dist/'
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
        use: [
          MiniCssExtractPlugin.loader,
          css_loader('[local]'),
          stylus_loader()
        ]
      },
      {
        test: /[^common]\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          css_loader(
            isDevelopment
              ? '[name]__[local]___[hash:base64:5]'
              : '[hash:base64:5]'
          ),
          stylus_loader()
        ]
      },
      {
        rules: [{ test: /\.css$/, use: ['style-loader', 'css-loader'] }]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.styl'],
    alias: {
      utils: path.resolve(__dirname, 'src/client/utils'),
      packages: path.resolve(__dirname, 'src/client/packages'),
      helpers: path.resolve(__dirname, 'src/client/helpers'),
      contexts: path.resolve(__dirname, 'src/client/helpers/contexts')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name]chunk' + version.hash + '.css'
    })
  ],
  mode: env,
  watch: isDevelopment,
  stats: {
    warningsFilter: /mini-css-extract-plugin/
  }
};

module.exports = config;