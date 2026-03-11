const { readJSON } = require('../utils/file');
const { createError } = require('../utils/errors');

async function getDishes(categoryId) {
  const dishes = await readJSON('dishes.json');
  const sorted = dishes.sort((left, right) => left.sort - right.sort);

  if (!categoryId) {
    return sorted;
  }

  return sorted.filter((dish) => dish.categoryId === categoryId);
}

async function getDishById(id) {
  const dishes = await readJSON('dishes.json');
  const targetDish = dishes.find((dish) => dish.id === id);

  if (!targetDish) {
    throw createError(404, 'dish not found');
  }

  return targetDish;
}

module.exports = {
  getDishes,
  getDishById
};
