const express = require("express");
const controller = require("../controllers/userController");
const { requireUserAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/user/profile", requireUserAuth, controller.profile);
router.get("/user/favorites", requireUserAuth, controller.favorites);
router.post("/user/favorites/toggle", requireUserAuth, controller.toggleFavorite);
router.get("/user/history", requireUserAuth, controller.history);
router.post("/user/history/add", requireUserAuth, controller.addHistory);

router.get("/cart", requireUserAuth, controller.cart);
router.post("/cart/add", requireUserAuth, controller.addCart);
router.post("/cart/update", requireUserAuth, controller.updateCart);
router.post("/cart/remove", requireUserAuth, controller.removeCart);
router.post("/cart/clear", requireUserAuth, controller.clearCart);

router.get("/coupons/center", requireUserAuth, controller.couponCenter);
router.get("/coupons/my", requireUserAuth, controller.myCoupons);
router.post("/coupons/claim", requireUserAuth, controller.claimCoupon);

router.get("/address/list", requireUserAuth, controller.addressList);
router.post("/address/save", requireUserAuth, controller.addressSave);
router.post("/address/delete", requireUserAuth, controller.addressDelete);

module.exports = router;
