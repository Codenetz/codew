let mobileDetect = require('mobile-detect');

module.exports = (req, res, next) => {
  let device = new mobileDetect(req.headers['user-agent']);

  if (!req.clientDevice) {
    req.clientDevice = {};
  }

  req.clientDevice.device = device;
  req.clientDevice.is_mobile =
    device.mobile() !== null ||
    device.phone() !== null ||
    device.tablet() !== null;
  return next();
};
