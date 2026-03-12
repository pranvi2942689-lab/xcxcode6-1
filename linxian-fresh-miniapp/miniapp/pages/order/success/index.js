Page({
  data: {
    orderNo: "",
    id: ""
  },
  onLoad(options) {
    this.setData({
      orderNo: options.orderNo || "",
      id: options.id || ""
    });
  },
  goOrder() {
    wx.redirectTo({ url: `/pages/order/detail/index?id=${this.data.id}` });
  },
  goHome() {
    wx.switchTab({ url: "/pages/home/index/index" });
  }
});
