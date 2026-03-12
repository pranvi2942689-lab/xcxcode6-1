const api = require("../../../services/api");
const auth = require("../../../utils/auth");

const tabs = [
  { label: "全部", value: "all" },
  { label: "待支付", value: "pending_payment" },
  { label: "待配送", value: "pending_delivery" },
  { label: "配送中", value: "delivering" },
  { label: "已完成", value: "completed" },
  { label: "已取消", value: "cancelled" },
  { label: "售后中", value: "refunding" }
];

Page({
  data: {
    tabs,
    currentStatus: "all",
    hasLogin: false,
    orders: []
  },

  async onShow() {
    const hasLogin = auth.hasLogin();
    const app = getApp();
    const currentStatus = app.globalData.orderTab || this.data.currentStatus;
    app.globalData.orderTab = "";
    this.setData({ hasLogin });
    if (currentStatus !== this.data.currentStatus) {
      this.setData({ currentStatus });
    }
    if (hasLogin) {
      this.fetchOrders();
    }
  },

  async fetchOrders() {
    const orders = await api.getOrderList({
      status: this.data.currentStatus
    });
    this.setData({ orders });
  },

  changeTab(event) {
    this.setData({ currentStatus: event.detail });
    this.fetchOrders();
  },

  openDetail(event) {
    wx.navigateTo({ url: `/pages/order/detail/index?id=${event.detail.id}` });
  },

  async handleAction(event) {
    const { action, order } = event.detail;
    if (action === "pay") {
      await api.orderPay({ orderId: order.id });
      wx.showToast({ title: "支付成功", icon: "success" });
    }
    if (action === "cancel") {
      await api.cancelOrder({ orderId: order.id, reason: "用户取消" });
      wx.showToast({ title: "已取消", icon: "success" });
    }
    if (action === "confirm") {
      await api.confirmOrder({ orderId: order.id });
      wx.showToast({ title: "已收货", icon: "success" });
    }
    if (action === "service") {
      wx.navigateTo({ url: `/pages/service/after-sale/index?orderId=${order.id}` });
      return;
    }
    this.fetchOrders();
  },

  goLogin() {
    wx.navigateTo({ url: "/pages/auth/login/index" });
  }
});
