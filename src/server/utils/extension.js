module.exports.getFromMIMEType = async mime => {
  switch (mime) {
    case 'image/jpeg':
      return 'jpeg';
    case 'image/jpg':
      return 'jpeg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    case 'image/webp':
      return 'webp';
    case 'application/pdf':
      return 'pdf';
    default:
      return null;
  }
};
