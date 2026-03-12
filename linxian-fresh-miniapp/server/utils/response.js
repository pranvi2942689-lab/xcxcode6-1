function sendSuccess(res, data = null, message = "success") {
  return res.json({
    code: 0,
    message,
    data
  });
}

function sendFail(res, message = "error", code = -1, statusCode = 400, details = null) {
  return res.status(statusCode).json({
    code,
    message,
    data: details
  });
}

module.exports = {
  sendSuccess,
  sendFail
};
