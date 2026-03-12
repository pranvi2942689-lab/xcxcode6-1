const path = require("path");
const multer = require("multer");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const adminService = require("../services/adminService");
const { uploadDir } = require("../config/env");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  }
});

const upload = multer({ storage });

exports.uploadMiddleware = upload.single("file");

exports.login = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.loginAdmin(req.body));
});

exports.dashboard = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.getDashboard());
});

exports.goodsList = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.listGoods(req.query));
});

exports.goodsCreate = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.saveGoods(req.body));
});

exports.goodsUpdate = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.saveGoods(req.body));
});

exports.goodsDelete = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.deleteGoods(req.body.id));
});

exports.goodsToggle = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.toggleGoods(req.body.id));
});

exports.categoriesList = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.listCategories(req.query));
});

exports.categoriesSave = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.saveCategory(req.body));
});

exports.bannersList = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.listBanners(req.query));
});

exports.bannersSave = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.saveBanner(req.body));
});

exports.sectionsList = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.listSections(req.query));
});

exports.sectionsSave = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.saveSection(req.body));
});

exports.ordersList = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.listOrders(req.query));
});

exports.ordersDetail = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.getOrderDetail(req.params.id));
});

exports.ordersUpdateStatus = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.updateOrderStatus(req.body));
});

exports.usersList = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.listUsers(req.query));
});

exports.couponsList = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.listCoupons(req.query));
});

exports.couponsSave = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.saveCoupon(req.body));
});

exports.communitiesList = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.listCommunities(req.query));
});

exports.communitiesSave = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.saveCommunity(req.body));
});

exports.contentsList = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.listContents(req.query));
});

exports.contentsSave = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.saveContent(req.body));
});

exports.serviceTicketsList = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.listServiceTickets(req.query));
});

exports.serviceTicketsUpdate = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.updateServiceTicket(req.body));
});

exports.systemConfig = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.getSystemConfig());
});

exports.systemConfigSave = asyncHandler(async (req, res) => {
  sendSuccess(res, await adminService.saveSystemConfig(req.body));
});

exports.upload = asyncHandler(async (req, res) => {
  sendSuccess(res, adminService.buildUploadResponse(req.file));
});
