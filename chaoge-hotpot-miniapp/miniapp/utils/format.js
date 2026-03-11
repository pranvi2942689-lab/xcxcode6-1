const ORDER_STATUS_MAP = {
  pending: '待确认',
  confirmed: '已下单',
  completed: '已完成',
  canceled: '已取消'
};

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatAmount(amount) {
  return Number(amount || 0).toFixed(2);
}

function formatDateTime(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getOrderStatusText(status) {
  return ORDER_STATUS_MAP[status] || ORDER_STATUS_MAP.pending;
}

function summarizeOrderItems(items) {
  if (!Array.isArray(items) || !items.length) {
    return '暂无菜品';
  }

  const names = items.slice(0, 2).map((item) => item.name);
  const remainCount = items.length - names.length;
  return remainCount > 0 ? `${names.join('、')} 等${items.length}项` : names.join('、');
}

module.exports = {
  ORDER_STATUS_MAP,
  formatAmount,
  formatDateTime,
  getOrderStatusText,
  summarizeOrderItems
};
