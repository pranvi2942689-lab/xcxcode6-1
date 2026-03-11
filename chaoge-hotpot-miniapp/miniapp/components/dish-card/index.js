Component({
  properties: {
    dish: {
      type: Object,
      value: {}
    },
    quantity: {
      type: Number,
      value: 0
    },
    showStepper: {
      type: Boolean,
      value: true
    }
  },
  data: {
    rootClass: 'dish-card'
  },
  observers: {
    dish(dish) {
      this.setData({
        rootClass: dish && dish.isSoldOut ? 'dish-card dish-card--soldout' : 'dish-card'
      });
    }
  },
  methods: {
    noop() {},
    handleViewDetail() {
      this.triggerEvent('viewdetail', {
        dishId: this.properties.dish.id
      });
    },
    handleQtyChange(event) {
      this.triggerEvent('changequantity', {
        dishId: this.properties.dish.id,
        quantity: event.detail.value,
        dish: this.properties.dish
      });
    }
  }
});
