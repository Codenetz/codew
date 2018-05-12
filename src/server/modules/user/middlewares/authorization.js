let
  jwt = require("express-jwt"),
  Boom = require("boom"),
  {ROLE_ADMIN} = require("../constants/roles"),
  env = require("../../../../../boot/env");

/** Checks if JWT is valid */
module.exports.HAS_TOKEN = jwt({
  secret: env.vars.SECRET_KEY
});

/** Adds user object to `req.user` */
module.exports.FETCH_USER = async (req, res, next) => {

  if(!req.user) {
    return next(Boom.forbidden());
  }

  if(!req.user.id) {
    return next(Boom.forbidden());
  }

  req.user = await req.app.get("MODEL").get("userModel").getItemById(req.user.id);
  next();
};

/** Checks if user has administrator privileges */
module.exports.IS_ADMIN = async (req, res, next) => {

  if(!req.user) {
    return next(Boom.forbidden());
  }

  if(!req.user.role) {
    return next(Boom.forbidden());
  }

  if(req.user.role !== ROLE_ADMIN) {
    return next(Boom.forbidden());
  }

  next();
};