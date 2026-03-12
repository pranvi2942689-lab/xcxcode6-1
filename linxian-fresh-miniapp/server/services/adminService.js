const path = require("path");
const dataService = require("./dataService");
const authService = require("./authService");
const orderService = require("./orderService");
const { AppError } = require("../utils/errors");
const { paginate } = require("../utils/pagination");
const { genId } = require("../utils/id");
const { canOrderTransition } = require("../utils/orderState");

function now() {
  return new Date().toISOString();
}

function buildList(list, query = {}) {
  const keyword = String(query.keyword || "").trim();
  let nextList = [...list];
  if (keyword) {
    nextList = nextList.filter((item) => JSON.stringify(item).includes(keyword));
  }
  return paginate(nextList, query);
}

function saveRecord(list, payload, prefix) {
  const record = {
    ...payload,
    id: payload.id || genId(prefix),
    updatedAt: now(),
    createdAt: payload.createdAt || now()
  };
  const index = list.findIndex((item) => item.id === record.id);
  if (index > -1) {
    list[index] = { ...list[index], ...record };
  } else {
    list.unshift(record);
  }
  return record;
}

async function loginAdmin(payload) {
  return authService.loginAdmin(payload);
}

async function getDashboard() {
  const [goods, orders, users, serviceTickets] = await Promise.all([
    dataService.read("goods", []),
    dataService.read("orders", []),
    dataService.read("users", []),
    dataService.read("serviceTickets", [])
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const todaySales = orders
    .filter((item) => item.createdAt.slice(0, 10) === today && item.status !== "cancelled")
    .reduce((sum, item) => sum + Number(item.payableAmount || 0), 0);

  const trend = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const dailyOrders = orders.filter((item) => item.createdAt.slice(0, 10) === key);
    return {
      date: key,
      orderCount: dailyOrders.length,
      salesAmount: Number(dailyOrders.reduce((sum, item) => sum + Number(item.payableAmount || 0), 0).toFixed(2))
    };
  });

  const hotGoods = [...goods]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      name: item.name,
      soldCount: item.soldCount,
      stock: item.stock
    }));

  const orderStatus = ["pending_payment", "pending_delivery", "delivering", "completed", "cancelled", "refunding"].map((status) => ({
    status,
    count: orders.filter((item) => item.status === status).length
  }));

  return {
    summary: {
      goodsCount: goods.length,
      orderCount: orders.length,
      todaySales: Number(todaySales.toFixed(2)),
      userCount: users.length,
      pendingTickets: serviceTickets.filter((item) => item.status !== "resolved" && item.status !== "closed").length
    },
    trend,
    hotGoods,
    orderStatus
  };
}

async function listGoods(query) {
  const goods = await dataService.read("goods", []);
  let list = [...goods];
  if (query.categoryId) {
    list = list.filter((item) => item.categoryId === query.categoryId);
  }
  if (query.status === "online") {
    list = list.filter((item) => !item.isOffline);
  }
  if (query.status === "offline") {
    list = list.filter((item) => item.isOffline);
  }
  return buildList(list.sort((a, b) => (a.sort || 0) - (b.sort || 0)), query);
}

async function saveGoods(payload) {
  const goods = await dataService.read("goods", []);
  const record = saveRecord(goods, {
    ...payload,
    price: Number(payload.price || 0),
    originalPrice: Number(payload.originalPrice || 0),
    stock: Number(payload.stock || 0),
    soldCount: Number(payload.soldCount || 0),
    tags: payload.tags || [],
    images: payload.images || [],
    detailImages: payload.detailImages || [],
    communityIds: payload.communityIds || [],
    sectionTypes: payload.sectionTypes || [],
    isOffline: Boolean(payload.isOffline),
    isHot: Boolean(payload.isHot),
    isNew: Boolean(payload.isNew)
  }, "goods");
  await dataService.write("goods", goods);
  return record;
}

async function deleteGoods(id) {
  const goods = await dataService.read("goods", []);
  const nextList = goods.filter((item) => item.id !== id);
  await dataService.write("goods", nextList);
  return { id };
}

async function toggleGoods(id) {
  const goods = await dataService.read("goods", []);
  const item = goods.find((record) => record.id === id);
  if (!item) {
    throw new AppError("商品不存在", 404);
  }
  item.isOffline = !item.isOffline;
  item.updatedAt = now();
  await dataService.write("goods", goods);
  return item;
}

async function listCategories(query) {
  const categories = await dataService.read("categories", []);
  return buildList(categories.sort((a, b) => (a.sort || 0) - (b.sort || 0)), query);
}

async function saveCategory(payload) {
  const categories = await dataService.read("categories", []);
  const record = saveRecord(categories, {
    ...payload,
    isActive: payload.isActive !== false
  }, "cat");
  await dataService.write("categories", categories);
  return record;
}

async function listBanners(query) {
  const banners = await dataService.read("banners", []);
  return buildList(banners.sort((a, b) => (a.sort || 0) - (b.sort || 0)), query);
}

async function saveBanner(payload) {
  const banners = await dataService.read("banners", []);
  const record = saveRecord(banners, {
    ...payload,
    communityIds: payload.communityIds || [],
    isActive: payload.isActive !== false
  }, "banner");
  await dataService.write("banners", banners);
  return record;
}

async function listSections(query) {
  const sections = await dataService.read("sections", []);
  return buildList(sections.sort((a, b) => (a.sort || 0) - (b.sort || 0)), query);
}

