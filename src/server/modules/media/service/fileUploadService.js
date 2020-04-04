'use strict';

let service = require('./../../../core/service'),
  mkdirp = require('mkdirp'),
  path = require('path'),
  fs = require('fs'),
  crypto = require('crypto'),
  { clientS3, saveS3 } = require('./../aws'),
  env = require('./../../../../../boot/env');

const { S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_REGION, S3_BUCKET } = env.vars;

class fileUploadService extends service {
  genFilename(options) {
    let filename = crypto
      .createHash('sha256')
      .update(
        Date.now() +
          '-' +
          Math.floor(Math.random() * Math.floor(99999999)) +
          env.vars.SECRET_KEY
      )
      .digest('hex');

    if (options.extension) {
      filename += '.' + options.extension;
    }

    return filename;
  }

  async toFS(buffer, options) {
    const filename =
      env.basePath + '/public/files/' + this.genFilename(options);
    mkdirp.sync(path.dirname(filename));
    fs.writeFileSync(filename, buffer);
    return path.basename(filename);
  }

  async toS3(buffer, options) {
    const filename = 'files/' + this.genFilename(options);
    await saveS3(
      clientS3({
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
        region: S3_REGION
      }),
      {
        bucket: S3_BUCKET
      },
      filename,
      options.mime,
      buffer
    );
    return path.basename(filename);
  }
}

module.exports = fileUploadService;
