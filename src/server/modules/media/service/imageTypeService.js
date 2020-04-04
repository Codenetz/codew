'use strict';
let service = require('./../../../core/service'),
  Imagentz = require('imagentz').default,
  env = require('./../../../../../boot/env');

const {
  S3_ENABLED,
  S3_ACCESS_KEY,
  S3_SECRET_ACCESS_KEY,
  S3_REGION,
  S3_BUCKET,
  CDN,
  REDIS_HOST,
  REDIS_PORT,
  CACHE_PUBLIC_FOLDER_NAME,
  UPLOAD_PUBLIC_FOLDER_NAME
} = env.vars;

const NOTFOUND_DEFAULT_IMAGE = '/assets/images/notfound.jpg';

class imageTypeService extends service {
  async getTypes(image) {
    const publicLocal = env.basePath + '/public';
    const isS3Enabled = S3_ENABLED === 'true';
    const cacheKeyPrefix = isS3Enabled ? 's3_cache_types' : 'local_cache_types';

    let imagentz = new Imagentz({
      output_dir: isS3Enabled
        ? CACHE_PUBLIC_FOLDER_NAME
        : publicLocal + '/' + CACHE_PUBLIC_FOLDER_NAME,
      fallback: isS3Enabled
        ? CDN + NOTFOUND_DEFAULT_IMAGE
        : publicLocal + NOTFOUND_DEFAULT_IMAGE
    })
      .resourcePath(
        isS3Enabled
          ? CDN + '/' + UPLOAD_PUBLIC_FOLDER_NAME + '/' + image.path
          : publicLocal + '/' + UPLOAD_PUBLIC_FOLDER_NAME + '/' + image.path
      )

      /**
       * Can be a name, filepath, id or everything that is unique and won't be changed in the future for the image.
       * It will be randomly generated if not given.
       */
      .resourceCacheKey(cacheKeyPrefix + '_' + image.path)

      .useRedis(cacheKeyPrefix, {
        host: REDIS_HOST,
        port: REDIS_PORT
      });

    if (isS3Enabled) {
      imagentz.useS3({
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
        region: S3_REGION,
        bucket: S3_BUCKET,
        cdn: CDN
      });
    }

    imagentz
      .addManipulator(manipulator =>
        manipulator
          .key('thumb')
          .quality(90)
          .useWEBP()
          .formatOptions({
            force: true
          })
          .resize({
            width: 100,
            height: 100,
            fit: 'cover', //sharp.fit.cover
            position: 16 //sharp.strategy.entropy
          })
      )
      .addManipulator(manipulator =>
        manipulator
          .key('scale')
          .quality(90)
          .useWEBP()
          .formatOptions({
            force: true
          })
          .resize({
            width: 500
          })
      )
      .addManipulator(manipulator =>
        manipulator
          .key('poster')
          .quality(90)
          .useWEBP()
          .resize({
            width: 1920
          })
      );

    return await imagentz.output();
  }
}

module.exports = imageTypeService;
