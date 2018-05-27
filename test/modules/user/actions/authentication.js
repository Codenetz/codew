let
  request = require('supertest'),
  assert = require("chai").assert;

module.exports = (app) => {

  describe('POST /api/v1/authenticate', function() {
    it('required username', function(done) {
      request(app)
        .post('/api/v1/authenticate')
        .expect('Content-Type', /json/)
        .expect('Content-Length', '155')
        .expect(400)
        .expect((res) => {
          let {body} = res;
          assert.equal(body.error, "Bad Request");
          assert.equal(JSON.stringify(body.validation), JSON.stringify({username:{ message: '"username" is required', type: 'any.required'}}));
        })
        .end(done);
    });

    it('required password', function(done) {
      request(app)
        .post('/api/v1/authenticate')
        .send({
          username: "test"
        })
        .expect('Content-Type', /json/)
        .expect('Content-Length', '155')
        .expect(400)
        .expect((res) => {
          let {body} = res;
          assert.equal(body.error, "Bad Request");
          assert.equal(JSON.stringify(body.validation), JSON.stringify({password:{ message: '"password" is required', type: 'any.required'}}));
        })
        .end(done);
    });

    it('wrong credentials', function(done) {
      request(app)
        .post('/api/v1/authenticate')
        .send({
          username: "test",
          password: "test"
        })
        // .expect('Content-Type', /json/)
        // .expect('Content-Length', '155')
        // .expect(400)
        .expect((res) => {
          // console.log('res', res.body);
          // let {body} = res;
          // assert.equal(body.error, "Bad Request");
          // assert.equal(JSON.stringify(body.validation), JSON.stringify({password:{ message: '"password" is required', type: 'any.required'}}));
        })
        .end(done);
    });
  });
};