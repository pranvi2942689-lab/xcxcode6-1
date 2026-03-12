const express = require("express");
const controller = require("../controllers/publicController");

const router = express.Router();

router.get("/health", controller.health);
router.get("/config", controller.config);
router.get("/communities", controller.communities);
router.get("/banners", controller.banners);
router.get("/sections", controller.sections);
router.get("/categories", controller.categories);
router.get("/goods", controller.goodsList);
router.get("/goods/:id", controller.goodsDetail);
router.get("/search", controller.search);
router.post("/auth/login", controller.login);

module.exports = router;
