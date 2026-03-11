const { createError } = require('../utils/errors');

function notFound(req, res, next) {
  next(createError(404, 'api not found'));
}

module.exports = notFound;
