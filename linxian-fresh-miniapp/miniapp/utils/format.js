const { API_BASE_URL } = require("../config");

function imageUrl(url = "") {
  if (!url) {
    return "";
  }
  if (/^https?:\/\//.test(url)) {
    return url;
  }
  return `${API_BASE_URL}${url}`;
}

function formatPrice(value = 0) {
  return Number(value).toFixed(2);
}

function formatDateText(text = "") {
  if (!text) {
    return "";
  }
  return text.replace("T", " ").slice(0, 16);
}

function pickStatusLabel(status) {
  const map = {
    pending_payment: "待支付",
    pending_delivery: "待配送",
    delivering: "配送中",
    completed: "已完成",
    cancelled: "已取消",
    refunding: "售后中",
    submitted: "已提交",
    processing: "处理中",
    resolved: "已解决",
    closed: "已关闭"
  };
  return map[status] || status;
}

module.exports = {
  imageUrl,
  formatPrice,
  formatDateText,
  pickStatusLabel
};
