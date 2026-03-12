const api = require("../../../services/api");
const auth = require("../../../utils/auth");
const cart = require("../../../utils/cart");

Page({
  data: {
    goods: null,
    quantity: 1,
    popupVisible: false,
    isFavorite: false,
    maxStock: 1
  },

  async onLoad(options) {
    const goods = await api.getGoodsDetail(options.id);
    this.setData({
      goods,
      isFavorite: false,
      maxStock: goods.stock || 1
    });
    if (auth.hasLogin()) {
      try {
        await api.addHistory({ goodsId: options.id });
      } catch (error) {
        console.error(error);
      }
    }
  },

  changeQuantity(event) {
    this.setData({ quantity: event.detail });
  },

  showPopup() {
    this.setData({ popupVisible: true });
  },

  hidePopup() {
    this.setData({ popupVisible: false });
  },

  async toggleFavorite() {
    if (!(await auth.ensureLogin())) {
      return;
    }
    const result = await api.toggleFavorite({ goodsId: this.data.goods.id });
    this.setData({ isFavorite: result.isFavorite });
  },

  async addToCart() {
    if (!(await auth.ensureLogin())) {
      return;
    }
    await cart.addCart(this.data.goods.id, this.data.quantity, this.data.goods.specText);
    this.hidePopup();
    wx.showToast({ title: "已加入购物车", icon: "success" });
  },

  async buyNow() {
    if (!(await auth.ensureLogin())) {
      return;
    }
    wx.navigateTo({
      url: `/pages/checkout/index/index?goodsId=${this.data.goods.id}&quantity=${this.data.quantity}`
    });
  }
});
