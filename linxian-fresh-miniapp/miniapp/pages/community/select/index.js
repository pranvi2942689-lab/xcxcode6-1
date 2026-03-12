const api = require("../../../services/api");
const storage = require("../../../utils/storage");

Page({
  data: {
    keyword: "",
    list: [],
    currentId: ""
  },

  async onLoad() {
    const current = storage.getCurrentCommunity();
    const list = await api.getCommunities();
    this.setData({
      list,
      currentId: current ? current.id : ""
    });
  },

  onKeywordChange(event) {
    this.setData({ keyword: event.detail });
  },

  async onSearch() {
    const list = await api.getCommunities({
      keyword: this.data.keyword
    });
    this.setData({ list });
  },

  selectCommunity(event) {
    const community = event.detail;
    storage.setCurrentCommunity(community);
    getApp().setCurrentCommunity(community);
    wx.showToast({ title: "切换成功", icon: "success" });
    setTimeout(() => wx.navigateBack(), 400);
  }
});
