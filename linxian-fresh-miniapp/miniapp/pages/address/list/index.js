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
    const list = await api.getAddressList();
    this.setData({ list });
  },

  selectAddress(event) {
    const address = event.detail;
    if (this.data.selectMode) {
      storage.setCurrentAddress(address);
      wx.navigateBack();
      return;
    }
  },

  editAddress(event) {
    wx.navigateTo({ url: `/pages/address/edit/index?id=${event.detail.id}` });
  },

  addAddress() {
    wx.navigateTo({ url: "/pages/address/edit/index" });
  }
});
