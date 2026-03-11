const express = require('express');
const healthRoutes = require('./healthRoutes');
const storeRoutes = require('./storeRoutes');
const categoryRoutes = require('./categoryRoutes');
const dishRoutes = require('./dishRoutes');
const orderRoutes = require('./orderRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/store', storeRoutes);
router.use('/categories', categoryRoutes);
router.use('/dishes', dishRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
