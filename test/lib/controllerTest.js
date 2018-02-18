let
  assert = require("chai").assert,
  controllerMock = require("../mocks/controllerMock"),
  responseMock = require("../mocks/responseMock"),
  applicationMock = require("../mocks/applicationMock");

describe("controller", function() {

  it("response (default response)", () => {
    let res = new responseMock();
    new controllerMock(new applicationMock(), true).response(res);

    assert.equal(res.status_code, 200);
    assert.equal(JSON.stringify(res.json_data), JSON.stringify({
      data: {}
    }));
  });

  it("response (custom response)", () => {
    let res = new responseMock();
    new controllerMock(new applicationMock(), true).response(res, {
      items: []
    }, 201);

    assert.equal(res.status_code, 201);
    assert.equal(JSON.stringify(res.json_data), JSON.stringify({
      data: {
        items: []
      }
    }));
  });

  it("responseError (default response)", () => {
    let res = new responseMock();
    new controllerMock(new applicationMock(), true).responseError(res);

    assert.equal(res.status_code, 400);
    assert.equal(JSON.stringify(res.json_data), JSON.stringify({
      error: {
        code: 400,
        message: "",
        errors: []
      }
    }));
  });

  it("responseError (custom response)", () => {
    let
      res = new responseMock(),
      controller = new controllerMock(new applicationMock(), true),
      errors = [
        controller.createError("custom"),
        controller.createError("custom2")
      ];

    controller.responseError(res, "Custom error message", errors, 404);

    assert.equal(res.status_code, 404);
    assert.equal(JSON.stringify(res.json_data), JSON.stringify({
      error: {
        code: 404,
        message: "Custom error message",
        errors: errors
      }
    }));
  });

  it("responseBadRequest", () => {
    let
      res = new responseMock(),
      controller = new controllerMock(new applicationMock(), true),
      errors = [
        controller.createError("custom"),
        controller.createError("custom2")
      ];

    controller.responseBadRequest(res, "Custom error message", errors, 400);

    assert.equal(res.status_code, 400);
    assert.equal(JSON.stringify(res.json_data), JSON.stringify({
      error: {
        code: 400,
        message: "Custom error message",
        errors: errors
      }
    }));
  });

  it("responseForbidden", () => {
    let
      res = new responseMock(),
      controller = new controllerMock(new applicationMock(), true),
      errors = [
        controller.createError("custom"),
        controller.createError("custom2")
      ];

    controller.responseForbidden(res, "Custom error message", errors, 403);

    assert.equal(res.status_code, 403);
    assert.equal(JSON.stringify(res.json_data), JSON.stringify({
      error: {
        code: 403,
        message: "Custom error message",
        errors: errors
      }
    }));
  });

  it("responseNotFound", () => {
    let
      res = new responseMock(),
      controller = new controllerMock(new applicationMock(), true),
      errors = [
        controller.createError("custom"),
        controller.createError("custom2")
      ];

    controller.responseNotFound(res, "Custom error message", errors, 404);

    assert.equal(res.status_code, 404);
    assert.equal(JSON.stringify(res.json_data), JSON.stringify({
      error: {
        code: 404,
        message: "Custom error message",
        errors: errors
      }
    }));
  });

  it("responseUnauthorized", () => {
    let
      res = new responseMock(),
      controller = new controllerMock(new applicationMock(), true),
      errors = [
        controller.createError("custom"),
        controller.createError("custom2")
      ];

    controller.responseUnauthorized(res, "Custom error message", errors, 401);

    assert.equal(res.status_code, 401);
    assert.equal(JSON.stringify(res.json_data), JSON.stringify({
      error: {
        code: 401,
        message: "Custom error message",
        errors: errors
      }
    }));
  });

  it("isValidError", () => {
    let controller = new controllerMock(new applicationMock(), true);

    assert.equal(controller.isValidError({}), false);
    assert.equal(controller.isValidError(controller.createError("custom")), true);
    assert.equal(controller.isValidError(controller.createError("custom", "Custom message")), true);
    assert.equal(controller.isValidError(controller.createError("custom", "Custom message", "Custom reason")), true);
  });

  it("isValidErrorProp", () => {
    let controller = new controllerMock(new applicationMock(), true);

    assert.equal(controller.isValidErrorProp(), false);
    assert.equal(controller.isValidErrorProp(""), false);
    assert.equal(controller.isValidErrorProp({}), false);
    assert.equal(controller.isValidErrorProp([]), false);
    assert.equal(controller.isValidErrorProp("custom"), false);
    assert.equal(controller.isValidErrorProp("prop"), true);
  });

  it("createError", () => {
    let controller = new controllerMock(new applicationMock(), true);

    assert.equal(JSON.stringify(controller.createError("custom")), JSON.stringify({
      prop: "custom",
      message: "",
      reason: ""
    }));

    assert.equal(JSON.stringify(controller.createError("custom", "Custom error message", "Custom error reason")), JSON.stringify({
      prop: "custom",
      message: "Custom error message",
      reason: "Custom error reason"
    }));

    let has_error = false;
    try {
      controller.createError();
    } catch (e) {
      has_error = true;
    }

    assert.equal(has_error, true);
  });
});
