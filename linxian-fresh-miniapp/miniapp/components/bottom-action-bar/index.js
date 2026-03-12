Component({
  properties: {
    leftText: String,
    leftSubText: String,
    buttonText: String,
    disabled: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    handleTap() {
      if (!this.data.disabled) {
        this.triggerEvent("submit");
      }
    }
  }
});
