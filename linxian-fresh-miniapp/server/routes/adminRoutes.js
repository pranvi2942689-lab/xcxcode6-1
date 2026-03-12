const express = require("express");
const controller = require("../controllers/adminController");
const { requireAdminAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/admin/login", controller.login);

router.use(requireAdminAuth);

router.get("/admin/dashboard", controller.dashboard);
router.get("/admin/goods/list", controller.goodsList);
router.post("/admin/goods/create", controller.goodsCreate);
router.post("/admin/goods/update", controller.goodsUpdate);
router.post("/admin/goods/delete", controller.goodsDelete);
router.post("/admin/goods/toggle", controller.goodsToggle);

router.get("/admin/categories/list", controller.categoriesList);
router.post("/admin/categories/save", controller.categoriesSave);

router.get("/admin/banners/list", controller.bannersList);
router.post("/admin/banners/save", controller.bannersSave);

router.get("/admin/sections/list", controller.sectionsList);
router.post("/admin/sections/save", controller.sectionsSave);

router.get("/admin/orders/list", controller.ordersList);
router.get("/admin/orders/:id", controller.ordersDetail);
router.post("/admin/orders/update-status", controller.ordersUpdateStatus);

router.get("/admin/users/list", controller.usersList);

router.get("/admin/coupons/list", controller.couponsList);
router.post("/admin/coupons/save", controller.couponsSave);

router.get("/admin/communities/list", controller.communitiesList);
router.post("/admin/communities/save", controller.communitiesSave);

router.get("/admin/contents/list", controller.contentsList);
router.post("/admin/contents/save", controller.contentsSave);

router.get("/admin/service-tickets/list", controller.serviceTicketsList);
router.post("/admin/service-tickets/update", controller.serviceTicketsUpdate);

router.get("/admin/system-config", controller.systemConfig);
router.post("/admin/system-config/save", controller.systemConfigSave);

router.post("/admin/upload", controller.uploadMiddleware, controller.upload);

module.exports = router;
