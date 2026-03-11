const dishService = require('../services/dishService');
const { sendSuccess } = require('../utils/response');

async function getDishes(req, res) {
  const dishes = await dishService.getDishes(req.query.categoryId);
  sendSuccess(res, dishes);
}

async function getDishById(req, res) {
  const dish = await dishService.getDishById(req.params.id);
  sendSuccess(res, dish);
}

module.exports = {
  getDishes,
  getDishById
};
