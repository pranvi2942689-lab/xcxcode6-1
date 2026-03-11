const { sendError } = require('../utils/response');

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'server error';
  sendError(res, statusCode, message);
}

module.exports = errorHandler;
