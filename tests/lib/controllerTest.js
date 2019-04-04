let assert = require('chai').assert,
  controllerMock = require('../mocks/controllerMock'),
  responseMock = require('../mocks/responseMock'),
  applicationMock = require('../mocks/applicationMock');

describe('controller', function() {
  it('response (default response)', () => {
    let res = new responseMock();
    new controllerMock(new applicationMock(), true).response(res);

    assert.equal(res.status_code, 200);
    assert.equal(
      JSON.stringify(res.json_data),
      JSON.stringify({
        data: {}
      })
    );
  });

  it('response (custom response)', () => {
    let res = new responseMock();
    new controllerMock(new applicationMock(), true).response(
      res,
      {
        items: []
      },
      201
    );

    assert.equal(res.status_code, 201);
    assert.equal(
      JSON.stringify(res.json_data),
      JSON.stringify({
        data: {
          items: []
        }
      })
    );
  });
});
