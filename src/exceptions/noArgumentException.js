class noArgumentException extends Error {
  constructor (message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'noArgumentException';
    this.message = message || "";
  }
}
module.exports = noArgumentException;