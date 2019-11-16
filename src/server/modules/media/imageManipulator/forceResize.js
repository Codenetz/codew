'use strict';
let logger = require('../../../utils/logger'),
  mkdirp = require('mkdirp'),
  path = require('path'),
  gm = require('gm');

module.exports = async (read_filepath, write_filepath, width, height) => {
  return new Promise(resolve => {
    /** Create parent directories */
    mkdirp.sync(path.dirname(write_filepath));

    gm(read_filepath)
      .resizeExact(width, height)
      .write(write_filepath, err => {
        if (err) {
          logger.rawError(err);
        }

        return resolve(!err);
      });
  });
};
