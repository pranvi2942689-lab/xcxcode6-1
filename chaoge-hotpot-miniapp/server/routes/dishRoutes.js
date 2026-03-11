const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDishes, getDishById } = require('../controllers/dishController');

const router = express.Router();

router.get('/', asyncHandler(getDishes));
router.get('/:id', asyncHandler(getDishById));

module.exports = router;
