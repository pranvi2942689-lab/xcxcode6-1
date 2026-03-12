class AppError extends Error {
  constructor(message, statusCode = 400, code = -1, details = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

module.exports = {
  AppError
};
