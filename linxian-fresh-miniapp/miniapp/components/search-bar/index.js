Component({
  properties: {
    value: {
      type: String,
      value: ""
    },
    placeholder: {
      type: String,
      value: "搜索新鲜食材"
    },
    actionText: {
      type: String,
      value: "搜索"
    },
    showAction: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent("tap");
    },
    handleInput(event) {
      this.triggerEvent("change", event.detail.value);
    },
    handleConfirm(event) {
      this.triggerEvent("search", event.detail.value || this.data.value);
    },
    handleAction() {
      this.triggerEvent("search", this.data.value);
    }
  }
});
