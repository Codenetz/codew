'use strict';

const logger = require('../src/server/utils/logger'),
  env = require('./env'),
  proxy = require('http-proxy-middleware');

module.exports = app => {
  if (!env.isDevelopment) {
    return;
  }

  const { PROXY_ENABLED, PROXY_HOST, PROXY_PATTERN, PROXY_TIMEOUT } = env.vars;
  const proxy_enabled = PROXY_ENABLED === 'true';
  const proxy_path_patterns = PROXY_PATTERN.split('|')
    .filter(Boolean)
    .map(path => '/' + path);

  if (!proxy_enabled) {
    return;
  }

  logger.info('Creating proxy server to ' + PROXY_HOST);
  logger.info('Proxy timeout ' + Number(PROXY_TIMEOUT));
  logger.info('Proxy paths ' + proxy_path_patterns.join(' '));

  app.use(
    proxy_path_patterns,
    (req, res, next) => {
      res.connection.setTimeout(Number(PROXY_TIMEOUT));
      return next();
    },
    proxy({
      target: PROXY_HOST,
      changeOrigin: true,
      logLevel: 'debug'
    })
  );
};
