const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const userService = require("../services/userService");

exports.profile = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.getUserProfile(req.user.id));
});

exports.favorites = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.getFavoriteList(req.user.id));
});

exports.toggleFavorite = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.toggleFavorite(req.user.id, req.body.goodsId));
});

exports.history = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.getHistoryList(req.user.id));
});

exports.addHistory = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.addHistory(req.user.id, req.body.goodsId));
});

exports.cart = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.getCart(req.user.id));
});

exports.addCart = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.addToCart(req.user.id, req.body));
});

exports.updateCart = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.updateCart(req.user.id, req.body));
});

exports.removeCart = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.removeCartItems(req.user.id, req.body));
});

exports.clearCart = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.clearCart(req.user.id));
});

exports.couponCenter = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.getCouponCenter(req.user.id));
});

exports.claimCoupon = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.claimCoupon(req.user.id, req.body.couponId));
});

exports.myCoupons = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.getMyCoupons(req.user.id));
});

exports.addressList = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.getAddressList(req.user.id));
});

exports.addressSave = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.saveAddress(req.user.id, req.body));
});

exports.addressDelete = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.deleteAddress(req.user.id, req.body.id));
});
