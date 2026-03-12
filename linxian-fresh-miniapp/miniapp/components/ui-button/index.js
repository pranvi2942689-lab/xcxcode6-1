Component({
  properties: {
    text: String,
    variant: {
      type: String,
      value: "primary"
    },
    size: {
      type: String,
      value: "md"
    },
    block: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    handleTap() {
      if (this.data.disabled) {
        return;
      }
      this.triggerEvent("tap");
    }
  }
});
