const request = require('../utils/request');

function getStore() {
  return request.get('/api/store');
}

function getCategories() {
  return request.get('/api/categories');
}

function getDishes(categoryId) {
  return request.get('/api/dishes', categoryId ? { categoryId } : undefined);
}

function getDishDetail(id) {
  return request.get(`/api/dishes/${id}`);
}

function createOrder(data) {
  return request.post('/api/orders', data);
}

function getOrders() {
  return request.get('/api/orders');
}

function getOrderDetail(id) {
  return request.get(`/api/orders/${id}`);
}

module.exports = {
  getStore,
  getCategories,
  getDishes,
  getDishDetail,
  createOrder,
  getOrders,
  getOrderDetail
};
