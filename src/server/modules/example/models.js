"use strict";

module.exports = (app) => {

  let userModel = new (require("./model/userModel"))(app);

  app.get("MODEL").set(userModel);
};