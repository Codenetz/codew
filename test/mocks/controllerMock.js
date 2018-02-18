let controller = require("../../src/server/modules/core/controller");

class controllerMock extends controller {
  bindScope () {}
}

module.exports = controllerMock;