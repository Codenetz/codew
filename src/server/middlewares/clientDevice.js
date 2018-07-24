let mobileDetect = require('mobile-detect');

module.exports = (req, res, next) => {
  let device = new mobileDetect(req.headers['user-agent']);

  if(!req.client_device) {
    req.client_device = {};
  }

  req.client_device.device = device;
  req.client_device.is_mobile = (device.mobile() !== null || device.phone() !== null || device.tablet() !== null);
  return next();
};