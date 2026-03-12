Component({
  properties: {
    order: {
      type: Object,
      value: null
    }
  },
  data: {
    canPay: false,
    canCancel: false,
    canConfirm: false,
    canService: false
  },
  observers: {
    order: function updateState(order) {
      if (!order) {
        return;
      }
      this.setData({
        canPay: order.status === "pending_payment",
        canCancel: order.status === "pending_payment" || order.status === "pending_delivery",
        canConfirm: order.status === "delivering",
        canService: order.status === "completed"
      });
    }
  },
  methods: {
    tapCard() {
      this.triggerEvent("tap", this.data.order);
    },
    tapAction(event) {
      const action = event.currentTarget.dataset.action;
      this.triggerEvent("action", {
        action,
        order: this.data.order
      });
    }
  }
});
