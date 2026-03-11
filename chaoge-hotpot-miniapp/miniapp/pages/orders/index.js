const api = require('../../services/api');
const {
  formatAmount,
  formatDateTime,
  summarizeOrderItems
} = require('../../utils/format');

function getErrorType(error) {
  const message = (error && error.message) || '';
  return message.includes('request:fail') ? 'network' : 'error';
}

Page({
  data: {
    loading: true,
    errorType: '',
    orders: []
  },

  onLoad() {
    this.fetchOrders();
  },

  onShow() {
    this.fetchOrders();
  },

  onPullDownRefresh() {
    this.fetchOrders(true);
  },

  async fetchOrders(stopRefreshAfterDone = false) {
    const shouldStopRefresh = stopRefreshAfterDone === true;

    this.setData({
      loading: true,
      errorType: ''
    });

    try {
      const orders = await api.getOrders();
      const normalizedOrders = orders.map((order) => ({
        ...order,
        totalAmountText: formatAmount(order.totalAmount),
        createdAtText: formatDateTime(order.createdAt),
        itemSummary: summarizeOrderItems(order.items)
      }));

      this.setData({
        loading: false,
        orders: normalizedOrders
      });
    } catch (error) {
      this.setData({
        loading: false,
        errorType: getErrorType(error)
      });
    } finally {
      if (shouldStopRefresh) {
        wx.stopPullDownRefresh();
      }
    }
  },

  openOrderDetail(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order-detail/index?id=${id}`
    });
  },

  goMenu() {
    wx.switchTab({
      url: '/pages/menu/index'
    });
  }
});
