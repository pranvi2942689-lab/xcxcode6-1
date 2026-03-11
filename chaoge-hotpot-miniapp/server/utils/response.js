function sendSuccess(res, data, message = 'success') {
  res.status(200).json({
    code: 0,
    message,
    data
  });
}

function sendError(res, statusCode = 500, message = 'server error', data = null) {
  res.status(statusCode).json({
    code: statusCode,
    message,
    data
  });
}

module.exports = {
  sendSuccess,
  sendError
};
