let
  Joi = require("joi"),
  Boom = require("boom"),
  env = require("../../../boot/env"),
  logger = require("../../server/utils/logger");

module.exports = (schema, type, req, res, next) => {

  if(["body", "query", "params", "files"].indexOf(type) < 0) {
    return next("Request type is not correct");
  }

  let {error} = Joi.validate(req[type], schema);

  if(!error) {
    return next();
  }

  /** Log the error to console when on development mode */
  if (env.isDevelopment) {
    logger.rawError(error);
  }

  let errors = {};
  error.details.forEach((error) => {
    errors[error.context.key] = {
      "message": env.vars.RESPONSE_VALIDATION_ERROR_MESSAGE === "true" ? error.message : null,
      "type": error.type,
      "value": error.context.value
    };
  });

  let boom_error = Boom.badRequest(error.name);
  boom_error.output.payload.validation = errors;

  return next(boom_error);
};