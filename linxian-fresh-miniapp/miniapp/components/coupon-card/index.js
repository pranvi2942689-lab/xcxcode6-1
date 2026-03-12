Component({
  properties: {
    coupon: {
      type: Object,
      value: null
    },
    mode: {
      type: String,
      value: "default"
    }
  },
  data: {
    amountText: "",
    thresholdText: "",
    titleText: "",
    descText: "",
    statusText: ""
  },
  observers: {
    coupon: function updateView(coupon) {
      if (!coupon) {
        return;
      }
      const template = coupon.template || {};
      this.setData({
        amountText: coupon.discountAmount || template.discountAmount || 0,
        thresholdText: coupon.thresholdAmount || template.thresholdAmount || 0,
        titleText: coupon.title || template.title || "",
        descText: `${coupon.scopeType || template.scopeType || "all"} · ${coupon.endAt || template.endAt || ""}`,
        statusText: coupon.claimed ? "已领取" : (coupon.status || template.status || "")
      });
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent("tap", this.data.coupon);
    }
  }
});
