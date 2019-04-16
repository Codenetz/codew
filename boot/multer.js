'use strict';

let logger = require('../src/server/utils/logger'),
  uniqid = require('uniqid'),
  path = require('path'),
  env = require('./env'),
  multer = require('multer');

module.exports = app => {
  const { MAX_UPLOAD_SIZE, UPLOAD_ENABLED } = env.vars;

  if (UPLOAD_ENABLED !== 'true') {
    return;
  }

  const UPLOAD_DIRECTORY = 'public/uploads/';

  logger.info('Setting upload directory to ' + UPLOAD_DIRECTORY);
  logger.info('MAX_UPLOAD_SIZE is set to ' + MAX_UPLOAD_SIZE / 1000000 + 'MB');

  app.set(
    'multer',
    multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, UPLOAD_DIRECTORY);
        },

        filename: (req, file, cb) => {
          let extension = path.extname(file.originalname).toLowerCase();
          extension =
            ['.jpg', '.png', '.gif'].indexOf(extension) >= 0
              ? extension
              : '.jpg';
          cb(null, uniqid() + extension);
        }
      }),

      limits: {
        fileSize: MAX_UPLOAD_SIZE
      }
    })
  );
};
