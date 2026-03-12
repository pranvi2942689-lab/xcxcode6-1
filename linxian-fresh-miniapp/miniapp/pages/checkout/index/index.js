const api = require("../../../services/api");
const storage = require("../../../utils/storage");
const auth = require("../../../utils/auth");

Page({
  data: {
    address: null,
    preview: null,
    remark: "",
    goodsId: "",
    quantity: 1,
    deliverySlot: "",
    selectedCoupon: null
  },

  async onLoad(options) {
    if (!(await auth.ensureLogin())) {
      return;
    }
    this.setData({
      goodsId: options.goodsId || "",
      quantity: Number(options.quantity || 1)
    });
  },

  async onShow() {
    if (!auth.hasLogin()) {
      return;
    }
    const selectedCoupon = storage.getSelectedCoupon();
    const selectedAddress = storage.getCurrentAddress();
    this.setData({
      selectedCoupon,
      address: selectedAddress || this.data.address
    });
    this.fetchPreview();
  },

  async fetchPreview() {
    const addresses = await api.getAddressList();
    const address = this.data.address || addresses.find((item) => item.isDefault) || addresses[0] || null;
    const community = storage.getCurrentCommunity();
    const payload = {
      addressId: address && address.id,
      communityId: address ? "" : (community && community.id),
      userCouponId: this.data.selectedCoupon && this.data.selectedCoupon.id
    };
    if (this.data.goodsId) {
      payload.items = [{ goodsId: this.data.goodsId, quantity: this.data.quantity }];
    }
    const preview = await api.orderPreview(payload);
    this.setData({
      address,
      preview,
      deliverySlot: this.data.deliverySlot || (preview.deliverySlots[0] && preview.deliverySlots[0].label) || ""
    });
  },

  updateRemark(event) {
    this.setData({ remark: event.detail.value });
  },

  chooseAddress() {
    wx.navigateTo({ url: "/pages/address/list/index?selectMode=1" });
  },

  chooseCoupon() {
    wx.navigateTo({ url: "/pages/coupon/my/index?selectMode=1" });
  },

  chooseSlot(event) {
    this.setData({
      deliverySlot: event.currentTarget.dataset.value
    });
  },

  async submitOrder() {
    if (!this.data.address) {
      wx.showToast({ title: "请先选择地址", icon: "none" });
      return;
    }
    const payload = {
      addressId: this.data.address.id,
      userCouponId: this.data.selectedCoupon && this.data.selectedCoupon.id,
      deliverySlot: this.data.deliverySlot,
      remark: this.data.remark
    };
    if (this.data.goodsId) {
      payload.items = [{ goodsId: this.data.goodsId, quantity: this.data.quantity }];
    }
    const order = await api.orderCreate(payload);
    await api.orderPay({ orderId: order.id });
    storage.setSelectedCoupon(null);
    wx.redirectTo({
      url: `/pages/order/success/index?id=${order.id}&orderNo=${order.orderNo}`
    });
  }
});
