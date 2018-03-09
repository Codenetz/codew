let controller = require("../../src/server/core/controller");

class controllerMock extends controller {
  bindScope () {}
}

module.exports = controllerMock;