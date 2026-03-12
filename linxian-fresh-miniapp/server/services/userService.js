const dataService = require("./dataService");
const { AppError } = require("../utils/errors");
const { genId } = require("../utils/id");

function getTimestamp() {
  return new Date().toISOString();
}

function sortByLatest(list, key = "updatedAt") {
  return [...list].sort((a, b) => String(b[key] || "").localeCompare(String(a[key] || "")));
}

function enrichCartItems(cartItems, goods) {
  const goodsMap = new Map(goods.map((item) => [item.id, item]));
  const validItems = [];
  const invalidItems = [];

  cartItems.forEach((item) => {
    const goodsItem = goodsMap.get(item.goodsId);
    if (!goodsItem || goodsItem.isOffline || goodsItem.stock <= 0) {
      invalidItems.push({
        ...item,
        goods: goodsItem || null
      });
      return;
    }

    validItems.push({
      ...item,
      goods: goodsItem,
      subtotal: Number((goodsItem.price * item.quantity).toFixed(2))
    });
  });

  const checkedItems = validItems.filter((item) => item.checked !== false);
  const summary = {
    totalCount: checkedItems.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: Number(checkedItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)),
    checkedCount: checkedItems.length
  };

  return {
    items: validItems,
    invalidItems,
    summary
  };
}

async function getUserProfile(userId) {
  const [users, addresses, orders, userCoupons] = await Promise.all([
    dataService.read("users", []),
    dataService.read("addresses", []),
    dataService.read("orders", []),
    dataService.read("userCoupons", [])
  ]);
  const user = users.find((item) => item.id === userId);

  if (!user) {
    throw new AppError("用户不存在", 404);
  }

  const addressList = addresses.filter((item) => item.userId === userId);
  const defaultAddress = addressList.find((item) => item.isDefault) || addressList[0] || null;

  return {
    ...user,
    orderCount: orders.filter((item) => item.userId === userId).length,
    couponCount: userCoupons.filter((item) => item.userId === userId && item.status === "available").length,
    favoriteCount: (user.favoriteIds || []).length,
    defaultAddress
  };
}

async function getFavoriteList(userId) {
  const [users, goods] = await Promise.all([dataService.read("users", []), dataService.read("goods", [])]);
  const user = users.find((item) => item.id === userId);
  const favoriteIds = user ? user.favoriteIds || [] : [];
  return favoriteIds
    .map((id) => goods.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => ({ ...item, isFavorite: true }));
}

async function toggleFavorite(userId, goodsId) {
  const [users, goods] = await Promise.all([dataService.read("users", []), dataService.read("goods", [])]);
  const userIndex = users.findIndex((item) => item.id === userId);
  if (userIndex < 0) {
    throw new AppError("用户不存在", 404);
  }

  const goodsExists = goods.some((item) => item.id === goodsId);
  if (!goodsExists) {
    throw new AppError("商品不存在", 404);
  }

  const favoriteIds = users[userIndex].favoriteIds || [];
  const exists = favoriteIds.includes(goodsId);
  users[userIndex].favoriteIds = exists ? favoriteIds.filter((id) => id !== goodsId) : [goodsId, ...favoriteIds];
  users[userIndex].updatedAt = getTimestamp();
  await dataService.write("users", users);

  return {
    goodsId,
    isFavorite: !exists
  };
}

async function getHistoryList(userId) {
  const [users, goods] = await Promise.all([dataService.read("users", []), dataService.read("goods", [])]);
  const user = users.find((item) => item.id === userId);
  const history = user ? user.history || [] : [];
  return history
    .sort((a, b) => String(b.viewedAt).localeCompare(String(a.viewedAt)))
    .map((record) => {
      const goodsItem = goods.find((item) => item.id === record.goodsId);
      if (!goodsItem) {
        return null;
      }
      return {
        ...goodsItem,
        viewedAt: record.viewedAt
      };
    })
    .filter(Boolean);
}

async function addHistory(userId, goodsId) {
  const [users, goods] = await Promise.all([dataService.read("users", []), dataService.read("goods", [])]);
  const userIndex = users.findIndex((item) => item.id === userId);
  if (userIndex < 0) {
    throw new AppError("用户不存在", 404);
  }

  const goodsItem = goods.find((item) => item.id === goodsId);
  if (!goodsItem) {
    throw new AppError("商品不存在", 404);
  }

  const history = (users[userIndex].history || []).filter((item) => item.goodsId !== goodsId);
  history.unshift({
    goodsId,
    viewedAt: getTimestamp()
  });
  users[userIndex].history = history.slice(0, 30);
  users[userIndex].updatedAt = getTimestamp();
  await dataService.write("users", users);

  return {
    goodsId
  };
}

async function getCart(userId) {
  const [carts, goods] = await Promise.all([dataService.read("carts", []), dataService.read("goods", [])]);
  const cart = carts.find((item) => item.userId === userId) || { userId, items: [] };
  return enrichCartItems(cart.items || [], goods);
}

async function addToCart(userId, payload) {
  const goods = await dataService.read("goods", []);
  const goodsItem = goods.find((item) => item.id === payload.goodsId);

  if (!goodsItem) {
    throw new AppError("商品不存在", 404);
  }
  if (goodsItem.isOffline) {
    throw new AppError("商品已下架");
  }
  if (goodsItem.stock <= 0) {
    throw new AppError("商品已售罄");
  }

  const quantity = Math.max(Number(payload.quantity || 1), 1);
  const carts = await dataService.read("carts", []);
  let cart = carts.find((item) => item.userId === userId);
  if (!cart) {
    cart = { userId, items: [] };
    carts.push(cart);
  }

  const item = cart.items.find((record) => record.goodsId === payload.goodsId);
  if (item) {
    item.quantity = Math.min(item.quantity + quantity, goodsItem.stock);
    item.checked = true;
    item.updatedAt = getTimestamp();
  } else {
    cart.items.unshift({
      id: genId("cart"),
      goodsId: payload.goodsId,
      quantity: Math.min(quantity, goodsItem.stock),
      checked: true,
      specText: payload.specText || goodsItem.specText,
      updatedAt: getTimestamp()
    });
  }

  await dataService.write("carts", carts);
  return getCart(userId);
}

