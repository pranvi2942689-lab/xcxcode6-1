Component({
  properties: {
    value: {
      type: Number,
      value: 1
    },
    min: {
      type: Number,
      value: 1
    },
    max: {
      type: Number,
      value: 99
    }
  },
  methods: {
    change(step) {
      const next = Math.max(this.data.min, Math.min(this.data.value + step, this.data.max));
      this.triggerEvent("change", next);
    },
    handleMinus() {
      this.change(-1);
    },
    handlePlus() {
      this.change(1);
    }
  }
});
