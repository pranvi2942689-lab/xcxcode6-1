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
    recommendBroths: [],
    signatureDishes: []
  },

  onLoad() {
    this.fetchPageData();
  },

  onPullDownRefresh() {
    this.fetchPageData(true);
  },

  async fetchPageData(stopRefreshAfterDone = false) {
    const shouldStopRefresh = stopRefreshAfterDone === true;

    this.setData({
      loading: true,
      errorType: ''
    });

    try {
      const [storeConfig, dishes] = await Promise.all([api.getStore(), api.getDishes()]);
      const recommendBroths = dishes
        .filter((dish) => dish.categoryId === 'category-broth' && dish.isRecommend)
        .slice(0, 2);
      const signatureDishes = dishes
        .filter((dish) => dish.categoryId !== 'category-broth' && dish.isRecommend)
        .slice(0, 3);

      this.setData({
        loading: false,
        errorType: '',
        storeConfig,
        recommendBroths,
        signatureDishes
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

  goMenu() {
    wx.switchTab({
      url: '/pages/menu/index'
    });
  },

  goMine() {
    wx.switchTab({
      url: '/pages/mine/index'
    });
  },

  goOrders() {
    wx.navigateTo({
      url: '/pages/orders/index'
    });
  }
});
