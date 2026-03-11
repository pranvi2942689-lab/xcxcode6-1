const TYPE_CONFIG = {
  empty: {
    iconText: '空',
    title: '暂无内容',
    description: '当前没有可展示的数据。'
  },
  loading: {
    iconText: '',
    title: '加载中',
    description: '正在整理潮阁席间内容。'
  },
  error: {
    iconText: '错',
    title: '加载失败',
    description: '请稍后重试。'
  },
  network: {
    iconText: '网',
    title: '网络异常',
    description: '请检查网络后重试。'
  },
  soldout: {
    iconText: '售',
    title: '暂时售罄',
    description: '当前菜品暂不可点。'
  }
};

Component({
  properties: {
    type: {
      type: String,
      value: 'empty'
    },
    title: {
      type: String,
      value: ''
    },
    description: {
      type: String,
      value: ''
    },
    buttonText: {
      type: String,
      value: ''
    }
  },
  data: {
    resolvedType: 'empty',
    resolvedTitle: TYPE_CONFIG.empty.title,
    resolvedDescription: TYPE_CONFIG.empty.description,
    iconText: TYPE_CONFIG.empty.iconText,
    isLoading: false
  },
  observers: {
    'type, title, description': function (type, title, description) {
      const fallback = TYPE_CONFIG[type] || TYPE_CONFIG.empty;
      this.setData({
        resolvedType: type,
        resolvedTitle: title || fallback.title,
        resolvedDescription: description || fallback.description,
        iconText: fallback.iconText,
        isLoading: type === 'loading'
      });
    }
  },
  methods: {
    handleAction() {
      this.triggerEvent('action');
    }
  }
});
