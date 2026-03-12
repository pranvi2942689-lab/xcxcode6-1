const api = require("../../../services/api");

Page({
  data: {
    list: []
  },
  async onShow() {
    const data = await api.getContentList({
      pageSize: 20,
      publishedOnly: true
    });
    this.setData({ list: data.list || [] });
  },
  openDetail(event) {
    const item = event.currentTarget.dataset.item;
    const page = item.type === "activity" ? "/pages/activity/detail/index" : "/pages/content/detail/index";
    wx.navigateTo({ url: `${page}?id=${item.id}` });
  }
});
