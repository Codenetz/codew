/** Load module for .env support */
require('dotenv').config();

let env = require('./boot/env'),
  server = require('./boot/server'),
  logger = require('./src/server/utils/logger');

logger.warning('Starting in ' + env.env + ' environment');

if (env.isDevelopment) {
  require('./boot/eslint');
}

server.load().then(() => {
  logger.success('Server is running on port: ' + env.vars.SERVER_PORT);
});
