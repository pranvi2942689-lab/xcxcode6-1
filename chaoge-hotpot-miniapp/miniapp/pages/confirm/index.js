const api = require('../../services/api');
const storage = require('../../utils/storage');
const { formatAmount } = require('../../utils/format');

Page({
  data: {
    cartItems: [],
    peopleCount: 2,
    remark: '',
    totalAmountText: '0.00',
    submitting: false,
    submitError: ''
  },

  onShow() {
    this.loadCart();
  },

  loadCart() {
    const cartItems = storage.getCart();
    const summary = storage.getCartSummary();

    this.setData({
      cartItems,
      totalAmountText: formatAmount(summary.totalAmount),
      submitError: ''
    });
  },

  handleCartQuantityChange(event) {
    const currentItem = this.data.cartItems[event.currentTarget.dataset.index];

    if (!currentItem) {
      return;
    }

    storage.updateCartItem(currentItem, event.detail.value);
    this.loadCart();
  },

  handlePeopleCountChange(event) {
    this.setData({
      peopleCount: event.detail.value
    });
  },

  handleRemarkInput(event) {
    this.setData({
      remark: event.detail.value
    });
  },

  async handleSubmitOrder() {
    if (!this.data.cartItems.length || this.data.submitting) {
      return;
    }

    this.setData({
      submitting: true,
      submitError: ''
    });

    try {
      const order = await api.createOrder({
        items: this.data.cartItems.map((item) => ({
          dishId: item.dishId,
          quantity: item.quantity
        })),
        peopleCount: this.data.peopleCount,
        remark: this.data.remark.trim()
      });

      storage.clearCart();
      wx.redirectTo({
        url: `/pages/order-detail/index?id=${order.id}`
      });
    } catch (error) {
      this.setData({
        submitting: false,
        submitError: error.message || '订单提交失败'
      });
    }
  },

  goMenu() {
    wx.switchTab({
      url: '/pages/menu/index'
    });
  }
});
