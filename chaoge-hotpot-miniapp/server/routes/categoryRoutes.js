const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getCategories } = require('../controllers/categoryController');

const router = express.Router();

router.get('/', asyncHandler(getCategories));

module.exports = router;
