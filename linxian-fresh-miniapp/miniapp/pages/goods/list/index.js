const api = require("../../../services/api");
const auth = require("../../../utils/auth");
const cart = require("../../../utils/cart");
const storage = require("../../../utils/storage");

const tabs = [
  { label: "综合", value: "comprehensive" },
  { label: "销量", value: "sales" },
  { label: "价格低", value: "priceAsc" },
  { label: "价格高", value: "priceDesc" }
];

Page({
  data: {
    title: "商品列表",
    tabs,
    sortType: "comprehensive",
    categoryId: "",
    sectionType: "",
    keyword: "",
    goodsList: []
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.title || "商品列表"
    });
    this.setData({
      title: options.title || "商品列表",
      categoryId: options.categoryId || "",
      sectionType: options.sectionType || "",
      keyword: options.keyword || ""
    });
    this.fetchGoods();
  },

  async fetchGoods() {
    const community = storage.getCurrentCommunity();
    const result = await api.getGoods({
      categoryId: this.data.categoryId,
      sectionType: this.data.sectionType,
      keyword: this.data.keyword,
      sortType: this.data.sortType,
      pageSize: 30,
      communityId: community && community.id
    });
    this.setData({
      goodsList: result.list || []
    });
  },

  changeTab(event) {
    this.setData({ sortType: event.detail });
    this.fetchGoods();
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
