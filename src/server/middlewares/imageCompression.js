let gm = require('gm'),
  is = require('../utils/is');

module.exports = (name, req, res, next) => {
  if (!req.files) {
    return next('Property "files" is not found');
  }

  if (typeof req.files[name] === 'undefined') {
    return next();
  }

  if (!is.array(req.files[name])) {
    return next('The "files.' + name + '" property must be an array');
  }

  let images = req.files[name];

  if (images.length < 1) {
    return next();
  }

  images.forEach(image => {
    gm(image.path)
      .quality(70)
      .write(image.path, () => {});
  });

  return next();
};
