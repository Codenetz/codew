module.exports = async (AWSClient, config, key, contentType, buffer) => {
  const { bucket, ACL } = config;

  let params = {
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType
  };

  if (ACL) params = { ...params, ACL };

  try {
    await new AWSClient.S3().putObject(params).promise();
  } catch (e) {
    console.error('S3_UPLOAD_ERROR', e);
  }
};
