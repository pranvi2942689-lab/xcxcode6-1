const api = require("../../../services/api");
const storage = require("../../../utils/storage");
const auth = require("../../../utils/auth");
const cart = require("../../../utils/cart");

Page({
  data: {
    loading: true,
    banners: [],
    sections: [],
    currentCommunity: null,
    quickEntries: [],
    noticeText: "",
    newcomerCards: [
      { id: "n1", title: "10 元新人券", desc: "满 39 可用" },
      { id: "n2", title: "20 元券包", desc: "首单立减" },
      { id: "n3", title: "50 元礼券", desc: "专区组合券" }
    ]
  },

  onShow() {
    const currentCommunity = storage.getCurrentCommunity();
    this.setData({ currentCommunity });
    this.fetchPageData();
  },

  async fetchPageData() {
    try {
      const community = storage.getCurrentCommunity();
      const [config, banners, sections, notices] = await Promise.all([
        api.getConfig(),
        api.getBanners({ communityId: community && community.id }),
        api.getSections({ communityId: community && community.id }),
        api.getContentList({ type: "notice", pageSize: 1 })
      ]);
      this.setData({
        loading: false,
        quickEntries: config.quickEntries || [],
        banners,
        sections,
        noticeText: notices.list && notices.list[0] ? notices.list[0].title : config.homeNotice,
        currentCommunity: community
      });
    } catch (error) {
      console.error(error);
      this.setData({ loading: false });
    }
  },

  goCommunity() {
    wx.navigateTo({ url: "/pages/community/select/index" });
  },

  goSearch() {
    wx.navigateTo({ url: "/pages/search/index/index" });
  },

  handleEntry(event) {
    const entry = event.currentTarget.dataset.item;
    if (entry.target === "coupon_center") {
      wx.navigateTo({ url: "/pages/coupon/center/index" });
      return;
    }
    if (entry.target === "flash_sale") {
      wx.navigateTo({ url: "/pages/goods/list/index?sectionType=flash_sale&title=限时秒杀" });
      return;
    }
    wx.navigateTo({
      url: `/pages/goods/list/index?categoryId=${entry.target}&title=${entry.title}`
    });
  },

  openBanner(event) {
    const item = event.detail;
    if (item.linkType === "category") {
      wx.navigateTo({ url: `/pages/goods/list/index?categoryId=${item.linkValue}&title=${item.title}` });
      return;
    }
    if (item.linkType === "goodsList") {
      wx.navigateTo({ url: `/pages/goods/list/index?sectionType=${item.linkValue}&title=${item.title}` });
      return;
    }
    if (item.linkType === "content") {
      wx.navigateTo({ url: `/pages/content/detail/index?id=${item.linkValue}` });
      return;
    }
    if (item.linkType === "newcomer") {
      wx.navigateTo({ url: "/pages/newcomer/index/index" });
    }
  },

  goGoods(event) {
    const goods = event.detail;
    wx.navigateTo({ url: `/pages/goods/detail/index?id=${goods.id}` });
  },

  async addCart(event) {
    if (!(await auth.ensureLogin())) {
      return;
    }
    await cart.addCart(event.detail.id, 1, event.detail.specText);
    wx.showToast({ title: "已加入购物车", icon: "success" });
  },

  goSection(event) {
    const item = event.currentTarget.dataset.item;
    if (!item) {
      return;
    }
    if (item.type === "marketing") {
      wx.navigateTo({ url: "/pages/content/notice/index" });
      return;
    }
    wx.navigateTo({ url: `/pages/goods/list/index?sectionType=${item.type}&title=${item.title}` });
  },

  goNotice() {
    wx.navigateTo({ url: "/pages/content/notice/index" });
  },

  goNewcomer() {
    wx.navigateTo({ url: "/pages/newcomer/index/index" });
  }
});
