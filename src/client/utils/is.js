/* eslint eqeqeq: 0 */
module.exports.nullOrUndefined = v => {
  return v == null;
};
module.exports.undefined = v => {
  return typeof v === 'undefined';
};
module.exports.function = v => {
  return typeof v === 'function';
};
module.exports.strictObject = v => {
  return !!(v && typeof v === 'object' && v.constructor);
};
module.exports.object = v => {
  return v instanceof Object;
};
module.exports.null = v => {
  return v === null;
};
module.exports.stringEmpty = v => {
  return typeof v === 'string' && v.trim().length <= 0;
};
