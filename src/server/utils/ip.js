/** Gets client IP address.
 *
 * Nginx configuration:
 * proxy_set_header X-Forwarded-For
 * */
module.exports = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};