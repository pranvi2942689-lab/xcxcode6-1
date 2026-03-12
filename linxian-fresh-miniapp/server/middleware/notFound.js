const { sendFail } = require("../utils/response");

module.exports = function notFound(req, res) {
  return sendFail(res, "接口不存在", -1, 404);
};
