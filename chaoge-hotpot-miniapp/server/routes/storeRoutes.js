const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getStore } = require('../controllers/storeController');

const router = express.Router();

router.get('/', asyncHandler(getStore));

module.exports = router;
