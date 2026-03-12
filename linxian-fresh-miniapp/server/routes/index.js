const express = require("express");
const publicRoutes = require("./publicRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");
const contentRoutes = require("./contentRoutes");
const adminRoutes = require("./adminRoutes");

const router = express.Router();

router.use(publicRoutes);
router.use(userRoutes);
router.use(orderRoutes);
router.use(contentRoutes);
router.use(adminRoutes);

module.exports = router;
