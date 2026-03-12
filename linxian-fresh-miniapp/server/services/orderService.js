const dataService = require("./dataService");
const { AppError } = require("../utils/errors");
const { genId, genOrderNo } = require("../utils/id");
const { canOrderTransition } = require("../utils/orderState");
const { canServiceTicketTransition } = require("../utils/serviceTicketState");

function now() {
  return new Date().toISOString();
}

async function getUserDefaultAddress(userId) {
  const addresses = await dataService.read("addresses", []);
  const list = addresses.filter((item) => item.userId === userId);
  return list.find((item) => item.isDefault) || list[0] || null;
}

async function getCheckoutItems(userId, payload = {}) {
  const goods = await dataService.read("goods", []);
  let rawItems = payload.items || [];

  if (!rawItems.length) {
    const carts = await dataService.read("carts", []);
    const cart = carts.find((item) => item.userId === userId);
    rawItems = cart ? cart.items.filter((item) => item.checked !== false) : [];
  }

  if (!rawItems.length) {
    throw new AppError("请选择需要结算的商品");
  }

  return rawItems.map((item) => {
    const goodsItem = goods.find((record) => record.id === item.goodsId);
    if (!goodsItem) {
      throw new AppError("存在无效商品");
    }
    if (goodsItem.isOffline) {
      throw new AppError(`${goodsItem.name} 已下架`);
    }
    if (goodsItem.stock <= 0) {
      throw new AppError(`${goodsItem.name} 已售罄`);
    }
    const quantity = Math.max(1, Number(item.quantity || 1));
    if (quantity > goodsItem.stock) {
      throw new AppError(`${goodsItem.name} 库存不足`);
    }
    return {
      goodsId: goodsItem.id,
      quantity,
      goods: goodsItem
    };
  });
}

async function getCommunityById(communityId) {
  const communities = await dataService.read("communities", []);
  const community = communities.find((item) => item.id === communityId);
  if (!community) {
    throw new AppError("社区不存在", 404);
  }
  return community;
}

async function getAddress(userId, addressId) {
  if (!addressId) {
    return getUserDefaultAddress(userId);
  }
  const addresses = await dataService.read("addresses", []);
  return addresses.find((item) => item.userId === userId && item.id === addressId) || null;
}

function calculateCouponDiscount(template, goodsAmount, communityId, goodsIds) {
  if (!template) {
    return 0;
  }
  if (template.status !== "active") {
    return 0;
  }
  if (template.communityIds && template.communityIds.length && !template.communityIds.includes(communityId)) {
    return 0;
  }
  if (template.scopeType === "goods" && template.goodsIds && template.goodsIds.length) {
    const matched = goodsIds.some((id) => template.goodsIds.includes(id));
    if (!matched) {
      return 0;
    }
  }
  if (goodsAmount < Number(template.thresholdAmount || 0)) {
    return 0;
  }
  return Number(template.discountAmount || 0);
}

