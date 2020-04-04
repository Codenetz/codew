const AWS = require('aws-sdk');

module.exports = config => {
  const { accessKeyId, secretAccessKey, region } = config;

  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region
  });
  return AWS;
};
