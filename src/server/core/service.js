'use strict';

let logger = require('./../../../src/server/utils/logger');

class service {
  constructor(app) {
    if (this.constructor.name === 'service') {
      throw new Error('Service class cannot be initialized');
    }

    this.app = app;
    this.bindScope();
  }

  bindScope() {
    const { ENV } = this.app.settings;

    /** Log loaded models */
    if (ENV.isDevelopment) {
      logger.info('[SERVICE] ' + this.constructor.name);
    }

    let methods = Object.getOwnPropertyNames(this.constructor.prototype);
    for (let i = 0; i < methods.length; i++) {
      /** Method name */
      const key = methods[i];

      /** Method reference */
      const method = this[key];

      /** Bind current scope to model methods */
      if (key !== 'constructor' && typeof method === 'function') {
        this[key] = method.bind(this);
      }
    }
  }
}

module.exports = service;
