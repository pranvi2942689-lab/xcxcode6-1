Component({
  properties: {
    address: {
      type: Object,
      value: null
    },
    selectable: {
      type: Boolean,
      value: false
    },
    selected: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent("tap", this.data.address);
    },
    handleEdit() {
      this.triggerEvent("edit", this.data.address);
    }
  }
});
