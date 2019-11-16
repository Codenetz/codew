module.exports.full = req => {
  return req.protocol + '://' + req.get('host') + req.originalUrl;
};

module.exports.withoutParams = req => {
  return req.protocol + '://' + req.get('host') + req.path;
};

module.exports.addSubdomain = (url, subdomain) => {};
