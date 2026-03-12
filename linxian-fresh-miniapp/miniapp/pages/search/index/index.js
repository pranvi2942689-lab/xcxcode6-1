const api = require("../../../services/api");
const auth = require("../../../utils/auth");
const cart = require("../../../utils/cart");
const storage = require("../../../utils/storage");

Page({
  data: {
    keyword: "",
    history: [],
    hotKeywords: ["菠菜", "脐橙", "肥牛卷", "鲜牛奶"],
    result: []
  },

  onShow() {
    this.setData({
      history: storage.getSearchHistory()
    });
  },

  onKeywordChange(event) {
    this.setData({ keyword: event.detail });
  },

  async onSearch(event) {
    const keyword = event.detail || this.data.keyword;
    if (!keyword) {
      return;
    }
    const searchHistory = storage.getSearchHistory().filter((item) => item !== keyword);
    searchHistory.unshift(keyword);
    storage.setSearchHistory(searchHistory.slice(0, 8));
    const result = await api.searchGoods({
      keyword,
      pageSize: 20
    });
    this.setData({
      keyword,
      result: result.list || [],
      history: searchHistory.slice(0, 8)
    });
  },

  tapHistory(event) {
    const keyword = event.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.onSearch({ detail: keyword });
  },

  goDetail(event) {
    wx.navigateTo({ url: `/pages/goods/detail/index?id=${event.detail.id}` });
  },

  async addCart(event) {
    if (!(await auth.ensureLogin())) {
      return;
    }
    await cart.addCart(event.detail.id, 1, event.detail.specText);
    wx.showToast({ title: "已加入购物车", icon: "success" });
  }
});
