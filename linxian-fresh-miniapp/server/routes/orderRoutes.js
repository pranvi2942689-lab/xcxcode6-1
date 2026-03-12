const express = require("express");
const controller = require("../controllers/orderController");
const { requireUserAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/order/preview", requireUserAuth, controller.preview);
router.post("/order/create", requireUserAuth, controller.create);
router.post("/order/pay", requireUserAuth, controller.pay);
router.get("/order/list", requireUserAuth, controller.list);
router.get("/order/:id", requireUserAuth, controller.detail);
router.post("/order/cancel", requireUserAuth, controller.cancel);
router.post("/order/confirm", requireUserAuth, controller.confirm);

router.post("/service-ticket/create", requireUserAuth, controller.createServiceTicket);
router.get("/service-ticket/list", requireUserAuth, controller.listServiceTickets);

module.exports = router;
