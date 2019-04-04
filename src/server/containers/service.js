'use strict';

let container = require('./container'),
  { SERVICE_CONTAINER } = require('../constants');

class service extends container {
  constructor(app) {
    super(app);
    this.container_name = SERVICE_CONTAINER;
  }
}

module.exports = service;
