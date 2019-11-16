'use strict';
let service = require('./../../../core/service'),
  env = require('./../../../../../boot/env'),
  crypto = require('crypto'),
  jwt = require('jsonwebtoken');

class userService extends service {
  decodeVerificationTokenCode(token) {
    return JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
  }

  encodeVerificationTokenCode(data) {
    return Buffer.from(JSON.stringify(data)).toString('base64');
  }

  verifyVerificationToken(token) {
    const data = this.decodeVerificationTokenCode(token);
    return (
      data &&
      data.id &&
      data.checksum &&
      this.userChecksum({ id: data.id }) === data.checksum
    );
  }

  verificationToken(user) {
    return this.encodeVerificationTokenCode({
      id: user.id,
      checksum: this.userChecksum(user)
    });
  }

  userChecksum(user) {
    return crypto
      .createHash('sha256')
      .update(user.id + env.vars.SECRET_KEY)
      .digest('hex');
  }

  passwordHash(password) {
    return crypto
      .createHash('sha256')
      .update(password + env.vars.SECRET_KEY)
      .digest('hex');
  }

  getJWT(user) {
    return jwt.sign({ id: user.id }, env.vars.SECRET_KEY);
  }

  async sendSignUpEmail(user) {
    const sendgrid = this.app.get('sendgrid');
    const { SYSTEM_EMAIL, SYSTEM_EMAIL_NAME } = env.vars;

    await sendgrid.send(
      {
        name: SYSTEM_EMAIL_NAME,
        email: SYSTEM_EMAIL
      },
      {
        name: user.username,
        email: user.email
      },
      'sign up',
      await sendgrid.emailTemplate('signup', {
        USERNAME: user.username,
        VERIFICATION_TOKEN:
          Boolean(user.verified) === false ? this.verificationToken(user) : null
      })
    );
  }

  async sendForgottenPasswordEmail(user) {
    const sendgrid = this.app.get('sendgrid');
    const { SYSTEM_EMAIL, SYSTEM_EMAIL_NAME } = env.vars;

    await sendgrid.send(
      {
        name: SYSTEM_EMAIL_NAME,
        email: SYSTEM_EMAIL
      },
      {
        name: user.username,
        email: user.email
      },
      'forgotten password',
      await sendgrid.emailTemplate('forgotten_password', {
        USERNAME: user.username,
        USER_TOKEN: this.verificationToken(user)
      })
    );
  }

  async sendPasswordChangedEmail(user) {
    const sendgrid = this.app.get('sendgrid');
    const { SYSTEM_EMAIL, SYSTEM_EMAIL_NAME } = env.vars;

    await sendgrid.send(
      {
        name: SYSTEM_EMAIL_NAME,
        email: SYSTEM_EMAIL
      },
      {
        name: user.username,
        email: user.email
      },
      'password changed',
      await sendgrid.emailTemplate('password_changed', {
        USERNAME: user.username
      })
    );
  }
}

module.exports = userService;
