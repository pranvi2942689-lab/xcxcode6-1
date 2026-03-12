Component({
  properties: {
    goods: {
      type: Object,
      value: null
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
