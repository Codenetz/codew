let logger = require('../../server/utils/logger');

module.exports = (err, req, res, next) => {
  if (err.isServer) {
    logger.rawError(err);
  }

  if (!err.output) {
    logger.rawError(err);
    return res.status(400).json({
      statusCode: 400
    });
  }

  return res.status(err.output.statusCode).json(err.output.payload);
};
