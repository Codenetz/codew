let jwt = require('express-jwt'),
  Boom = require('boom'),
  { ROLE_ADMIN } = require('../constants/roles'),
  env = require('../../../../../boot/env');

/** Handles passed JWT.
 *  If the token is valid, req.user will be set in the request object.
 */
module.exports.AUTHORIZATION_TOKEN = jwt({
  secret: env.vars.SECRET_KEY
});

module.exports.AUTHORIZATION_TOKEN_OPTIONAL = jwt({
  secret: env.vars.SECRET_KEY,
  credentialsRequired: false
});

/** Adds user object to `req.user` */
module.exports.FETCH_USER = async (req, res, next) => {
  if (!req.user) {
    return next(Boom.forbidden());
  }

  if (!req.user.id) {
    return next(Boom.forbidden());
  }

  req.user = await req.app
    .get('MODEL')
    .get('userModel')
    .getItemById(req.user.id);

  if (!req.user) {
    return next(Boom.forbidden());
  }

  return next();
};

/** Adds user object to `req.user` */
module.exports.FETCH_USER_OPTIONAL = async (req, res, next) => {
  if (req.user && req.user.id) {
    req.user = await req.app
      .get('MODEL')
      .get('userModel')
      .getItemById(req.user.id);
  }

  return next();
};

/** Checks if user has administrator privileges */
module.exports.IS_ADMIN = async (req, res, next) => {
  if (!req.user) {
    return next(Boom.forbidden());
  }

  if (!req.user.role) {
    return next(Boom.forbidden());
  }

  if (req.user.role !== ROLE_ADMIN) {
    return next(Boom.forbidden());
  }

  return next();
};
