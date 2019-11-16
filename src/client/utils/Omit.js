export default (object, keys) => {
  keys.filter(k => object[k] !== undefined).forEach(k => delete object[k]);
  return object;
};
