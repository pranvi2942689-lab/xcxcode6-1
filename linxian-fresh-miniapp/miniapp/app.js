const api = require("./services/api");
const storage = require("./utils/storage");

App({
  globalData: {
    systemConfig: null,
    theme: null,
    currentCommunity: null,
    userProfile: storage.getUserProfile()
  },

  async onLaunch() {
    try {
      const [config, communities] = await Promise.all([
        api.getConfig(),
        api.getCommunities()
      ]);
      this.globalData.systemConfig = config;
      this.globalData.theme = config.theme;
      const savedCommunity = storage.getCurrentCommunity();
      const fallbackCommunity = savedCommunity || communities.find((item) => item.isOpen) || communities[0] || null;
      if (fallbackCommunity) {
        storage.setCurrentCommunity(fallbackCommunity);
        this.globalData.currentCommunity = fallbackCommunity;
      }
    } catch (error) {
      console.error("[app:onLaunch]", error);
    }
  },

  setCurrentCommunity(community) {
    storage.setCurrentCommunity(community);
    this.globalData.currentCommunity = community;
  },

  setUserProfile(profile) {
    storage.setUserProfile(profile);
    this.globalData.userProfile = profile;
  }
});
