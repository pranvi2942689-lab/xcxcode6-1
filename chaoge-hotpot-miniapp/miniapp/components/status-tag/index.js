const STATUS_CONFIG = {
  pending: {
    label: '待确认',
    theme: 'pending'
  },
  confirmed: {
    label: '已下单',
    theme: 'confirmed'
  },
  completed: {
    label: '已完成',
    theme: 'completed'
  },
  canceled: {
    label: '已取消',
    theme: 'canceled'
  }
};

Component({
  properties: {
    status: {
      type: String,
      value: 'pending'
    }
  },
  data: {
    current: STATUS_CONFIG.pending
  },
  observers: {
    status(status) {
      this.setData({
        current: STATUS_CONFIG[status] || STATUS_CONFIG.pending
      });
    }
  }
});
