'use strict';
let service = require('./../../../core/service'),
  Imagentz = require('imagentz').default,
  env = require('./../../../../../boot/env');

const {
  S3_ACCESS_KEY,
  S3_SECRET_ACCESS_KEY,
  S3_REGION,
  S3_BUCKET,
  CDN,
  UPLOAD_PUBLIC_FOLDER_NAME
} = env.vars;

const NOTFOUND_DEFAULT_IMAGE = '/assets/images/notfound.jpg';

class imageUploadService extends service {
  async toFS(buffer, options = {}) {
    let imagentz = new Imagentz({
      output_dir: env.basePath + '/public/' + UPLOAD_PUBLIC_FOLDER_NAME,
      fallback: env.basePath + '/public' + NOTFOUND_DEFAULT_IMAGE
    }).resourceBuffer(buffer);

    this.attachManipulators(imagentz, options);
    return await imagentz.output();
  }

  async toS3(buffer, options = {}) {
    let imagentz = new Imagentz({
      output_dir: UPLOAD_PUBLIC_FOLDER_NAME,
      fallback: CDN + NOTFOUND_DEFAULT_IMAGE
    }).resourceBuffer(buffer);

    imagentz.useS3({
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
      region: S3_REGION,
      bucket: S3_BUCKET,
      cdn: CDN
    });

    this.attachManipulators(imagentz, options);
    return await imagentz.output();
  }

  attachManipulators(imagentz, options) {
    /** JPEG */
    if (options.extension && ['jpeg', 'jpg'].indexOf(options.extension) >= 0) {
      imagentz.addManipulator(manipulator =>
        manipulator
          .key('original')
          .quality(90)
          .useJPEG()
      );
    } else if (options.extension && ['png'].indexOf(options.extension) >= 0) {
      /** PNG */
      imagentz.addManipulator(manipulator =>
        manipulator
          .key('original')
          .quality(9)
          .usePNG()
      );
    } else {
      /** WEBP */
      imagentz.addManipulator(manipulator =>
        manipulator
          .key('original')
          .quality(90)
          .useWEBP()
      );
    }
  }
}

module.exports = imageUploadService;
