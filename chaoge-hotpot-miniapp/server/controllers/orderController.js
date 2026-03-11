const orderService = require('../services/orderService');
const { sendSuccess } = require('../utils/response');

async function createOrder(req, res) {
  const order = await orderService.createOrder(req.body);
  sendSuccess(res, order, 'order created');
}

async function getOrders(req, res) {
  const orders = await orderService.getOrders();
  sendSuccess(res, orders);
}

async function getOrderById(req, res) {
  const order = await orderService.getOrderById(req.params.id);
  sendSuccess(res, order);
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};
