'use strict';

module.exports = app => {
  let userService = new (require('./service/userService'))(app);
  app.get('SERVICE').set(userService);
};
