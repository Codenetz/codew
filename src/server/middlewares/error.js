let logger = require('../../utils/logger');

module.exports = (err, req, res, next) => {

  if (err.isServer) {
    logger.rawError(err);
  }

  if(!err.output) {
    return res.status(err.status).json({
      "statusCode": err.status
    });
  }

  return res.status(err.output.statusCode).json(err.output.payload);
};