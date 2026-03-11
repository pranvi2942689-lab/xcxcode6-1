const api = require('../../services/api');

function getErrorType(error) {
  const message = (error && error.message) || '';
  return message.includes('request:fail') ? 'network' : 'error';
}

Page({
  data: {
    loading: true,
    errorType: '',
    storeConfig: null,
    brandIntro: ''
  },

  onLoad() {
    this.setData({
      brandIntro: getApp().globalData.brandIntro
    });
    this.fetchStoreConfig();
  },

  onPullDownRefresh() {
    this.fetchStoreConfig(true);
  },

  async fetchStoreConfig(stopRefreshAfterDone = false) {
    const shouldStopRefresh = stopRefreshAfterDone === true;

    this.setData({
      loading: true,
      errorType: ''
    });

    try {
      const storeConfig = await api.getStore();
      this.setData({
        loading: false,
        storeConfig
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

  callStore() {
    if (!this.data.storeConfig || !this.data.storeConfig.phone) {
      return;
    }

    wx.makePhoneCall({
      phoneNumber: this.data.storeConfig.phone
    });
  },

  goOrders() {
    wx.navigateTo({
      url: '/pages/orders/index'
    });
  }
});
