const api = require("../services/api");
const storage = require("./storage");

async function loginWithMock(payload = {}) {
  const result = await api.login(payload);
  storage.setToken(result.token);
  storage.setUserProfile(result.user);
  return result;
}

function hasLogin() {
  return Boolean(storage.getToken());
}

async function ensureLogin() {
  if (hasLogin()) {
    return true;
  }
  wx.navigateTo({
    url: "/pages/auth/login/index"
  });
  return false;
}

function logout() {
  storage.remove("token");
  storage.remove("userProfile");
  storage.remove("currentAddress");
  storage.remove("selectedCoupon");
}

module.exports = {
  loginWithMock,
  hasLogin,
  ensureLogin,
  logout
};
