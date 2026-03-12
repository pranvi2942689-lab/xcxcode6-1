const api = require("../../../services/api");
const cart = require("../../../utils/cart");
const auth = require("../../../utils/auth");
const storage = require("../../../utils/storage");

Page({
  data: {
    categories: [],
    currentCategoryId: "",
    currentCategory: null,
    goodsList: []
  },

  async onShow() {
    const categories = await api.getCategories();
    const currentCategoryId = this.data.currentCategoryId || (categories[0] && categories[0].id);
    const currentCategory = categories.find((item) => item.id === currentCategoryId) || null;
    this.setData({ categories, currentCategoryId, currentCategory });
    this.fetchGoods(currentCategoryId);
  },

  async fetchGoods(categoryId) {
    const community = storage.getCurrentCommunity();
    const result = await api.getGoods({
      categoryId,
      pageSize: 20,
      communityId: community && community.id
    });
    this.setData({
      goodsList: result.list || []
    });
  },

  switchCategory(event) {
    const currentCategoryId = event.currentTarget.dataset.id;
    const currentCategory = this.data.categories.find((item) => item.id === currentCategoryId) || null;
    this.setData({ currentCategoryId, currentCategory });
    this.fetchGoods(currentCategoryId);
  },

  goDetail(event) {
    const goods = event.detail;
    wx.navigateTo({ url: `/pages/goods/detail/index?id=${goods.id}` });
  },

  async addCart(event) {
    if (!(await auth.ensureLogin())) {
      return;
    }
    await cart.addCart(event.detail.id, 1, event.detail.specText);
    wx.showToast({ title: "已加入购物车", icon: "success" });
  }
});
