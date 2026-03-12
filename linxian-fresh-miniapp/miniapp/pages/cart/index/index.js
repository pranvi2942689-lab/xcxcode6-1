const auth = require("../../../utils/auth");
const cart = require("../../../utils/cart");

Page({
  data: {
    hasLogin: false,
    cartData: {
      items: [],
      invalidItems: [],
      summary: { totalCount: 0, totalAmount: 0 }
    }
  },

  async onShow() {
    const hasLogin = auth.hasLogin();
    this.setData({ hasLogin });
    if (hasLogin) {
      this.fetchCart();
    }
  },

  async fetchCart() {
    const cartData = await cart.fetchCart();
    this.setData({ cartData });
  },

  async changeChecked(event) {
    const item = event.currentTarget.dataset.item;
    await cart.updateCart({
      id: item.id,
      checked: !item.checked
    });
    this.fetchCart();
  },

  async changeQuantity(event) {
    const item = event.currentTarget.dataset.item;
    await cart.updateCart({
      id: item.id,
      quantity: event.detail
    });
    this.fetchCart();
  },

  async removeItem(event) {
    const item = event.currentTarget.dataset.item;
    await cart.removeCart([item.goodsId]);
    this.fetchCart();
  },

  async goCheckout() {
    if (!(await auth.ensureLogin())) {
      return;
    }
    if (!this.data.cartData.summary.totalCount) {
      wx.showToast({ title: "请先勾选商品", icon: "none" });
      return;
    }
    wx.navigateTo({ url: "/pages/checkout/index/index" });
  },

  goHome() {
    wx.switchTab({ url: "/pages/home/index/index" });
  },

  goLogin() {
    wx.navigateTo({ url: "/pages/auth/login/index" });
  }
});
