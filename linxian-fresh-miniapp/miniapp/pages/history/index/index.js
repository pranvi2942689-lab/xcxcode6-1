const api = require("../../../services/api");

Page({
  data: {
    list: []
  },
  async onShow() {
    const list = await api.getHistory();
    this.setData({ list });
  },
  goDetail(event) {
    wx.navigateTo({ url: `/pages/goods/detail/index?id=${event.detail.id}` });
  }
});
