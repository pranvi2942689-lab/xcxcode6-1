const api = require("../../../services/api");

const TYPE_OPTIONS = [
  { label: "退款申请", value: "refund" },
  { label: "品质问题", value: "quality" },
  { label: "配送问题", value: "delivery" }
];

Page({
  data: {
    typeOptions: TYPE_OPTIONS,
    orders: [],
    tickets: [],
    selectedOrderText: "请选择订单",
    form: {
      orderId: "",
      type: "refund",
      reason: "",
      remark: ""
    }
  },

  async onLoad(options) {
    const orders = await api.getOrderList({ status: "all" });
    const tickets = await api.getServiceTickets();
    this.setData({
      orders,
      tickets,
      selectedOrderText: options.orderId || (orders[0] && orders[0].orderNo) || "请选择订单",
      "form.orderId": options.orderId || (orders[0] && orders[0].id) || ""
    });
  },

  bindPickerChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      "form.orderId": this.data.orders[index].id,
      selectedOrderText: this.data.orders[index].orderNo
    });
  },

  bindTypeChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      "form.type": this.data.typeOptions[index].value
    });
  },

  handleInput(event) {
    const key = event.currentTarget.dataset.key;
    this.setData({
      [`form.${key}`]: event.detail.value
    });
  },

  async submit() {
    await api.createServiceTicket(this.data.form);
    wx.showToast({ title: "已提交", icon: "success" });
    const tickets = await api.getServiceTickets();
    this.setData({
      tickets,
      form: {
        orderId: this.data.form.orderId,
        type: "refund",
        reason: "",
        remark: ""
      }
    });
  }
});
