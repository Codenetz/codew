'use strict';

let logger = require('../src/server/utils/logger'),
  env = require('./env'),
  multer = require('multer');

const { MAX_UPLOAD_SIZE, UPLOAD_PUBLIC_FOLDER_NAME } = env.vars;

const UPLOAD_DIRECTORY = 'public/' + UPLOAD_PUBLIC_FOLDER_NAME + '/';

module.exports = app => {

  logger.info('Setting upload directory to ' + UPLOAD_DIRECTORY);
  logger.info('MAX_UPLOAD_SIZE is set to ' + MAX_UPLOAD_SIZE / 1000000 + 'MB');
  logger.info(
    'UPLOAD_PUBLIC_FOLDER_NAME is set to ' + UPLOAD_PUBLIC_FOLDER_NAME
  );

  app.set(
    'multer',
    multer({
      storage: multer.memoryStorage({}),
      limits: {
        fileSize: MAX_UPLOAD_SIZE
      }
    })
  );

  app.set(
    'multer_file',
    multer({
      storage: multer.memoryStorage({}),
      limits: {
        fileSize: MAX_UPLOAD_SIZE
      }
    })
  );
};
