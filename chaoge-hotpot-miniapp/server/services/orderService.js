const { readJSON, writeJSON } = require('../utils/file');
const { createError } = require('../utils/errors');
const {
  generateOrderId,
  generateOrderNo,
  calculateTotalAmount
} = require('../utils/order');

function normalizeRemark(remark) {
  return typeof remark === 'string' ? remark.trim() : '';
}

function validatePeopleCount(peopleCount) {
  return Number.isInteger(peopleCount) && peopleCount >= 1 && peopleCount <= 20;
}

async function createOrder(payload) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const peopleCount = Number(payload.peopleCount);
  const remark = normalizeRemark(payload.remark);

  if (!items.length) {
    throw createError(400, 'items can not be empty');
  }

  if (!validatePeopleCount(peopleCount)) {
    throw createError(400, 'peopleCount is invalid');
  }

  const dishes = await readJSON('dishes.json');
  const dishMap = new Map(dishes.map((dish) => [dish.id, dish]));

  const normalizedItems = items.map((item) => {
    const dish = dishMap.get(item.dishId);
    const quantity = Number(item.quantity);

    if (!dish) {
      throw createError(400, `dish not found: ${item.dishId}`);
    }

    if (dish.isSoldOut) {
      throw createError(400, `${dish.name} is sold out`);
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw createError(400, `quantity is invalid: ${item.dishId}`);
    }

    return {
      dishId: dish.id,
      quantity,
      price: dish.price,
      name: dish.name,
      image: dish.image,
      unit: dish.unit
    };
  });

  const orders = await readJSON('orders.json');
  const order = {
    id: generateOrderId(),
    orderNo: generateOrderNo(),
    items: normalizedItems,
    peopleCount,
    remark,
    totalAmount: calculateTotalAmount(normalizedItems),
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const nextOrders = [order, ...orders].sort(
    (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
  );

  await writeJSON('orders.json', nextOrders);
  return order;
}

async function getOrders() {
  const orders = await readJSON('orders.json');
  return orders.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

async function getOrderById(id) {
  const orders = await readJSON('orders.json');
  const order = orders.find((item) => item.id === id);

  if (!order) {
    throw createError(404, 'order not found');
  }

  return order;
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};
