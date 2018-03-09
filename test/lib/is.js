let
  assert = require("chai").assert,
  is = require("../../src/server/utils/is");

describe("is", function() {
  it("nullOrUndefined", () => {

    /** Must return true */
    assert.equal(is.nullOrUndefined(null), true);
    assert.equal(is.nullOrUndefined(undefined), true);

    /** Must return false */
    assert.equal(is.nullOrUndefined(true), false);
    assert.equal(is.nullOrUndefined(""), false);
    assert.equal(is.nullOrUndefined(" "), false);
    assert.equal(is.nullOrUndefined(0), false);
    assert.equal(is.nullOrUndefined(false), false);
    assert.equal(is.nullOrUndefined({}), false);
    assert.equal(is.nullOrUndefined(() => {}), false);
    assert.equal(is.nullOrUndefined(function () {}), false);
    assert.equal(is.nullOrUndefined(class {}), false);
  });
  
  it("undefined", () => {

    /** Must return true */
    assert.equal(is.undefined(undefined), true);

    /** Must return false */
    assert.equal(is.undefined(null), false);
    assert.equal(is.undefined(true), false);
    assert.equal(is.undefined(""), false);
    assert.equal(is.undefined(" "), false);
    assert.equal(is.undefined(0), false);
    assert.equal(is.undefined(false), false);
    assert.equal(is.undefined({}), false);
    assert.equal(is.undefined(() => {}), false);
    assert.equal(is.undefined(function () {}), false);
    assert.equal(is.undefined(class {}), false);
  });

  it("function", () => {

    /** Must return true */
    assert.equal(is.function(() => {}), true);
    assert.equal(is.function(function () {}), true);
    assert.equal(is.function(class {}), true);

    /** Must return false */
    assert.equal(is.function(undefined), false);
    assert.equal(is.function(null), false);
    assert.equal(is.function(true), false);
    assert.equal(is.function(""), false);
    assert.equal(is.function(" "), false);
    assert.equal(is.function(0), false);
    assert.equal(is.function(false), false);
    assert.equal(is.function({}), false);
  });

  it("strictObject", () => {

    /** Must return true */
    assert.equal(is.strictObject({}), true);

    /** Must return false */
    assert.equal(is.strictObject(() => {}), false);
    assert.equal(is.strictObject(function () {}), false);
    assert.equal(is.strictObject(undefined), false);
    assert.equal(is.strictObject(null), false);
    assert.equal(is.strictObject(true), false);
    assert.equal(is.strictObject(""), false);
    assert.equal(is.strictObject(" "), false);
    assert.equal(is.strictObject(0), false);
    assert.equal(is.strictObject(false), false);
    assert.equal(is.strictObject(class {}), false);
  });

  it("object", () => {

    /** Must return true */
    assert.equal(is.object({}), true);
    assert.equal(is.object(class {}), true);
    assert.equal(is.object(() => {}), true);
    assert.equal(is.object(function () {}), true);

    /** Must return false */
    assert.equal(is.object(undefined), false);
    assert.equal(is.object(null), false);
    assert.equal(is.object(true), false);
    assert.equal(is.object(""), false);
    assert.equal(is.object(" "), false);
    assert.equal(is.object(0), false);
    assert.equal(is.object(false), false);
  });

  it("null", () => {

    /** Must return true */
    assert.equal(is.null(null), true);

    /** Must return false */
    assert.equal(is.null({}), false);
    assert.equal(is.null(class {}), false);
    assert.equal(is.null(() => {}), false);
    assert.equal(is.null(function () {}), false);
    assert.equal(is.null(undefined), false);
    assert.equal(is.null(true), false);
    assert.equal(is.null(""), false);
    assert.equal(is.null(" "), false);
    assert.equal(is.null(0), false);
    assert.equal(is.null(false), false);
  });

  it("stringEmpty", () => {

    /** Must return true */
    assert.equal(is.stringEmpty(""), true);
    assert.equal(is.stringEmpty(" "), true);

    /** Must return false */
    assert.equal(is.stringEmpty(null), false);
    assert.equal(is.stringEmpty(undefined), false);
    assert.equal(is.stringEmpty({}), false);
    assert.equal(is.stringEmpty(class {}), false);
    assert.equal(is.stringEmpty(() => {}), false);
    assert.equal(is.stringEmpty(function () {}), false);
    assert.equal(is.stringEmpty(true), false);
    assert.equal(is.stringEmpty(0), false);
    assert.equal(is.stringEmpty(false), false);
  });
});