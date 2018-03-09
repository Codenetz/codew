"use strict";

let
  model = require("./../../../core/model"),
  {USER_TABLE} = require("../constants/tables");

class userModel extends model {

  constructor(app) {
    super(app, USER_TABLE);
  }

  getItems() {
  }
}

module.exports = userModel;