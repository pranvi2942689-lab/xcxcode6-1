Component({
  properties: {
    value: {
      type: Number,
      value: 0
    },
    min: {
      type: Number,
      value: 0
    },
    max: {
      type: Number,
      value: 99
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },
  data: {
    minusClass: 'qty-stepper__button',
    plusClass: 'qty-stepper__button qty-stepper__button--accent',
    minusDisabled: false,
    plusDisabled: false
  },
  observers: {
    'value, min, max, disabled': function (value, min, max, disabled) {
      const minusDisabled = value <= min || disabled;
      const plusDisabled = value >= max || disabled;

      this.setData({
        minusDisabled,
        plusDisabled,
        minusClass: minusDisabled
          ? 'qty-stepper__button qty-stepper__button--disabled'
          : 'qty-stepper__button',
        plusClass: plusDisabled
          ? 'qty-stepper__button qty-stepper__button--accent qty-stepper__button--disabled'
          : 'qty-stepper__button qty-stepper__button--accent'
      });
    }
  },
  methods: {
    noop() {},
    updateValue(delta) {
      if (this.properties.disabled) {
        return;
      }

      const nextValue = this.properties.value + delta;

      if (nextValue < this.properties.min || nextValue > this.properties.max) {
        return;
      }

      this.triggerEvent('change', { value: nextValue });
    },
    handleMinus() {
      this.updateValue(-1);
    },
    handlePlus() {
      this.updateValue(1);
    }
  }
});
