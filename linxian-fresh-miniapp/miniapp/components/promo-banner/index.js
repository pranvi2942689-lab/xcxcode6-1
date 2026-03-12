Component({
  properties: {
    item: {
      type: Object,
      value: null
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent("tap", this.data.item);
    }
  }
});
