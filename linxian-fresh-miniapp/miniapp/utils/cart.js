const api = require("../services/api");
const storage = require("./storage");

function syncCartMap(cartData) {
  const map = {};
  (cartData.items || []).forEach((item) => {
    map[item.goodsId] = item.quantity;
  });
  storage.setCartMap(map);
  return map;
}

async function fetchCart() {
  const data = await api.getCart();
  syncCartMap(data);
  return data;
}

async function addCart(goodsId, quantity = 1, specText = "") {
  const data = await api.addCart({ goodsId, quantity, specText });
  syncCartMap(data);
  return data;
}

async function updateCart(payload) {
  const data = await api.updateCart(payload);
  syncCartMap(data);
  return data;
}

async function removeCart(goodsIds) {
  const data = await api.removeCart({ goodsIds });
  syncCartMap(data);
  return data;
}

async function clearCart() {
  const data = await api.clearCart();
  syncCartMap(data);
  return data;
}

module.exports = {
  syncCartMap,
  fetchCart,
  addCart,
  updateCart,
  removeCart,
  clearCart
};