async function saveSection(payload) {
  const sections = await dataService.read("sections", []);
  const record = saveRecord(sections, {
    ...payload,
    goodsIds: payload.goodsIds || [],
    contentIds: payload.contentIds || [],
    communityIds: payload.communityIds || [],
    isActive: payload.isActive !== false
  }, "section");
  await dataService.write("sections", sections);
  return record;
}

async function listOrders(query) {
  const orders = await dataService.read("orders", []);
  let list = [...orders];
  if (query.status && query.status !== "all") {
    list = list.filter((item) => item.status === query.status);
  }
  if (query.orderNo) {
    list = list.filter((item) => item.orderNo.includes(query.orderNo));
  }
  return buildList(list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))), query);
}

async function getOrderDetail(id) {
  const orders = await dataService.read("orders", []);
  const item = orders.find((record) => record.id === id);
  if (!item) {
    throw new AppError("订单不存在", 404);
  }
  return item;
}

async function updateOrderStatus(payload) {
  const orders = await dataService.read("orders", []);
  const order = orders.find((item) => item.id === payload.id);
  if (!order) {
    throw new AppError("订单不存在", 404);
  }
  if (!payload.status) {
    throw new AppError("缺少订单状态");
  }
  if (!canOrderTransition(order.status, payload.status)) {
    throw new AppError("订单状态流转不合法");
  }
  order.status = payload.status;
  order.adminRemark = payload.adminRemark || order.adminRemark || "";
  order.updatedAt = now();
  await dataService.write("orders", orders);
  return order;
}

async function listUsers(query) {
  const [users, orders, userCoupons] = await Promise.all([
    dataService.read("users", []),
    dataService.read("orders", []),
    dataService.read("userCoupons", [])
  ]);
  const list = users.map((user) => ({
    ...user,
    orderCount: orders.filter((item) => item.userId === user.id).length,
    couponCount: userCoupons.filter((item) => item.userId === user.id).length,
    favoriteCount: (user.favoriteIds || []).length
  }));
  return buildList(list, query);
}

async function listCoupons(query) {
  const coupons = await dataService.read("coupons", []);
  return buildList(coupons.sort((a, b) => (a.sort || 0) - (b.sort || 0)), query);
}

async function saveCoupon(payload) {
  const coupons = await dataService.read("coupons", []);
  const record = saveRecord(coupons, {
    ...payload,
    thresholdAmount: Number(payload.thresholdAmount || 0),
    discountAmount: Number(payload.discountAmount || 0),
    goodsIds: payload.goodsIds || [],
    communityIds: payload.communityIds || [],
    status: payload.status || "active"
  }, "coupon");
  await dataService.write("coupons", coupons);
  return record;
}

async function listCommunities(query) {
  const communities = await dataService.read("communities", []);
  return buildList(communities.sort((a, b) => (a.sort || 0) - (b.sort || 0)), query);
}

async function saveCommunity(payload) {
  const communities = await dataService.read("communities", []);
  const record = saveRecord(communities, {
    ...payload,
    minOrderAmount: Number(payload.minOrderAmount || 0),
    deliveryFee: Number(payload.deliveryFee || 0),
    isOpen: payload.isOpen !== false
  }, "community");
  await dataService.write("communities", communities);
  return record;
}

async function listContents(query) {
  const contents = await dataService.read("contents", []);
  let list = [...contents];
  if (query.type) {
    list = list.filter((item) => item.type === query.type);
  }
  return buildList(list.sort((a, b) => (a.sort || 0) - (b.sort || 0)), query);
}

async function saveContent(payload) {
  const contents = await dataService.read("contents", []);
  const record = saveRecord(contents, {
    ...payload,
    contentBlocks: payload.contentBlocks || [],
    isPublished: payload.isPublished !== false
  }, "content");
  await dataService.write("contents", contents);
  return record;
}

async function listServiceTickets(query) {
  const tickets = await dataService.read("serviceTickets", []);
  let list = [...tickets];
  if (query.status && query.status !== "all") {
    list = list.filter((item) => item.status === query.status);
  }
  return buildList(list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))), query);
}

async function updateServiceTicket(payload) {
  return orderService.updateServiceTicketByAdmin(payload);
}

async function getSystemConfig() {
  return dataService.read("systemConfig", {});
}

async function saveSystemConfig(payload) {
  const current = await dataService.read("systemConfig", {});
  const nextConfig = {
    ...current,
    ...payload,
    updatedAt: now()
  };
  await dataService.write("systemConfig", nextConfig);
  return nextConfig;
}

function buildUploadResponse(file) {
  if (!file) {
    throw new AppError("上传文件不能为空");
  }
  return {
    name: file.originalname,
    url: `/static/uploads/${path.basename(file.path)}`,
    size: file.size
  };
}

module.exports = {
  loginAdmin,
  getDashboard,
  listGoods,
  saveGoods,
  deleteGoods,
  toggleGoods,
  listCategories,
  saveCategory,
  listBanners,
  saveBanner,
  listSections,
  saveSection,
  listOrders,
  getOrderDetail,
  updateOrderStatus,
  listUsers,
  listCoupons,
  saveCoupon,
  listCommunities,
  saveCommunity,
  listContents,
  saveContent,
  listServiceTickets,
  updateServiceTicket,
  getSystemConfig,
  saveSystemConfig,
  buildUploadResponse
};
