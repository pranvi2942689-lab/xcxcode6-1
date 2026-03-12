const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const catalogService = require("../services/catalogService");
const authService = require("../services/authService");
const { apiBaseUrl, wechatCloudEnvId } = require("../config/env");

exports.health = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
    apiBaseUrl,
    wechatCloudEnvId
  });
});

exports.config = asyncHandler(async (req, res) => {
  const data = await catalogService.getPublicConfig();
  sendSuccess(res, data);
});

exports.communities = asyncHandler(async (req, res) => {
  sendSuccess(res, await catalogService.getCommunities(req.query));
});

exports.banners = asyncHandler(async (req, res) => {
  sendSuccess(res, await catalogService.getBanners(req.query));
});

exports.sections = asyncHandler(async (req, res) => {
  sendSuccess(res, await catalogService.getSections(req.query));
});

exports.categories = asyncHandler(async (req, res) => {
  sendSuccess(res, await catalogService.getCategories());
});

exports.goodsList = asyncHandler(async (req, res) => {
  sendSuccess(res, await catalogService.listGoods(req.query));
});

exports.goodsDetail = asyncHandler(async (req, res) => {
  sendSuccess(res, await catalogService.getGoodsDetail(req.params.id));
});

exports.search = asyncHandler(async (req, res) => {
  sendSuccess(res, await catalogService.searchGoods(req.query));
});

exports.login = asyncHandler(async (req, res) => {
  sendSuccess(res, await authService.loginUser(req.body));
});
