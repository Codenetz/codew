'use strict';
let logger = require('../../../utils/logger'),
  mkdirp = require('mkdirp'),
  getImageSize = require('./getImageSize'),
  path = require('path'),
  gm = require('gm');

module.exports = async (read_filepath, write_filepath, size) => {
  return new Promise(async resolve => {
    /** Create parent directories */
    mkdirp.sync(path.dirname(write_filepath));

    let { width, height } = await getImageSize(read_filepath),
      ratio = width / height;

    let scale_width = Math.round(ratio > 1 ? size * ratio : size),
      scale_height = Math.round(ratio > 1 ? size : size / ratio);

    gm(read_filepath)
      .quality(99)
      .resizeExact(scale_width, scale_height)
      .stream((err, stdout, stderr) => {
        if (err) {
          logger.rawError(err);
          return resolve(!err);
        }

        gm(stdout)
          .quality(99)
          .gravity('Center')
          .crop(size, size)
          .write(write_filepath, function(err) {
            if (err) {
              logger.rawError(err);
            }

            return resolve(!err);
          });
      });
  });
};
