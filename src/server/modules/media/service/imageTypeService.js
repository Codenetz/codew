'use strict';
let service = require('./../../../core/service'),
  env = require('./../../../../../boot/env'),
  Imagentz = require('imagentz').default;

const PUBLIC_DIR = '/public';
const NOTFOUND_DEFAULT_IMAGE = '/assets/images/notfound.jpg';

class imageTypeService extends service {
  async getTypes(image) {
    const public_path = env.basePath + PUBLIC_DIR;

    return await new Imagentz({
      output_dir: public_path + '/cache',
      fallback: public_path + NOTFOUND_DEFAULT_IMAGE
    })
      .resource(public_path + image.path)
      .addManipulator(manipulator =>
        manipulator
          .key('thumb')
          .quality(90)
          .formatOptions({
            force: true,
            quality: 90
          })
          .resize({
            width: 100,
            height: 100,
            // fit: sharp.fit.cover,
            fit: 'cover',
            position: 16
            // position: sharp.strategy.entropy
          })
      )
      .addManipulator(manipulator =>
        manipulator
          .key('scale')
          .quality(90)
          .formatOptions({
            force: true,
            quality: 90
          })
          .resize({
            width: 500
          })
      )
      .addManipulator(manipulator =>
        manipulator
          .key('poster')
          .quality(9)
          .usePNG()
          .formatOptions({
            palette: true
          })
          .resize({
            width: 1920
          })
      )
      .output();
  }
}

module.exports = imageTypeService;
