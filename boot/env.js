'use strict';

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';
const TEST = 'test';

let env = process.env.NODE_ENV || DEVELOPMENT;

module.exports = {
  isProduction: env === PRODUCTION,
  isDevelopment: env === DEVELOPMENT,
  isTest: env === TEST,
  env: env,
  vars: process.env
};
