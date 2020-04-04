let { CLIENT, SCOPES } = require('./../constants/scopes');

module.exports = (req, res, next) => {
  if (!req.query.scope) {
    req.query.scope = CLIENT;
  }

  req.scope = req.query.scope.toUpperCase();
  delete req.query.scope;

  if (SCOPES.indexOf(req.scope) < 0) {
    return next('scope.invalid');
  }

  return next();
};
