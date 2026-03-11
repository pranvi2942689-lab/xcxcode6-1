const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  createOrder,
  getOrders,
  getOrderById
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', asyncHandler(createOrder));
router.get('/', asyncHandler(getOrders));
router.get('/:id', asyncHandler(getOrderById));

module.exports = router;
