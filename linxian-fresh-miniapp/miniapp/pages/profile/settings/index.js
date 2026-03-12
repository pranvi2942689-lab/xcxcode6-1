const { API_BASE_URL, WECHAT_CLOUD_ENV_ID } = require("../../../config");
const storage = require("../../../utils/storage");
const auth = require("../../../utils/auth");

Page({
  data: {
    community: null,
    apiBaseUrl: API_BASE_URL,
    cloudEnvId: WECHAT_CLOUD_ENV_ID
  },
  onShow() {
    this.setData({
      community: storage.getCurrentCommunity()
    });
  },
  logout() {
    auth.logout();
    wx.showToast({ title: "已退出登录", icon: "success" });
    setTimeout(() => wx.navigateBack(), 400);
  }
});
