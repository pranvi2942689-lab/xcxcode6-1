const storeService = require('../services/storeService');
const { sendSuccess } = require('../utils/response');

async function getStore(req, res) {
  const storeConfig = await storeService.getStoreConfig();
  sendSuccess(res, storeConfig);
}

module.exports = {
  getStore
};
