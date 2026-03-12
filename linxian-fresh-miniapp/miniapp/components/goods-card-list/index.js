Component({
  properties: {
    goods: {
      type: Object,
      value: null
    },
    actionText: {
      type: String,
      value: "加入"
    },
    showAction: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent("tap", this.data.goods);
    },
    handleAdd() {
      this.triggerEvent("add", this.data.goods);
    }
  }
});
