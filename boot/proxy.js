'use strict';

let logger = require('../src/server/utils/logger'),
  env = require('./env'),
  proxy = require('http-proxy-middleware');

module.exports = app => {
  if (!env.isDevelopment) {
    return;
  }

  const { PROXY_ENABLED, PROXY_HOST, PROXY_PATTERN, PROXY_TIMEOUT } = env.vars;
  const PROXY_PATH_PATTERNS = PROXY_PATTERN.split('|')
    .filter(Boolean)
    .map(path => '/' + path);

  if (PROXY_ENABLED !== 'true') {
    return;
  }

  logger.info('Creating proxy server to ' + PROXY_HOST);
  logger.info('Proxy timeout ' + Number(PROXY_TIMEOUT));
  logger.info('Proxy paths ' + PROXY_PATH_PATTERNS.join(' '));

  app.use(
    PROXY_PATH_PATTERNS,
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
