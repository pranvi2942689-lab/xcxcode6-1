const dataService = require("./dataService");
const { AppError } = require("../utils/errors");
const { genId } = require("../utils/id");

function buildUserToken(userId) {
  return `user-${userId}`;
}

function buildAdminToken(adminId) {
  return `admin-${adminId}`;
}

async function loginUser(payload = {}) {
  const users = await dataService.read("users", []);
  const phone = payload.phone || "13800000001";
  let user = users.find((item) => item.phone === phone);

  if (!user) {
    user = {
      id: genId("user"),
      nickname: payload.nickname || `邻鲜用户${users.length + 1}`,
      phone,
      avatar: "/static/mock/avatar-default.svg",
      favoriteIds: [],
      history: [],
      couponIds: [],
      communityId: "c1001",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.unshift(user);
    await dataService.write("users", users);
  }

  return {
    token: buildUserToken(user.id),
    user
  };
}

async function loginAdmin({ account, password }) {
  const admins = await dataService.read("admins", []);
  const admin = admins.find((item) => item.account === account && item.password === password);

  if (!admin) {
    throw new AppError("账号或密码错误", 401);
  }

  return {
    token: buildAdminToken(admin.id),
    admin: {
      ...admin,
      password: undefined
    }
  };
}

async function getUserByToken(token) {
  if (!token.startsWith("user-")) {
    return null;
  }

  const userId = token.slice(5);
  const users = await dataService.read("users", []);
  return users.find((item) => item.id === userId) || null;
}

async function getAdminByToken(token) {
  if (!token.startsWith("admin-")) {
    return null;
  }

  const adminId = token.slice(6);
  const admins = await dataService.read("admins", []);
  const admin = admins.find((item) => item.id === adminId);
  return admin ? { ...admin, password: undefined } : null;
}

module.exports = {
  buildUserToken,
  buildAdminToken,
  loginUser,
  loginAdmin,
  getUserByToken,
  getAdminByToken
};
