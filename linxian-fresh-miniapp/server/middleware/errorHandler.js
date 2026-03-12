const { sendFail } = require("../utils/response");

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Server Error";
  const code = typeof error.code === "number" ? error.code : -1;
  const details = error.details || null;

  if (statusCode >= 500) {
    console.error("[server:error]", error);
  }

  return sendFail(res, message, code, statusCode, details);
}

module.exports = errorHandler;
