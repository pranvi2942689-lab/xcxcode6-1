const dataService = require("./dataService");
const { AppError } = require("../utils/errors");
const { paginate } = require("../utils/pagination");

function sortBySortAndTime(list) {
  return [...list].sort((a, b) => {
    if ((a.sort || 0) !== (b.sort || 0)) {
      return (a.sort || 0) - (b.sort || 0);
    }
    return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
  });
}

function normalizeGoods(goods) {
  return {
    ...goods,
    statusText: goods.isOffline ? "已下架" : goods.stock <= 0 ? "已售罄" : "在售",
    isSoldOut: goods.stock <= 0
  };
}

async function getPublicConfig() {
  const systemConfig = await dataService.read("systemConfig", {});
  return {
    brandName: "邻鲜到家",
    theme: systemConfig.theme || {
      primaryColor: "#22B45A",
      primaryDark: "#18964A",
      pageBg: "#F6F7F9"
    },
    homeNotice: systemConfig.homeNotice || "新鲜直采，最快 30 分钟送达",
    customerServiceText: systemConfig.customerServiceText || "在线客服 08:00-22:00",
    deliverySlots: systemConfig.deliverySlots || [],
    quickEntries: systemConfig.quickEntries || [],
    newcomerCoupons: systemConfig.newcomerCoupons || [],
    systemConfig: {
      minOrderAmount: systemConfig.minOrderAmount || 39,
      defaultDeliveryFee: systemConfig.defaultDeliveryFee || 4
    }
  };
}

async function getCommunities(query = {}) {
  const communities = await dataService.read("communities", []);
  const keyword = String(query.keyword || "").trim();
  let list = communities;

  if (keyword) {
    list = list.filter((item) => item.name.includes(keyword) || item.district.includes(keyword));
  }

  return sortBySortAndTime(list);
}

async function getBanners(query = {}) {
  const banners = await dataService.read("banners", []);
  const communityId = query.communityId;
  let list = banners.filter((item) => item.isActive !== false);

  if (communityId) {
    list = list.filter((item) => !item.communityIds || !item.communityIds.length || item.communityIds.includes(communityId));
  }

  return sortBySortAndTime(list);
}

async function getSections(query = {}) {
  const [sections, goods, contents] = await Promise.all([
    dataService.read("sections", []),
    dataService.read("goods", []),
    dataService.read("contents", [])
  ]);

  const communityId = query.communityId;
  const goodsMap = new Map(goods.map((item) => [item.id, normalizeGoods(item)]));
  const contentMap = new Map(contents.map((item) => [item.id, item]));

  return sortBySortAndTime(sections)
    .filter((section) => section.isActive !== false)
    .filter((section) => !communityId || !section.communityIds || !section.communityIds.length || section.communityIds.includes(communityId))
    .map((section) => ({
      ...section,
      goodsList: (section.goodsIds || []).map((id) => goodsMap.get(id)).filter(Boolean),
      contentList: (section.contentIds || []).map((id) => contentMap.get(id)).filter(Boolean)
    }));
}

async function getCategories() {
  const categories = await dataService.read("categories", []);
  return sortBySortAndTime(categories).filter((item) => item.isActive !== false);
}

async function listGoods(query = {}) {
  const goods = await dataService.read("goods", []);
  let list = goods.filter((item) => item.isDeleted !== true);

  if (query.keyword) {
    const keyword = String(query.keyword).trim();
    list = list.filter((item) => item.name.includes(keyword) || item.subtitle.includes(keyword) || item.tags.join(" ").includes(keyword));
  }

  if (query.categoryId) {
    list = list.filter((item) => item.categoryId === query.categoryId);
  }

  if (query.sectionType) {
    list = list.filter((item) => (item.sectionTypes || []).includes(query.sectionType));
  }

  if (query.communityId) {
    list = list.filter((item) => !item.communityIds || item.communityIds.includes(query.communityId));
  }

  if (query.onlyAvailable !== "false") {
    list = list.filter((item) => item.isOffline !== true);
  }

  const sortType = query.sortType || "comprehensive";
  list = [...list].sort((a, b) => {
    if (sortType === "sales") {
      return b.soldCount - a.soldCount;
    }
    if (sortType === "priceAsc") {
      return a.price - b.price;
    }
    if (sortType === "priceDesc") {
      return b.price - a.price;
    }
    if ((a.sort || 0) !== (b.sort || 0)) {
      return (a.sort || 0) - (b.sort || 0);
    }
    return b.soldCount - a.soldCount;
  });

  const mapped = list.map(normalizeGoods);
  return paginate(mapped, query);
}

async function getGoodsDetail(id) {
  const goods = await dataService.read("goods", []);
  const item = goods.find((record) => record.id === id);

  if (!item) {
    throw new AppError("商品不存在", 404);
  }

  const categories = await dataService.read("categories", []);
  const category = categories.find((record) => record.id === item.categoryId);
  return {
    ...normalizeGoods(item),
    category
  };
}

async function searchGoods(query = {}) {
  return listGoods({
    ...query,
    sortType: query.sortType || "sales"
  });
}

module.exports = {
  getPublicConfig,
  getCommunities,
  getBanners,
  getSections,
  getCategories,
  listGoods,
  getGoodsDetail,
  searchGoods
};
