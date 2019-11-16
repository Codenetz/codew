'use strict';

let logger = require('../src/server/utils/logger'),
  env = require('./env'),
  ejs = require('ejs'),
  striptags = require('striptags'),
  sendgrid = require('@sendgrid/mail'),
  sendgridClient = require('@sendgrid/client');

const emailTemplate = async (name, data) => {
  return await ejs.renderFile(
    'src/client/views/emails/' + name + '.ejs',
    data,
    {
      async: true
    }
  );
};

module.exports = app => {
  const { SENDGRID_API_KEY } = env.vars;

  if (SENDGRID_API_KEY.length <= 0) {
    return;
  }

  logger.info('sendgrid loaded');

  sendgrid.setApiKey(SENDGRID_API_KEY);
  sendgridClient.setApiKey(SENDGRID_API_KEY);

  app.set('sendgrid', {
    _: {
      mail: sendgrid,
      client: sendgridClient
    },
    emailTemplate: emailTemplate,
    send: async (from, to, subject, message) => {
      const template = await emailTemplate('email_layout', {
        TITLE: subject,
        BODY: message
      });

      const msg = {
        to: to.email,
        from: from.email,
        subject: subject,
        text: striptags(message),
        html: template
      };

      sendgrid.send(msg);
    }
  });
};
