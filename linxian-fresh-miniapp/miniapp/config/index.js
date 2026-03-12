const PROD_BASE_URL = "https://api.chaogexiaochengxu.cn";
const LOCAL_BASE_URL = "http://127.0.0.1:3000";
const USE_LOCAL = false;

module.exports = {
  API_BASE_URL: USE_LOCAL ? LOCAL_BASE_URL : PROD_BASE_URL,
  WECHAT_CLOUD_ENV_ID: "wxd6d37edecab159ac",
  REQUEST_TIMEOUT: 12000
};
