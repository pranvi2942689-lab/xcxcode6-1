Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    title: String,
    buttonText: {
      type: String,
      value: "确认"
    }
  },
  methods: {
    close() {
      this.triggerEvent("close");
    },
    confirm() {
      this.triggerEvent("confirm");
    }
  }
});
