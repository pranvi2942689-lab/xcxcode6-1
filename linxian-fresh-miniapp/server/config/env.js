const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const rootDir = path.join(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const staticDir = path.join(rootDir, "static");
const uploadDir = path.join(staticDir, "uploads");

module.exports = {
  rootDir,
  dataDir,
  staticDir,
  uploadDir,
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.APP_PORT || 3000),
  host: "0.0.0.0",
  apiBaseUrl: process.env.API_BASE_URL || "https://api.chaogexiaochengxu.cn",
  wechatCloudEnvId: process.env.WECHAT_CLOUD_ENV_ID || "wxd6d37edecab159ac",
  wechatAppSecret: process.env.WECHAT_APP_SECRET || ""
};
