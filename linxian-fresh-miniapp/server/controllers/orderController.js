const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const orderService = require("../services/orderService");

exports.preview = asyncHandler(async (req, res) => {
  sendSuccess(res, await orderService.previewOrder(req.user.id, req.body));
});

exports.create = asyncHandler(async (req, res) => {
  sendSuccess(res, await orderService.createOrder(req.user.id, req.body));
});

exports.pay = asyncHandler(async (req, res) => {
  sendSuccess(res, await orderService.payOrder(req.user.id, req.body));
});

exports.list = asyncHandler(async (req, res) => {
  sendSuccess(res, await orderService.listOrders(req.user.id, req.query));
});

exports.detail = asyncHandler(async (req, res) => {
  sendSuccess(res, await orderService.getOrderDetail(req.user.id, req.params.id));
});

exports.cancel = asyncHandler(async (req, res) => {
  sendSuccess(res, await orderService.cancelOrder(req.user.id, req.body));
});

exports.confirm = asyncHandler(async (req, res) => {
  sendSuccess(res, await orderService.confirmOrder(req.user.id, req.body));
});

exports.createServiceTicket = asyncHandler(async (req, res) => {
  sendSuccess(res, await orderService.createServiceTicket(req.user.id, req.body));
});

exports.listServiceTickets = asyncHandler(async (req, res) => {
  sendSuccess(res, await orderService.listServiceTickets(req.user.id));
});
