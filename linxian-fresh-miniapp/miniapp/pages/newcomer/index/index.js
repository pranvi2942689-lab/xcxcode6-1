const api = require("../../../services/api");
const auth = require("../../../utils/auth");

Page({
  data: {
    coupons: []
  },
  async onShow() {
    if (!(await auth.ensureLogin())) {
      return;
    }
    const center = await api.getCouponCenter();
    this.setData({
      coupons: center.filter((item) => ["cp1001", "cp1002", "cp1004"].includes(item.id))
    });
  },
  async claimAll() {
    for (const coupon of this.data.coupons) {
      if (!coupon.claimed && coupon.status === "active") {
        await api.claimCoupon({ couponId: coupon.id });
      }
    }
    wx.showToast({ title: "礼包已领取", icon: "success" });
    const center = await api.getCouponCenter();
    this.setData({
      coupons: center.filter((item) => ["cp1001", "cp1002", "cp1004"].includes(item.id))
    });
  }
});
