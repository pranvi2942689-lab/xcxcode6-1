const { AppError } = require("../utils/errors");
const authService = require("../services/authService");

function parseBearerToken(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return "";
  }
  return authHeader.slice(7).trim();
}

async function optionalUserAuth(req, res, next) {
  const token = parseBearerToken(req);
  if (!token) {
    req.user = null;
    return next();
  }

  req.user = await authService.getUserByToken(token);
  return next();
}

async function requireUserAuth(req, res, next) {
  const token = parseBearerToken(req);
  if (!token) {
    return next(new AppError("请先登录", 401));
  }

  const user = await authService.getUserByToken(token);
  if (!user) {
    return next(new AppError("登录状态已失效", 401));
  }

  req.user = user;
  return next();
}

async function requireAdminAuth(req, res, next) {
  const token = parseBearerToken(req);
  if (!token) {
    return next(new AppError("请先登录后台", 401));
  }

  const admin = await authService.getAdminByToken(token);
  if (!admin) {
    return next(new AppError("后台登录状态已失效", 401));
  }

  req.admin = admin;
  return next();
}

module.exports = {
  optionalUserAuth,
  requireUserAuth,
  requireAdminAuth
};
