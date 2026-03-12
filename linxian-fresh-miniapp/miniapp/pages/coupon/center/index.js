const api = require("../../../services/api");
const auth = require("../../../utils/auth");

Page({
  data: {
    list: []
  },

  async onShow() {
    if (!(await auth.ensureLogin())) {
      return;
    }
    const list = await api.getCouponCenter();
    this.setData({ list });
  },

  async claimCoupon(event) {
    const coupon = event.detail;
    if (coupon.claimed || coupon.status !== "active") {
      return;
    }
    await api.claimCoupon({ couponId: coupon.id });
    wx.showToast({ title: "领取成功", icon: "success" });
    const list = await api.getCouponCenter();
    this.setData({ list });
  }
});
