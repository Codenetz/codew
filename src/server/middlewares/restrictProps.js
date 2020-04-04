let Boom = require('boom'),
  { ROLE_ADMIN } = require('./../modules/user/constants/roles');

module.exports = async (props, type, req, res, next) => {
  if (['body', 'query', 'params', 'files'].indexOf(type) < 0) {
    return next('Request type is not correct');
  }

  if (req.user && req.user.role && req.user.role === ROLE_ADMIN) {
    return next();
  }

  props.forEach(prop => {
    if (req[type][prop]) {
      delete req[type][prop];
    }
  });

  return next();
};
