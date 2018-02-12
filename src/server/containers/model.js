"use strict";

let
  container = require("./container"),
  {MODEL_CONTAINER} = require("../constants");

class model extends container {
  constructor(app) {
    super(app);
    this.container_name = MODEL_CONTAINER;
  }
}

module.exports = model;