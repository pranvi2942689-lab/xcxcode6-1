const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const contentService = require("../services/contentService");

exports.list = asyncHandler(async (req, res) => {
  sendSuccess(res, await contentService.listContents(req.query));
});

exports.detail = asyncHandler(async (req, res) => {
  sendSuccess(res, await contentService.getContentDetail(req.params.id));
});
