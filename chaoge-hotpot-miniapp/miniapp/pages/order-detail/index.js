const api = require('../../services/api');
const {
  formatAmount,
  formatDateTime,
  getOrderStatusText
} = require('../../utils/format');

function getErrorType(error) {
  const message = (error && error.message) || '';
  return message.includes('request:fail') ? 'network' : 'error';
}

Page({
  data: {
    loading: true,
    errorType: '',
    order: null
  },

  onLoad(options) {
    this.orderId = options.id || '';
    this.fetchOrderDetail();
  },

  async fetchOrderDetail() {
    if (!this.orderId) {
      this.setData({
        loading: false,
        errorType: 'error'
      });
      return;
    }

    this.setData({
      loading: true,
      errorType: ''
    });

    try {
      const order = await api.getOrderDetail(this.orderId);
      const normalizedOrder = {
        ...order,
        statusText: getOrderStatusText(order.status),
        remarkText: order.remark || '未填写备注',
        totalAmountText: formatAmount(order.totalAmount),
        createdAtText: formatDateTime(order.createdAt),
        items: order.items.map((item) => ({
          ...item,
          lineAmountText: formatAmount(item.price * item.quantity)
        }))
      };

      this.setData({
        loading: false,
        order: normalizedOrder
      });
    } catch (error) {
      this.setData({
        loading: false,
        errorType: getErrorType(error)
      });
    }
  }
});