async function buildPreview(userId, payload = {}) {
  const [items, coupons, userCoupons, systemConfig] = await Promise.all([
    getCheckoutItems(userId, payload),
    dataService.read("coupons", []),
    dataService.read("userCoupons", []),
    dataService.read("systemConfig", {})
  ]);
  const address = await getAddress(userId, payload.addressId);
  const communityId = payload.communityId || (address && address.communityId);
  if (!communityId) {
    throw new AppError("请选择配送社区");
  }
  const community = await getCommunityById(communityId);
  if (!community.isOpen) {
    throw new AppError("当前社区暂未营业");
  }

  const orderItems = items.map((item) => ({
    goodsId: item.goods.id,
    name: item.goods.name,
    cover: item.goods.cover,
    price: item.goods.price,
    originalPrice: item.goods.originalPrice,
    specText: item.goods.specText,
    unit: item.goods.unit,
    quantity: item.quantity,
    subtotal: Number((item.quantity * item.goods.price).toFixed(2))
  }));
  const goodsAmount = Number(orderItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
  const goodsIds = orderItems.map((item) => item.goodsId);
  const selectedUserCoupon = payload.userCouponId
    ? userCoupons.find((item) => item.id === payload.userCouponId && item.userId === userId && item.status === "available")
    : null;
  const couponTemplate = selectedUserCoupon ? coupons.find((item) => item.id === selectedUserCoupon.couponId) : null;
  const discountAmount = Number(calculateCouponDiscount(couponTemplate, goodsAmount, communityId, goodsIds).toFixed(2));
  const deliveryFee = goodsAmount >= Number(community.minOrderAmount || systemConfig.minOrderAmount || 39)
    ? 0
    : Number(community.deliveryFee || systemConfig.defaultDeliveryFee || 4);
  const payableAmount = Number(Math.max(goodsAmount - discountAmount + deliveryFee, 0).toFixed(2));
  const minOrderAmount = Number(community.minOrderAmount || systemConfig.minOrderAmount || 39);
  const minOrderGap = Number(Math.max(minOrderAmount - goodsAmount, 0).toFixed(2));
  const availableCoupons = userCoupons
    .filter((item) => item.userId === userId && item.status === "available")
    .map((record) => {
      const template = coupons.find((item) => item.id === record.couponId);
      const discount = calculateCouponDiscount(template, goodsAmount, communityId, goodsIds);
      return {
        ...record,
        template,
        discount,
        enabled: discount > 0
      };
    });

  return {
    address,
    community,
    items: orderItems,
    goodsAmount,
    discountAmount,
    deliveryFee,
    payableAmount,
    minOrderAmount,
    minOrderGap,
    canSubmit: Boolean(address) && minOrderGap <= 0,
    deliverySlots: systemConfig.deliverySlots || [],
    selectedUserCoupon,
    availableCoupons
  };
}

async function previewOrder(userId, payload) {
  return buildPreview(userId, payload);
}

async function createOrder(userId, payload = {}) {
  const preview = await buildPreview(userId, payload);
  if (!preview.address) {
    throw new AppError("请先选择收货地址");
  }
  if (!preview.canSubmit) {
    throw new AppError(`未达到起送金额，还差 ¥${preview.minOrderGap}`);
  }

  const deliverySlot = payload.deliverySlot || (preview.deliverySlots[0] && preview.deliverySlots[0].label);
  if (!deliverySlot) {
    throw new AppError("请选择配送时间");
  }

  const [orders, goods, userCoupons, carts] = await Promise.all([
    dataService.read("orders", []),
    dataService.read("goods", []),
    dataService.read("userCoupons", []),
    dataService.read("carts", [])
  ]);

  preview.items.forEach((item) => {
    const goodsItem = goods.find((record) => record.id === item.goodsId);
    if (!goodsItem || goodsItem.isOffline) {
      throw new AppError(`${item.name} 当前不可购买`);
    }
    if (goodsItem.stock < item.quantity) {
      throw new AppError(`${item.name} 库存不足`);
    }
  });

  preview.items.forEach((item) => {
    const goodsItem = goods.find((record) => record.id === item.goodsId);
    goodsItem.stock -= item.quantity;
    goodsItem.soldCount += item.quantity;
    goodsItem.updatedAt = now();
  });

  const order = {
    id: genId("order"),
    orderNo: genOrderNo(),
    userId,
    communityId: preview.community.id,
    addressId: preview.address.id,
    addressSnapshot: preview.address,
    items: preview.items,
    goodsAmount: preview.goodsAmount,
    discountAmount: preview.discountAmount,
    deliveryFee: preview.deliveryFee,
    payableAmount: preview.payableAmount,
    status: "pending_payment",
    couponId: preview.selectedUserCoupon ? preview.selectedUserCoupon.couponId : "",
    userCouponId: preview.selectedUserCoupon ? preview.selectedUserCoupon.id : "",
    deliverySlot,
    remark: payload.remark || "",
    createdAt: now(),
    updatedAt: now()
  };

  if (order.userCouponId) {
    const couponRecord = userCoupons.find((item) => item.id === order.userCouponId && item.userId === userId);
    if (!couponRecord || couponRecord.status !== "available") {
      throw new AppError("优惠券不可用");
    }
    couponRecord.status = "used";
    couponRecord.usedAt = now();
    couponRecord.orderId = order.id;
  }

  const cart = carts.find((item) => item.userId === userId);
  if (cart) {
    const goodsIds = preview.items.map((item) => item.goodsId);
    cart.items = cart.items.filter((item) => !goodsIds.includes(item.goodsId));
  }

  orders.unshift(order);
  await Promise.all([
    dataService.write("orders", orders),
    dataService.write("goods", goods),
    dataService.write("userCoupons", userCoupons),
    dataService.write("carts", carts)
  ]);

  return order;
}

async function payOrder(userId, payload) {
  const orders = await dataService.read("orders", []);
  const order = orders.find((item) => item.id === payload.orderId && item.userId === userId);
  if (!order) {
    throw new AppError("订单不存在", 404);
  }
  if (!canOrderTransition(order.status, "pending_delivery")) {
    throw new AppError("当前订单不可支付");
  }
  order.status = "pending_delivery";
  order.updatedAt = now();
  order.payInfo = {
    payAt: now(),
    channel: "mock_wechat_pay",
    tradeNo: genId("trade")
  };
  await dataService.write("orders", orders);
  return order;
}

async function listOrders(userId, query = {}) {
  const orders = await dataService.read("orders", []);
  let list = orders.filter((item) => item.userId === userId);
  if (query.status && query.status !== "all") {
    list = list.filter((item) => item.status === query.status);
  }
  return list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function getOrderDetail(userId, id) {
  const orders = await dataService.read("orders", []);
  const order = orders.find((item) => item.id === id && item.userId === userId);
  if (!order) {
    throw new AppError("订单不存在", 404);
  }
  return order;
}

async function cancelOrder(userId, payload) {
  const [orders, goods, userCoupons] = await Promise.all([
    dataService.read("orders", []),
    dataService.read("goods", []),
    dataService.read("userCoupons", [])
  ]);
  const order = orders.find((item) => item.id === payload.orderId && item.userId === userId);
  if (!order) {
    throw new AppError("订单不存在", 404);
  }
  if (!canOrderTransition(order.status, "cancelled")) {
    throw new AppError("当前订单不可取消");
  }

  order.status = "cancelled";
  order.cancelReason = payload.reason || "用户主动取消";
  order.updatedAt = now();
  order.items.forEach((item) => {
    const goodsItem = goods.find((record) => record.id === item.goodsId);
    if (goodsItem) {
      goodsItem.stock += item.quantity;
      goodsItem.updatedAt = now();
    }
  });

  if (order.userCouponId) {
    const couponRecord = userCoupons.find((item) => item.id === order.userCouponId && item.orderId === order.id);
    if (couponRecord) {
      couponRecord.status = "available";
      couponRecord.usedAt = "";
      couponRecord.orderId = "";
    }
  }

  await Promise.all([
    dataService.write("orders", orders),
    dataService.write("goods", goods),
    dataService.write("userCoupons", userCoupons)
  ]);
  return order;
}

async function confirmOrder(userId, payload) {
  const orders = await dataService.read("orders", []);
  const order = orders.find((item) => item.id === payload.orderId && item.userId === userId);
  if (!order) {
    throw new AppError("订单不存在", 404);
  }
  if (!canOrderTransition(order.status, "completed")) {
    throw new AppError("当前订单不可确认收货");
  }
  order.status = "completed";
  order.updatedAt = now();
  await dataService.write("orders", orders);
  return order;
}

async function createServiceTicket(userId, payload) {
  const [orders, tickets] = await Promise.all([
    dataService.read("orders", []),
    dataService.read("serviceTickets", [])
  ]);
  const order = orders.find((item) => item.id === payload.orderId && item.userId === userId);
  if (!order) {
    throw new AppError("订单不存在", 404);
  }

  const ticket = {
    id: genId("st"),
    orderId: order.id,
    orderNo: order.orderNo,
    userId,
    type: payload.type || "refund",
    reason: payload.reason || "",
    status: "submitted",
    images: payload.images || [],
    remark: payload.remark || "",
    reply: "",
    createdAt: now(),
    updatedAt: now()
  };
  tickets.unshift(ticket);
  if (canOrderTransition(order.status, "refunding")) {
    order.status = "refunding";
    order.updatedAt = now();
  }
  await Promise.all([
    dataService.write("serviceTickets", tickets),
    dataService.write("orders", orders)
  ]);
  return ticket;
}

async function listServiceTickets(userId) {
  const tickets = await dataService.read("serviceTickets", []);
  return tickets.filter((item) => item.userId === userId).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function updateServiceTicketByAdmin(payload) {
  const tickets = await dataService.read("serviceTickets", []);
  const ticket = tickets.find((item) => item.id === payload.id);
  if (!ticket) {
    throw new AppError("售后记录不存在", 404);
  }

  if (payload.status && payload.status !== ticket.status) {
    if (!canServiceTicketTransition(ticket.status, payload.status)) {
      throw new AppError("售后状态流转不合法");
    }
    ticket.status = payload.status;
  }
  if (payload.reply !== undefined) {
    ticket.reply = payload.reply;
  }
  ticket.updatedAt = now();
  await dataService.write("serviceTickets", tickets);
  return ticket;
}

module.exports = {
  previewOrder,
  createOrder,
  payOrder,
  listOrders,
  getOrderDetail,
  cancelOrder,
  confirmOrder,
  createServiceTicket,
  listServiceTickets,
  updateServiceTicketByAdmin
};
