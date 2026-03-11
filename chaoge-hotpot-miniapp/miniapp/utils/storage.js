const CART_KEY = 'chaoge_hotpot_cart';

function normalizeCartItem(source, quantity) {
  return {
    dishId: source.dishId || source.id,
    quantity,
    price: Number(source.price),
    name: source.name,
    image: source.image,
    unit: source.unit
  };
}

function getCart() {
  const raw = wx.getStorageSync(CART_KEY);
  return Array.isArray(raw) ? raw : [];
}

function saveCart(cartItems) {
  wx.setStorageSync(CART_KEY, cartItems);
  return cartItems;
}

function updateCartItem(source, quantity) {
  const dishId = source.dishId || source.id;
  const nextQuantity = Number(quantity);
  const currentCart = getCart();
  const currentIndex = currentCart.findIndex((item) => item.dishId === dishId);
  const nextCart = [...currentCart];

  if (!Number.isInteger(nextQuantity) || nextQuantity <= 0) {
    if (currentIndex >= 0) {
      nextCart.splice(currentIndex, 1);
    }
    return saveCart(nextCart);
  }

  const nextItem = normalizeCartItem(source, nextQuantity);

  if (currentIndex >= 0) {
    nextCart.splice(currentIndex, 1, nextItem);
  } else {
    nextCart.push(nextItem);
  }

  return saveCart(nextCart);
}

function clearCart() {
  wx.removeStorageSync(CART_KEY);
}

function getCartMap() {
  return getCart().reduce((map, item) => {
    map[item.dishId] = item.quantity;
    return map;
  }, {});
}

function getCartSummary() {
  const cartItems = getCart();
  return cartItems.reduce(
    (summary, item) => {
      summary.totalQuantity += item.quantity;
      summary.totalAmount += item.price * item.quantity;
      return summary;
    },
    {
      totalQuantity: 0,
      totalAmount: 0
    }
  );
}

module.exports = {
  CART_KEY,
  getCart,
  saveCart,
  updateCartItem,
  clearCart,
  getCartMap,
  getCartSummary
};
