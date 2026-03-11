class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function createError(statusCode, message) {
  return new HttpError(statusCode, message);
}

module.exports = {
  HttpError,
  createError
};
