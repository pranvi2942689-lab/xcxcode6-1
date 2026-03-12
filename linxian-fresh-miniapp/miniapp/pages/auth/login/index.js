const auth = require("../../../utils/auth");

Page({
  data: {
    loading: false
  },
  async mockLogin() {
    this.setData({ loading: true });
    const result = await auth.loginWithMock({
      phone: "13800000001",
      nickname: "王小满"
    });
    getApp().setUserProfile(result.user);
    wx.showToast({ title: "登录成功", icon: "success" });
    setTimeout(() => wx.navigateBack(), 400);
  }
});
