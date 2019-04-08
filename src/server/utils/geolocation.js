let logger = require('./logger');

module.exports = async (maxmind_lookup, ip) => {
  try {
    const data = maxmind_lookup.get(ip);

    if (data && data.country && data.country.iso_code) {
      return data.country.iso_code.toUpperCase();
    }

    return null;
  } catch (e) {
    logger.error('[geolocation error]' + e.toString());
    return null;
  }
};
