Component({
  properties: {
    icon: {
      type: String,
      value: "🛒"
    },
    title: {
      type: String,
      value: "暂无内容"
    },
    desc: {
      type: String,
      value: "换个条件再试试"
    },
    actionText: {
      type: String,
      value: ""
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent("action");
    }
  }
});
