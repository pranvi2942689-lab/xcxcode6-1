Component({
  properties: {
    quantity: {
      type: Number,
      value: 0
    },
    amount: {
      type: String,
      value: '0.00'
    },
    disabled: {
      type: Boolean,
      value: true
    },
    buttonText: {
      type: String,
      value: '确认点单'
    }
  },
  data: {
    summaryText: '尚未选择菜品'
  },
  observers: {
    quantity(quantity) {
      this.setData({
        summaryText: quantity > 0 ? `已选 ${quantity} 份` : '尚未选择菜品'
      });
    }
  },
  methods: {
    handleSubmit() {
      if (this.properties.disabled) {
        return;
      }

      this.triggerEvent('submit');
    }
  }
});
