Component({
  properties: {
    text: {
      type: String,
      value: ""
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent("tap");
    }
  }
});
