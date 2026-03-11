const categoryService = require('../services/categoryService');
const { sendSuccess } = require('../utils/response');

async function getCategories(req, res) {
  const categories = await categoryService.getCategories();
  sendSuccess(res, categories);
}

module.exports = {
  getCategories
};
