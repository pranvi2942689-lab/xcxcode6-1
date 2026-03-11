const { readJSON } = require('../utils/file');

async function getStoreConfig() {
  return readJSON('storeConfig.json');
}

module.exports = {
  getStoreConfig
};
