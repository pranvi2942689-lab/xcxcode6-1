const { API_BASE_URL, REQUEST_TIMEOUT } = require("../config");
const storage = require("./storage");

function normalizeAssets(payload) {
  if (Array.isArray(payload)) {
    return payload.map(normalizeAssets);
  }
  if (payload && typeof payload === "object") {
    const next = {};
    Object.keys(payload).forEach((key) => {
      next[key] = normalizeAssets(payload[key]);
    });
    return next;
  }
  if (typeof payload === "string" && payload.startsWith("/static/")) {
    return `${API_BASE_URL}${payload}`;
  }
  return payload;
}

function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || "GET",
      data: options.data || {},
      timeout: REQUEST_TIMEOUT,
      header: {
        "content-type": "application/json",
        ...(options.auth ? { Authorization: `Bearer ${storage.getToken()}` } : {}),
        ...(options.header || {})
      },
      success(res) {
        const result = res.data || {};
        if (result.code === 0) {
          resolve(normalizeAssets(result.data));
          return;
        }
        wx.showToast({
          title: result.message || "请求失败",
          icon: "none"
        });
        reject(result);
      },
      fail(error) {
        wx.showToast({
          title: "网络异常，请稍后再试",
          icon: "none"
        });
        reject(error);
      }
    });
  });
}

module.exports = request;
