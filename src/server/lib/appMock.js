let env = require('../../../boot/env');

class appMock {
  constructor() {
    this.vars = {
      ENV: env
    };
  }

  get settings() {
    return this.vars;
  }

  set(name, value) {
    this.vars[name] = value;
  }

  get(name) {
    return this.vars[name];
  }
}

module.exports = appMock;
