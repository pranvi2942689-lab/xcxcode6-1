const api = require("../../../services/api");

Page({
  data: {
    list: []
  },
  async onShow() {
    const list = await api.getFavorites();
    this.setData({ list });
  },
  goDetail(event) {
    wx.navigateTo({ url: `/pages/goods/detail/index?id=${event.detail.id}` });
  },
  async addCart(event) {
    await api.toggleFavorite({ goodsId: event.detail.id });
    const list = await api.getFavorites();
    this.setData({ list });
    wx.showToast({ title: "已取消收藏", icon: "none" });
  }
});
