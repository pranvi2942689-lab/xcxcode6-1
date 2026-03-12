Component({
  properties: {
    community: {
      type: Object,
      value: null
    },
    selected: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent("tap", this.data.community);
    }
  }
});
