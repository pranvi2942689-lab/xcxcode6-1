const { sendSuccess } = require('../utils/response');

function getHealth(req, res) {
  sendSuccess(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    serviceName: 'chaoge-hotpot-miniapp-server'
  });
}

module.exports = {
  getHealth
};
