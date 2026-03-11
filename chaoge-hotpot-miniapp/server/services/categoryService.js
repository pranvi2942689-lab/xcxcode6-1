const { readJSON } = require('../utils/file');

async function getCategories() {
  const categories = await readJSON('categories.json');
  return categories.sort((left, right) => left.sort - right.sort);
}

module.exports = {
  getCategories
};