async function updateCart(userId, payload) {
  const carts = await dataService.read("carts", []);
  const goods = await dataService.read("goods", []);
  const cart = carts.find((item) => item.userId === userId);
  if (!cart) {
    throw new AppError("购物车为空", 404);
  }

  const target = cart.items.find((item) => item.id === payload.id || item.goodsId === payload.goodsId);
  if (!target) {
    throw new AppError("购物车项不存在", 404);
  }

  const goodsItem = goods.find((item) => item.id === target.goodsId);
  if (!goodsItem) {
    throw new AppError("商品不存在", 404);
  }

  if (payload.quantity !== undefined) {
    target.quantity = Math.max(1, Math.min(Number(payload.quantity), goodsItem.stock || 1));
  }
  if (payload.checked !== undefined) {
    target.checked = Boolean(payload.checked);
  }
  target.updatedAt = getTimestamp();
  await dataService.write("carts", carts);
  return getCart(userId);
}

async function removeCartItems(userId, payload) {
  const ids = payload.ids || [];
  const goodsIds = payload.goodsIds || [];
  const carts = await dataService.read("carts", []);
  const cart = carts.find((item) => item.userId === userId);
  if (!cart) {
    return getCart(userId);
  }

  cart.items = cart.items.filter((item) => !ids.includes(item.id) && !goodsIds.includes(item.goodsId));
  await dataService.write("carts", carts);
  return getCart(userId);
}

async function clearCart(userId) {
  const carts = await dataService.read("carts", []);
  const cart = carts.find((item) => item.userId === userId);
  if (cart) {
    cart.items = [];
    await dataService.write("carts", carts);
  }
  return getCart(userId);
}

async function getCouponCenter(userId) {
  const [coupons, userCoupons] = await Promise.all([
    dataService.read("coupons", []),
    dataService.read("userCoupons", [])
  ]);
  return sortByLatest(coupons).map((coupon) => {
    const claimed = userCoupons.some((item) => item.userId === userId && item.couponId === coupon.id);
    return {
      ...coupon,
      claimed
    };
  });
}

async function claimCoupon(userId, couponId) {
  const [coupons, userCoupons] = await Promise.all([
    dataService.read("coupons", []),
    dataService.read("userCoupons", [])
  ]);
  const coupon = coupons.find((item) => item.id === couponId);
  if (!coupon) {
    throw new AppError("优惠券不存在", 404);
  }
  if (coupon.status !== "active") {
    throw new AppError("该优惠券暂不可领取");
  }

  const exists = userCoupons.find((item) => item.userId === userId && item.couponId === couponId && item.status === "available");
  if (exists) {
    return exists;
  }

  const record = {
    id: genId("uc"),
    userId,
    couponId,
    status: "available",
    claimedAt: getTimestamp(),
    usedAt: ""
  };
  userCoupons.unshift(record);
  await dataService.write("userCoupons", userCoupons);
  return record;
}

async function getMyCoupons(userId) {
  const [coupons, userCoupons] = await Promise.all([
    dataService.read("coupons", []),
    dataService.read("userCoupons", [])
  ]);
  const couponMap = new Map(coupons.map((item) => [item.id, item]));
  return sortByLatest(userCoupons.filter((item) => item.userId === userId), "claimedAt").map((record) => ({
    ...record,
    template: couponMap.get(record.couponId) || null
  }));
}

async function getAddressList(userId) {
  const addresses = await dataService.read("addresses", []);
  return sortByLatest(addresses.filter((item) => item.userId === userId), "isDefault");
}

async function saveAddress(userId, payload) {
  const addresses = await dataService.read("addresses", []);
  const address = {
    id: payload.id || genId("addr"),
    userId,
    name: payload.name,
    phone: payload.phone,
    communityId: payload.communityId,
    communityName: payload.communityName,
    detail: payload.detail,
    houseNumber: payload.houseNumber,
    tag: payload.tag || "家",
    isDefault: Boolean(payload.isDefault),
    updatedAt: getTimestamp(),
    createdAt: payload.createdAt || getTimestamp()
  };

  if (!address.name || !address.phone || !address.communityId || !address.detail) {
    throw new AppError("请完整填写地址信息");
  }

  if (address.isDefault) {
    addresses.forEach((item) => {
      if (item.userId === userId) {
        item.isDefault = false;
      }
    });
  }

  const index = addresses.findIndex((item) => item.id === address.id);
  if (index > -1) {
    addresses[index] = { ...addresses[index], ...address };
  } else {
    addresses.unshift(address);
  }

  await dataService.write("addresses", addresses);
  return getAddressList(userId);
}

async function deleteAddress(userId, id) {
  const addresses = await dataService.read("addresses", []);
  const nextList = addresses.filter((item) => !(item.userId === userId && item.id === id));
  await dataService.write("addresses", nextList);
  return getAddressList(userId);
}

module.exports = {
  getUserProfile,
  getFavoriteList,
  toggleFavorite,
  getHistoryList,
  addHistory,
  getCart,
  addToCart,
  updateCart,
  removeCartItems,
  clearCart,
  getCouponCenter,
  claimCoupon,
  getMyCoupons,
  getAddressList,
  saveAddress,
  deleteAddress
};
