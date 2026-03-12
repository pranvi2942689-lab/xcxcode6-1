const KEYS = {
  token: "token",
  userProfile: "userProfile",
  currentCommunity: "currentCommunity",
  currentAddress: "currentAddress",
  cartMap: "cartMap",
  searchHistory: "searchHistory",
  favoriteIds: "favoriteIds",
  recentViewed: "recentViewed",
  selectedCoupon: "selectedCoupon"
};

function get(key, fallback = null) {
  try {
    const value = wx.getStorageSync(KEYS[key]);
    return value === "" ? fallback : value || fallback;
  } catch (error) {
    return fallback;
  }
}

function set(key, value) {
  wx.setStorageSync(KEYS[key], value);
  return value;
}

function remove(key) {
  wx.removeStorageSync(KEYS[key]);
}

module.exports = {
  KEYS,
  get,
  set,
  remove,
  getToken: () => get("token", ""),
  setToken: (value) => set("token", value),
  getUserProfile: () => get("userProfile", null),
  setUserProfile: (value) => set("userProfile", value),
  getCurrentCommunity: () => get("currentCommunity", null),
  setCurrentCommunity: (value) => set("currentCommunity", value),
  getCurrentAddress: () => get("currentAddress", null),
  setCurrentAddress: (value) => set("currentAddress", value),
  getCartMap: () => get("cartMap", {}),
  setCartMap: (value) => set("cartMap", value),
  getSearchHistory: () => get("searchHistory", []),
  setSearchHistory: (value) => set("searchHistory", value),
  getFavoriteIds: () => get("favoriteIds", []),
  setFavoriteIds: (value) => set("favoriteIds", value),
  getRecentViewed: () => get("recentViewed", []),
  setRecentViewed: (value) => set("recentViewed", value),
  getSelectedCoupon: () => get("selectedCoupon", null),
  setSelectedCoupon: (value) => set("selectedCoupon", value)
};
