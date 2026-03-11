Component({
  properties: {
    text: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'primary'
    },
    size: {
      type: String,
      value: 'default'
    },
    block: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    loading: {
      type: Boolean,
      value: false
    },
    loadingText: {
      type: String,
      value: '处理中...'
    }
  },
  data: {
    rootClass: 'ui-button ui-button--primary ui-button--default',
    displayText: '',
    isInactive: false
  },
  observers: {
    'type, size, block, disabled, loading, text, loadingText': function (
      type,
      size,
      block,
      disabled,
      loading,
      text,
      loadingText
    ) {
      const classes = ['ui-button', `ui-button--${type}`, `ui-button--${size}`];

      if (block) {
        classes.push('ui-button--block');
      }

      if (disabled || loading) {
        classes.push('ui-button--disabled');
      }

      this.setData({
        rootClass: classes.join(' '),
        displayText: loading ? loadingText : text,
        isInactive: disabled || loading
      });
    }
  },
  methods: {
    handleTap() {
      if (this.properties.disabled || this.properties.loading) {
        return;
      }

      this.triggerEvent('tap');
    }
  }
});
