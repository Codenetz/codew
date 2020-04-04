function removeUndefined(data) {
  Object.keys(data).forEach(param_key => {
    if (typeof data[param_key] === 'undefined') {
      delete data[param_key];
    }
  });

  return data;
}

module.exports = removeUndefined;
