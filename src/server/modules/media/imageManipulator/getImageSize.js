let gm = require('gm'),
  logger = require('../../../utils/logger'),
  cache_results = {};

module.exports = async (path, silent = false, use_cache = true) => {
  return new Promise(resolve => {
    if (typeof cache_results[path] !== 'undefined' && use_cache) {
      return resolve(cache_results[path]);
    }

    gm(path).size((err, size) => {
      if (!err) {
        cache_results[path] = size;
        return resolve(size);
      }

      if (silent === false) {
        logger.rawError(err);
      }

      return resolve(null);
    });
  });
};
