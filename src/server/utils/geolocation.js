let request = require('superagent');

module.exports = async (ip) => {
  let body = (await request.get('http://geoip.nekudo.com/api/' + ip)).body;
  return body.country && body.country.code ? body.country.code : null;
};