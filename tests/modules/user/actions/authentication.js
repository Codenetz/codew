let request = require('supertest'),
  assert = require('chai').assert;

module.exports = app => {
  let username = 'auth-test-' + String(Math.floor(Date.now() / 1000)),
    password = 'test',
    email = username + '@';

  describe('POST /api/v1/authenticate', function() {
    it('required username', function(done) {
      request(app)
        .post('/api/v1/authenticate')
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
        .post('/api/v1/authenticate')
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

    it('wrong credentials - password', function(done) {
      request(app)
        .post('/api/v1/authenticate')
        .send({
          username: username,
          password: 'wrong'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .expect(res => {
          let { body } = res;
          assert.equal(body.error, 'Unauthorized');
        })
        .end(done);
    });

    it('wrong credentials - username', function(done) {
      request(app)
        .post('/api/v1/authenticate')
        .send({
          username: username + '-wrong',
          password: 'test'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .expect(res => {
          let { body } = res;
          assert.equal(body.error, 'Unauthorized');
        })
        .end(done);
    });

    it('wrong credentials - username, password', function(done) {
      request(app)
        .post('/api/v1/authenticate')
        .send({
          username: username + '-wrong',
          password: 'wrong'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .expect(res => {
          let { body } = res;
          assert.equal(body.error, 'Unauthorized');
        })
        .end(done);
    });

    it('authenticate successfully', function(done) {
      request(app)
        .post('/api/v1/authenticate')
        .send({
          username: username,
          password: password
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
  });
};
