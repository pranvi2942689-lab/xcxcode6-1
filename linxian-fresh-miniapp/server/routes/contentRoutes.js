const express = require("express");
const controller = require("../controllers/contentController");

const router = express.Router();

router.get("/content/list", controller.list);
router.get("/content/:id", controller.detail);

module.exports = router;
