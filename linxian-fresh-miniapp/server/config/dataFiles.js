const { dataDir } = require("./env");

const files = {
  users: "users.json",
  admins: "admins.json",
  communities: "communities.json",
  categories: "categories.json",
  goods: "goods.json",
  banners: "banners.json",
  sections: "sections.json",
  coupons: "coupons.json",
  userCoupons: "userCoupons.json",
  orders: "orders.json",
  addresses: "addresses.json",
  carts: "carts.json",
  contents: "contents.json",
  serviceTickets: "serviceTickets.json",
  systemConfig: "systemConfig.json"
};

module.exports = {
  dataDir,
  files
};
