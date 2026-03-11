const api = require('../../services/api');
const storage = require('../../utils/storage');
const { formatAmount } = require('../../utils/format');

function getErrorType(error) {
  const message = (error && error.message) || '';
  return message.includes('request:fail') ? 'network' : 'error';
}

Page({
  data: {
    loading: true,
    errorType: '',
    categories: [],
    dishes: [],
    selectedCategoryId: '',
    currentCategoryName: '菜品列表',
    visibleDishes: [],
    cartMap: {},
    cartSummary: {
      totalQuantity: 0,
      totalAmount: 0
    },
    cartAmountText: '0.00',
    cartDisabled: true,
    detailVisible: false,
    detailLoading: false,
    detailErrorType: '',
    detailDish: null,
    detailQuantity: 0
  },

  onLoad() {
    this.fetchMenuData();
  },

  onShow() {
    this.refreshCartState();
  },

  getCategoryName(categories, selectedCategoryId) {
    const currentCategory = categories.find((item) => item.id === selectedCategoryId);
    return currentCategory ? currentCategory.name : '菜品列表';
  },

  decorateCategories(categories, selectedCategoryId) {
    return categories.map((category) => ({
      ...category,
      itemClass: category.id === selectedCategoryId ? 'category-item category-item--active' : 'category-item'
    }));
  },

  filterVisibleDishes(selectedCategoryId, dishes) {
    return dishes.filter((dish) => dish.categoryId === selectedCategoryId);
  },

  buildVisibleDishes(selectedCategoryId, dishes, cartMap) {
    return this.filterVisibleDishes(selectedCategoryId, dishes).map((dish) => ({
      ...dish,
      cartQuantity: cartMap[dish.id] || 0
    }));
  },

  refreshCartState() {
    const cartMap = storage.getCartMap();
    const cartSummary = storage.getCartSummary();
    const detailDishId = this.data.detailDish && this.data.detailDish.id;

    this.setData({
      cartMap,
      cartSummary,
      cartAmountText: formatAmount(cartSummary.totalAmount),
      cartDisabled: cartSummary.totalQuantity === 0,
      visibleDishes: this.buildVisibleDishes(this.data.selectedCategoryId, this.data.dishes, cartMap),
      detailQuantity: detailDishId ? cartMap[detailDishId] || 0 : 0
    });
  },

  async fetchMenuData() {
    this.setData({
      loading: true,
      errorType: ''
    });

    try {
      const [categories, dishes] = await Promise.all([api.getCategories(), api.getDishes()]);
      const selectedCategoryId = this.data.selectedCategoryId || (categories[0] && categories[0].id) || '';

      this.setData({
        loading: false,
        categories: this.decorateCategories(categories, selectedCategoryId),
        dishes,
        selectedCategoryId,
        currentCategoryName: this.getCategoryName(categories, selectedCategoryId)
      }, () => {
        this.refreshCartState();
      });
    } catch (error) {
      this.setData({
        loading: false,
        errorType: getErrorType(error)
      });
    }
  },

  handleSelectCategory(event) {
    const selectedCategoryId = event.currentTarget.dataset.id;
    const categories = this.decorateCategories(this.data.categories, selectedCategoryId);

    this.setData({
      categories,
      selectedCategoryId,
      currentCategoryName: this.getCategoryName(categories, selectedCategoryId)
    }, () => {
      this.refreshCartState();
    });
  },

  handleDishQuantityChange(event) {
    const { dish, quantity } = event.detail;
    storage.updateCartItem(dish, quantity);
    this.refreshCartState();
  },

  async handleViewDetail(event) {
    const { dishId } = event.detail;

    this.setData({
      detailVisible: true,
      detailLoading: true,
      detailErrorType: '',
      detailDish: null
    });

    try {
      const detailDish = await api.getDishDetail(dishId);
      const cartMap = storage.getCartMap();

      this.setData({
        detailLoading: false,
        detailDish,
        detailQuantity: cartMap[dishId] || 0
      });
    } catch (error) {
      this.setData({
        detailLoading: false,
        detailErrorType: getErrorType(error)
      });
    }
  },

  handleDetailQuantityChange(event) {
    if (!this.data.detailDish) {
      return;
    }

    storage.updateCartItem(this.data.detailDish, event.detail.value);
    this.refreshCartState();
  },

  closeDetail() {
    this.setData({
      detailVisible: false,
      detailLoading: false,
      detailErrorType: '',
      detailDish: null,
      detailQuantity: 0
    });
  },

  goConfirm() {
    if (this.data.cartSummary.totalQuantity <= 0) {
      return;
    }

    wx.navigateTo({
      url: '/pages/confirm/index'
    });
  },

  noop() {}
});
