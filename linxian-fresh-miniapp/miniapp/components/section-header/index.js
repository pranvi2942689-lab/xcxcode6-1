Component({
  properties: {
    title: String,
    subtitle: String,
    actionText: {
      type: String,
      value: "更多"
    },
    showAction: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent("action");
    }
  }
});
