const api = require("../../../services/api");
const storage = require("../../../utils/storage");

Page({
  data: {
    form: {
      id: "",
      name: "",
      phone: "",
      communityId: "",
      communityName: "",
      detail: "",
      houseNumber: "",
      tag: "家",
      isDefault: true
    }
  },

  async onLoad(options) {
    const currentCommunity = storage.getCurrentCommunity();
    if (options.id) {
      const list = await api.getAddressList();
      const target = list.find((item) => item.id === options.id);
      if (target) {
        this.setData({ form: target });
      }
    } else if (currentCommunity) {
      this.setData({
        form: {
          ...this.data.form,
          communityId: currentCommunity.id,
          communityName: currentCommunity.name
        }
      });
    }
  },

  handleInput(event) {
    const key = event.currentTarget.dataset.key;
    this.setData({
      [`form.${key}`]: event.detail.value
    });
  },

  toggleDefault() {
    this.setData({
      "form.isDefault": !this.data.form.isDefault
    });
  },

  async submit() {
    await api.saveAddress(this.data.form);
    wx.showToast({ title: "保存成功", icon: "success" });
    setTimeout(() => wx.navigateBack(), 400);
  }
});
