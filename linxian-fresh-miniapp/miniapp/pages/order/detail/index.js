const api = require("../../../services/api");

Page({
  data: {
    order: null,
    primaryVisible: false,
    primaryText: "",
    serviceVisible: false
  },

  async onLoad(options) {
    const order = await api.getOrderDetail(options.id);
    this.setOrder(order);
  },

  setOrder(order) {
    this.setData({
      order,
      primaryVisible: order.status === "pending_payment" || order.status === "delivering",
      primaryText: order.status === "pending_payment" ? "立即支付" : "确认收货",
      serviceVisible: order.status === "completed" || order.status === "refunding"
    });
  },

  async handlePrimary() {
    const order = this.data.order;
    if (order.status === "pending_payment") {
      await api.orderPay({ orderId: order.id });
      wx.showToast({ title: "支付成功", icon: "success" });
    }
    if (order.status === "delivering") {
      await api.confirmOrder({ orderId: order.id });
      wx.showToast({ title: "已收货", icon: "success" });
    }
    const refreshed = await api.getOrderDetail(order.id);
    this.setOrder(refreshed);
  },

  goService() {
    wx.navigateTo({ url: `/pages/service/after-sale/index?orderId=${this.data.order.id}` });
  }
});
