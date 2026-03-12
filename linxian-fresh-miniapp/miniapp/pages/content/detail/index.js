const api = require("../../../services/api");

Page({
  data: {
    content: null
  },
  async onLoad(options) {
    const content = await api.getContentDetail(options.id);
    this.setData({ content });
  }
});
