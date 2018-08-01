let url = require("url");

module.exports.full = (req) => {
  return req.protocol + '://' + req.get('host') + req.originalUrl;
};

module.exports.addSubdomain = (url, subdomain) => {
  
};