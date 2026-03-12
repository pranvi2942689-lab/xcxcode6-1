const api = require("../../../services/api");
const auth = require("../../../utils/auth");
const storage = require("../../../utils/storage");

Page({
  data: {
    userProfile: null,
    hasLogin: false,
    avatarUrl: "",
    stats: {
      couponCount: 0,
      favoriteCount: 0,
      orderCount: 0
    },
    menus: [
      { title: "地址管理", url: "/pages/address/list/index" },
      { title: "我的优惠券", url: "/pages/coupon/my/index" },
      { title: "收藏商品", url: "/pages/favorite/index/index" },
      { title: "最近浏览", url: "/pages/history/index/index" },
      { title: "售后反馈", url: "/pages/service/after-sale/index" },
      { title: "公告活动", url: "/pages/content/notice/index" },
      { title: "设置", url: "/pages/profile/settings/index" }
    ]
  },

  async onShow() {
    const hasLogin = auth.hasLogin();
    this.setData({
      hasLogin,
      userProfile: storage.getUserProfile(),
      avatarUrl: (storage.getUserProfile() && storage.getUserProfile().avatar) || "",
      stats: {
        couponCount: (storage.getUserProfile() && storage.getUserProfile().couponCount) || 0,
        favoriteCount: (storage.getUserProfile() && storage.getUserProfile().favoriteCount) || 0,
        orderCount: (storage.getUserProfile() && storage.getUserProfile().orderCount) || 0
      }
    });
    if (hasLogin) {
      const profile = await api.getUserProfile();
      storage.setUserProfile(profile);
      this.setData({
        userProfile: profile,
        avatarUrl: profile.avatar || "",
        stats: {
          couponCount: profile.couponCount || 0,
          favoriteCount: profile.favoriteCount || 0,
          orderCount: profile.orderCount || 0
        }
      });
    }
  },

  goLogin() {
    wx.navigateTo({ url: "/pages/auth/login/index" });
  },

  goMenu(event) {
    wx.navigateTo({ url: event.currentTarget.dataset.url });
  },

  goOrders(event) {
    const status = event.currentTarget.dataset.status || "all";
    wx.switchTab({ url: "/pages/order/index/index" });
    const app = getApp();
    app.globalData.orderTab = status;
  },

  goCouponCenter() {
    wx.navigateTo({ url: "/pages/coupon/center/index" });
  },

  goNewcomer() {
    wx.navigateTo({ url: "/pages/newcomer/index/index" });
  }
});
