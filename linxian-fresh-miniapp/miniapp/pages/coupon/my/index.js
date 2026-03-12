const api = require("../../../services/api");
const storage = require("../../../utils/storage");

Page({
  data: {
    list: [],
    selectMode: false
  },

  onLoad(options) {
    this.setData({
      selectMode: options.selectMode === "1"
    });
  },

  async onShow() {
    const list = await api.getMyCoupons();
    this.setData({ list });
  },

  chooseCoupon(event) {
    if (!this.data.selectMode) {
      return;
    }
    const coupon = event.detail;
    if (coupon.status !== "available") {
      return;
    }
    storage.setSelectedCoupon(coupon);
    wx.navigateBack();
  }
});
