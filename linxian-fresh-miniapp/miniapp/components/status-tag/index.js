const statusTextMap = {
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

const classMap = {
  pending_payment: "warning",
  pending_delivery: "success",
  delivering: "warning",
  completed: "plain",
  cancelled: "danger",
  refunding: "warning",
  submitted: "success",
  processing: "warning",
  resolved: "success",
  closed: "plain"
};

Component({
  properties: {
    status: {
      type: String,
      value: ""
    },
    text: {
      type: String,
      value: ""
    }
  },
  data: {
    label: "",
    className: ""
  },
  observers: {
    "status,text": function updateTag(status, text) {
      this.setData({
        label: text || statusTextMap[status] || status,
        className: classMap[status] || "plain"
      });
    }
  }
});
