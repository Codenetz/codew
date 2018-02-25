let
  request = require('supertest'),
  assert = require("chai").assert;

module.exports = (app) => {

  describe('GET /example', function() {
    it('should get an example response', function(done) {
      request(app)
        .get('/example')
        .expect('Content-Type', /json/)
        .expect('Content-Length', '25')
        .expect(200)
        .expect((res) => {
          let {body} = res;
          assert.equal(JSON.stringify(body), JSON.stringify({data: {"success": true}}));
        })
        .end(done);
    });
  });
};