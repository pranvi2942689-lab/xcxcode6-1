Component({
  properties: {
    tabs: {
      type: Array,
      value: []
    },
    value: {
      type: String,
      value: ""
    }
  },
  methods: {
    handleTap(event) {
      const value = event.currentTarget.dataset.value;
      this.triggerEvent("change", value);
    }
  }
});
