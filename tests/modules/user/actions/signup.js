let request = require('supertest'),
  assert = require('chai').assert;

module.exports = app => {
  let username = 'signup-test-' + String(Math.floor(Date.now() / 1000)),
    password = 'test',
    email = username + '@';

  describe('POST /api/v1/sign-up', function() {
    it('required username', function(done) {
      request(app)
        .post('/api/v1/sign-up')
        .expect('Content-Type', /json/)
        .expect('Content-Length', '155')
        .expect(400)
        .expect(res => {
          let { body } = res;
          assert.equal(body.error, 'Bad Request');
          assert.equal(
            JSON.stringify(body.validation),
            JSON.stringify({
              username: {
                message: '"username" is required',
                type: 'any.required'
              }
            })
          );
        })
        .end(done);
    });

    it('required password', function(done) {
      request(app)
        .post('/api/v1/sign-up')
        .send({
          username: 'test'
        })
        .expect('Content-Type', /json/)
        .expect('Content-Length', '155')
        .expect(400)
        .expect(res => {
          let { body } = res;
          assert.equal(body.error, 'Bad Request');
          assert.equal(
            JSON.stringify(body.validation),
            JSON.stringify({
              password: {
                message: '"password" is required',
                type: 'any.required'
              }
            })
          );
        })
        .end(done);
    });

    it('sign up', function(done) {
      request(app)
        .post('/api/v1/sign-up')
        .send({
          username: username,
          password: password,
          email: email
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          let { body } = res;
          assert.exists(body.data.user);
          assert.exists(body.data.jwt);
          assert.equal(body.data.user.username, username);
        })
        .end(done);
    });

    it('username exists', function(done) {
      request(app)
        .post('/api/v1/sign-up')
        .send({
          username: username,
          password: password,
          email: 'another-' + email
        })
        .expect('Content-Type', /json/)
        .expect(409)
        .expect(res => {
          let { body } = res;
          assert.exists(body.message);
          assert.equal(body.message, 'user.exists');
        })
        .end(done);
    });

    it('email exists', function(done) {
      request(app)
        .post('/api/v1/sign-up')
        .send({
          username: 'another-' + username,
          password: password,
          email: email
        })
        .expect('Content-Type', /json/)
        .expect(409)
        .expect(res => {
          let { body } = res;
          assert.exists(body.message);
          assert.equal(body.message, 'user.exists');
        })
        .end(done);
    });

    it('username & email exists', function(done) {
      request(app)
        .post('/api/v1/sign-up')
        .send({
          username: username,
          password: password,
          email: email
        })
        .expect('Content-Type', /json/)
        .expect(409)
        .expect(res => {
          let { body } = res;
          assert.exists(body.message);
          assert.equal(body.message, 'user.exists');
        })
        .end(done);
    });
  });
};
