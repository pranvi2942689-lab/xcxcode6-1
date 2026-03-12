const fs = require("fs/promises");
const path = require("path");
const { dataDir, staticDir } = require("../config/env");

const now = new Date("2026-03-12T08:00:00+08:00");
const iso = (offset = 0) => {
  const date = new Date(now);
  date.setDate(date.getDate() + offset);
  return date.toISOString();
};
const dateOnly = (offset = 0) => iso(offset).slice(0, 10);

const assetDefs = {
  "avatar-default.svg": { width: 320, height: 320, bg: "#EAF8EF", title: "邻鲜", subtitle: "USER", accent: "#22B45A" },
  "goods-spinach.svg": { bg: "#F3FBF6", title: "菠菜", subtitle: "Fresh", accent: "#22B45A" },
  "goods-tomato.svg": { bg: "#FFF4F2", title: "番茄", subtitle: "Tomato", accent: "#E34D3E" },
  "goods-avocado.svg": { bg: "#F7FBF0", title: "牛油果", subtitle: "Avocado", accent: "#7ACB5C" },
  "goods-orange.svg": { bg: "#FFF7EE", title: "脐橙", subtitle: "Orange", accent: "#FF9F1A" },
  "goods-shrimp.svg": { bg: "#FFF6F5", title: "虾仁", subtitle: "Shrimp", accent: "#FFA899" },
  "goods-beef.svg": { bg: "#FFF6F5", title: "肥牛", subtitle: "Beef", accent: "#E34D3E" },
  "goods-egg.svg": { bg: "#FFF8EF", title: "鸡蛋", subtitle: "Egg", accent: "#FFCC66" },
  "goods-milk.svg": { bg: "#F4F8FF", title: "鲜奶", subtitle: "Milk", accent: "#7AB6FF" },
  "goods-rice.svg": { bg: "#F9F7F2", title: "香米", subtitle: "Rice", accent: "#C7A77A" },
  "goods-oil.svg": { bg: "#FFF8EC", title: "花生油", subtitle: "Oil", accent: "#FFDE80" },
  "goods-tofu.svg": { bg: "#F6FBF5", title: "豆腐", subtitle: "Tofu", accent: "#D8E4D9" },
  "goods-yogurt.svg": { bg: "#FFF4F8", title: "酸奶", subtitle: "Yogurt", accent: "#FF9FC4" },
  "goods-detergent.svg": { bg: "#EEF6FF", title: "洗洁精", subtitle: "Home", accent: "#7AB6FF" },
  "goods-potato.svg": { bg: "#FBF7EE", title: "土豆", subtitle: "Potato", accent: "#CDA56A" },
  "banner-fresh.svg": { width: 690, height: 260, bg: "#22B45A", title: "新鲜直采", subtitle: "每日清晨到仓 当日配送到家", accent: "#8FDCA9", light: true },
  "banner-fruit.svg": { width: 690, height: 260, bg: "#FFE1B3", title: "鲜果早市", subtitle: "水果第二件半价 限今日 22:00", accent: "#FF9F1A" },
  "banner-group.svg": { width: 690, height: 260, bg: "#EAF8EF", title: "社区拼团专区", subtitle: "团购爆款 低至 7.8 折", accent: "#22B45A" },
  "banner-sale.svg": { width: 690, height: 260, bg: "#FFD8D2", title: "限时秒杀", subtitle: "肉禽蛋奶 低价冲量", accent: "#E34D3E" },
  "banner-newcomer.svg": { width: 690, height: 260, bg: "#22B45A", title: "新人礼包", subtitle: "10 / 20 / 50 元券包立领", accent: "#FF9F1A", light: true },
  "banner-delivery.svg": { width: 690, height: 260, bg: "#EAF8EF", title: "最快 30 分钟送达", subtitle: "社区前置仓配送 营业时间内稳定履约", accent: "#22B45A" }
};

function createSvg(def) {
  const width = def.width || 640;
  const height = def.height || 640;
  const titleColor = def.light ? "#FFFFFF" : "#1F2A37";
  const subtitleColor = def.light ? "#EAF8EF" : "#4B5563";
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" rx="${Math.round(width * 0.08)}" fill="${def.bg}"/>`,
    `<circle cx="${Math.round(width * 0.78)}" cy="${Math.round(height * 0.28)}" r="${Math.round(width * 0.12)}" fill="${def.accent}" opacity="0.18"/>`,
    `<rect x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.62)}" width="${Math.round(width * 0.28)}" height="${Math.round(height * 0.12)}" rx="${Math.round(height * 0.06)}" fill="${def.accent}" opacity="0.18"/>`,
    `<text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.38)}" fill="${titleColor}" font-size="${Math.round(width * 0.08)}" font-family="Arial" font-weight="700">${def.title}</text>`,
    `<text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.52)}" fill="${subtitleColor}" font-size="${Math.round(width * 0.045)}" font-family="Arial">${def.subtitle}</text>`,
    `</svg>`
  ].join("");
}

const img = (name) => `/static/mock/${name}`;

function g(id, name, categoryId, cover, price, originalPrice, stock, soldCount, sort, extra = {}) {
  return {
    id,
    name,
    subtitle: extra.subtitle || "",
    categoryId,
    cover,
    images: [cover],
    unit: extra.unit || "份",
    specText: extra.specText || "1 份",
    price,
    originalPrice,
    stock,
    soldCount,
    tags: extra.tags || [],
    isHot: Boolean(extra.isHot),
    isNew: Boolean(extra.isNew),
    isOffline: Boolean(extra.isOffline),
    communityIds: extra.communityIds || ["c1001", "c1002"],
    detailImages: [cover],
    desc: extra.desc || "",
    nutritionInfo: extra.nutritionInfo || "",
    storageTips: extra.storageTips || "",
    sectionTypes: extra.sectionTypes || [],
    sort,
    updatedAt: iso(-1)
  };
}

const goods = [
  g("g1001", "云南高山菠菜", "cat1001", img("goods-spinach.svg"), 6.8, 8.9, 160, 632, 1, { subtitle: "叶片鲜嫩，涮煮清甜", specText: "300g/份", tags: ["当季鲜蔬", "绿叶菜"], isHot: true, isNew: true, sectionTypes: ["today_recommend", "hot_sale"], desc: "清晨采收冷链入仓，适合清炒、火锅、煮面。", nutritionInfo: "富含膳食纤维、叶酸、铁元素", storageTips: "冷藏保存 0-4℃，建议 2 天内食用" }),
  g("g1002", "沙瓤番茄", "cat1001", img("goods-tomato.svg"), 7.9, 9.9, 120, 518, 2, { subtitle: "自然熟成，汁多味浓", unit: "袋", specText: "500g/袋", tags: ["酸甜多汁"], isHot: true, sectionTypes: ["today_recommend"], desc: "适合凉拌、炒蛋、做汤。", nutritionInfo: "富含番茄红素和维生素 C", storageTips: "常温通风保存，熟透后冷藏", communityIds: ["c1001", "c1002", "c1003"] }),
  g("g1003", "即食牛油果", "cat1001", img("goods-avocado.svg"), 15.9, 18.9, 84, 246, 3, { subtitle: "软糯绵密，沙拉好搭档", unit: "个", specText: "2 枚装", tags: ["轻食搭配", "进口鲜果"], isNew: true, sectionTypes: ["newcomer", "today_recommend"] }),
  g("g1004", "赣南脐橙", "cat1001", img("goods-orange.svg"), 29.9, 39.9, 58, 308, 4, { subtitle: "果肉细嫩，酸甜平衡", unit: "箱", specText: "4 斤礼盒装", tags: ["水果爆款", "家庭装"], isHot: true, sectionTypes: ["hot_sale", "community_group"] }),
  g("g1005", "鲜活白虾仁", "cat1002", img("goods-shrimp.svg"), 26.9, 32.9, 66, 201, 5, { subtitle: "净虾处理，炒菜火锅都方便", unit: "盒", specText: "250g/盒", tags: ["家庭爆款", "净菜净肉"], isNew: true, sectionTypes: ["today_recommend", "community_group"] }),
  g("g1006", "谷饲肥牛卷", "cat1002", img("goods-beef.svg"), 38.9, 45.9, 92, 412, 6, { subtitle: "火锅涮肉优选", unit: "盒", specText: "300g/盒", tags: ["肉类热卖", "冷鲜"], isHot: true, sectionTypes: ["hot_sale", "flash_sale"] }),
  g("g1007", "林间散养鲜鸡蛋", "cat1002", img("goods-egg.svg"), 12.9, 15.9, 140, 520, 7, { subtitle: "蛋黄饱满，适合全家早餐", unit: "盒", specText: "10 枚装", tags: ["早餐必备"], isHot: true, sectionTypes: ["today_recommend", "community_group"], communityIds: ["c1001", "c1002", "c1003"] }),
  g("g1008", "娟姗鲜牛奶", "cat1004", img("goods-milk.svg"), 16.8, 19.8, 76, 278, 8, { subtitle: "巴氏鲜奶，每日冷链送达", unit: "瓶", specText: "950ml/瓶", tags: ["早餐搭配", "冷链直送"], isNew: true, sectionTypes: ["newcomer"] }),
  g("g1009", "五常香米", "cat1003", img("goods-rice.svg"), 59.9, 69.9, 45, 192, 9, { subtitle: "米香浓郁，家庭常备", unit: "袋", specText: "5kg/袋", tags: ["主食常备"], sectionTypes: ["community_group"], communityIds: ["c1001", "c1002", "c1003"] }),
  g("g1010", "压榨花生油", "cat1003", img("goods-oil.svg"), 49.9, 58.9, 33, 123, 10, { subtitle: "厨房常备，浓香不腻", unit: "桶", specText: "1.8L/桶", tags: ["粮油"], sectionTypes: ["community_group"] }),
  g("g1011", "北豆腐", "cat1003", img("goods-tofu.svg"), 4.9, 5.9, 0, 167, 11, { subtitle: "当天现制，适合炖煮煎炒", unit: "盒", specText: "400g/盒", tags: ["豆制品"], sectionTypes: ["today_recommend"] }),
  g("g1012", "原味酸奶杯", "cat1004", img("goods-yogurt.svg"), 18.9, 21.9, 58, 146, 12, { subtitle: "低糖配方，饭后轻负担", unit: "组", specText: "135g/杯*4", tags: ["下午茶", "家庭装"], isNew: true, isOffline: true, sectionTypes: ["newcomer"] }),
  g("g1013", "低泡洗洁精", "cat1003", img("goods-detergent.svg"), 13.9, 16.9, 36, 88, 13, { subtitle: "厨房去油污，家庭常备", unit: "瓶", specText: "1kg/瓶", tags: ["百货"], sectionTypes: ["community_group"] }),
  g("g1014", "黄心土豆", "cat1001", img("goods-potato.svg"), 5.6, 6.8, 120, 296, 14, { subtitle: "绵软面香，炖煮炒菜都合适", unit: "袋", specText: "1kg/袋", tags: ["家常菜"], isHot: true, sectionTypes: ["hot_sale"] })
];

const seed = {
  users: [
    { id: "u1001", nickname: "王小满", phone: "13800000001", avatar: img("avatar-default.svg"), favoriteIds: ["g1001", "g1004", "g1010"], history: [{ goodsId: "g1008", viewedAt: iso(-1) }, { goodsId: "g1003", viewedAt: iso(-2) }, { goodsId: "g1001", viewedAt: iso(-3) }], couponIds: ["uc1001", "uc1002"], communityId: "c1001", createdAt: iso(-60), updatedAt: iso(-1) },
    { id: "u1002", nickname: "李橙橙", phone: "13800000002", avatar: img("avatar-default.svg"), favoriteIds: ["g1006"], history: [{ goodsId: "g1006", viewedAt: iso(-4) }], couponIds: ["uc1003"], communityId: "c1002", createdAt: iso(-45), updatedAt: iso(-2) },
    { id: "u1003", nickname: "赵团团", phone: "13800000003", avatar: img("avatar-default.svg"), favoriteIds: [], history: [], couponIds: [], communityId: "c1003", createdAt: iso(-20), updatedAt: iso(-5) }
  ],
  admins: [
    { id: "a1001", account: "admin", password: "123456", name: "系统超管", role: "super_admin", permissions: ["*"], createdAt: iso(-100) },
    { id: "a1002", account: "ops", password: "123456", name: "运营管理员", role: "operator", permissions: ["dashboard", "goods", "orders", "contents", "coupons"], createdAt: iso(-80) },
    { id: "a1003", account: "supply", password: "123456", name: "商品运营", role: "goods_manager", permissions: ["dashboard", "goods", "categories", "sections"], createdAt: iso(-70) }
  ],
  communities: [
    { id: "c1001", name: "锦绣花园社区", city: "上海市", district: "浦东新区", deliveryDesc: "前置仓配送，最快 30 分钟", minOrderAmount: 39, deliveryFee: 4, serviceHours: "07:30-22:00", isOpen: true, sort: 1, updatedAt: iso(-1) },
    { id: "c1002", name: "春申里社区", city: "上海市", district: "闵行区", deliveryDesc: "满 49 元免配送费", minOrderAmount: 49, deliveryFee: 5, serviceHours: "08:00-21:30", isOpen: true, sort: 2, updatedAt: iso(-2) },
    { id: "c1003", name: "星河家园社区", city: "上海市", district: "宝山区", deliveryDesc: "夜间下单次日晨配", minOrderAmount: 35, deliveryFee: 3, serviceHours: "06:30-20:30", isOpen: false, sort: 3, updatedAt: iso(-3) }
  ],
  categories: [
    { id: "cat1001", name: "蔬菜水果", icon: "🥬", desc: "当季直采 新鲜到家", sort: 1, isActive: true, updatedAt: iso(-1) },
    { id: "cat1002", name: "肉禽蛋奶", icon: "🥩", desc: "每日严选 冷链配送", sort: 2, isActive: true, updatedAt: iso(-1) },
    { id: "cat1003", name: "粮油百货", icon: "🛒", desc: "家庭常备 一站购齐", sort: 3, isActive: true, updatedAt: iso(-1) },
    { id: "cat1004", name: "早餐乳品", icon: "🥛", desc: "早餐搭配 即拿即走", sort: 4, isActive: true, updatedAt: iso(-2) },
    { id: "cat1005", name: "团购爆款", icon: "🔥", desc: "高频复购 性价比高", sort: 5, isActive: true, updatedAt: iso(-3) }
  ],
  goods,
  banners: [
    { id: "b1001", title: "新鲜直采", image: img("banner-fresh.svg"), linkType: "goodsList", linkValue: "today_recommend", communityIds: [], isActive: true, sort: 1, updatedAt: iso(-1) },
    { id: "b1002", title: "鲜果早市", image: img("banner-fruit.svg"), linkType: "category", linkValue: "cat1001", communityIds: [], isActive: true, sort: 2, updatedAt: iso(-1) },
    { id: "b1003", title: "社区拼团", image: img("banner-group.svg"), linkType: "goodsList", linkValue: "community_group", communityIds: ["c1001", "c1002"], isActive: true, sort: 3, updatedAt: iso(-1) },
    { id: "b1004", title: "限时秒杀", image: img("banner-sale.svg"), linkType: "goodsList", linkValue: "flash_sale", communityIds: [], isActive: true, sort: 4, updatedAt: iso(-1) },
    { id: "b1005", title: "新人礼包", image: img("banner-newcomer.svg"), linkType: "newcomer", linkValue: "newcomer", communityIds: [], isActive: true, sort: 5, updatedAt: iso(-1) },
    { id: "b1006", title: "到家配送", image: img("banner-delivery.svg"), linkType: "content", linkValue: "ct1004", communityIds: [], isActive: true, sort: 6, updatedAt: iso(-1) }
  ],
  sections: [
    { id: "s1001", title: "今日推荐", type: "today_recommend", subtitle: "餐桌高频复购，搭配省心", goodsIds: ["g1001", "g1002", "g1005", "g1007", "g1008", "g1003"], contentIds: [], communityIds: [], isActive: true, sort: 1, updatedAt: iso(-1) },
    { id: "s1002", title: "热销爆款", type: "hot_sale", subtitle: "销量口碑双高", goodsIds: ["g1001", "g1004", "g1006", "g1007", "g1014"], contentIds: [], communityIds: [], isActive: true, sort: 2, updatedAt: iso(-1) },
    { id: "s1003", title: "社区团购专区", type: "community_group", subtitle: "拼团更实惠，家庭囤货优选", goodsIds: ["g1004", "g1005", "g1007", "g1009", "g1010"], contentIds: [], communityIds: ["c1001", "c1002"], isActive: true, sort: 3, updatedAt: iso(-2) },
    { id: "s1004", title: "本周活动", type: "marketing", subtitle: "公告与活动精选", goodsIds: [], contentIds: ["ct1002", "ct1003", "ct1004"], communityIds: [], isActive: true, sort: 4, updatedAt: iso(-2) }
  ],
  coupons: [
    { id: "cp1001", title: "新人专享 10 元券", type: "cash", thresholdAmount: 39, discountAmount: 10, startAt: dateOnly(-10), endAt: dateOnly(20), status: "active", scopeType: "all", goodsIds: [], communityIds: [], sort: 1, updatedAt: iso(-1) },
    { id: "cp1002", title: "满 59 减 15", type: "cash", thresholdAmount: 59, discountAmount: 15, startAt: dateOnly(-5), endAt: dateOnly(15), status: "active", scopeType: "all", goodsIds: [], communityIds: ["c1001", "c1002"], sort: 2, updatedAt: iso(-1) },
    { id: "cp1003", title: "肉禽蛋奶专区 12 元券", type: "cash", thresholdAmount: 49, discountAmount: 12, startAt: dateOnly(-5), endAt: dateOnly(30), status: "active", scopeType: "goods", goodsIds: ["g1005", "g1006", "g1007", "g1008"], communityIds: [], sort: 3, updatedAt: iso(-2) },
    { id: "cp1004", title: "社区团购满 99 减 20", type: "cash", thresholdAmount: 99, discountAmount: 20, startAt: dateOnly(-2), endAt: dateOnly(7), status: "active", scopeType: "goods", goodsIds: ["g1004", "g1005", "g1009", "g1010"], communityIds: ["c1001", "c1002"], sort: 4, updatedAt: iso(-2) },
    { id: "cp1005", title: "已过期 8 元券", type: "cash", thresholdAmount: 29, discountAmount: 8, startAt: dateOnly(-30), endAt: dateOnly(-2), status: "expired", scopeType: "all", goodsIds: [], communityIds: [], sort: 5, updatedAt: iso(-3) },
    { id: "cp1006", title: "暂停发放 5 元券", type: "cash", thresholdAmount: 19, discountAmount: 5, startAt: dateOnly(-1), endAt: dateOnly(60), status: "disabled", scopeType: "all", goodsIds: [], communityIds: [], sort: 6, updatedAt: iso(-4) }
  ],
  userCoupons: [
    { id: "uc1001", userId: "u1001", couponId: "cp1001", status: "available", claimedAt: iso(-5), usedAt: "" },
    { id: "uc1002", userId: "u1001", couponId: "cp1002", status: "used", claimedAt: iso(-12), usedAt: iso(-10), orderId: "o1002" },
    { id: "uc1003", userId: "u1002", couponId: "cp1003", status: "available", claimedAt: iso(-2), usedAt: "" },
    { id: "uc1004", userId: "u1001", couponId: "cp1005", status: "expired", claimedAt: iso(-22), usedAt: "" },
    { id: "uc1005", userId: "u1002", couponId: "cp1004", status: "available", claimedAt: iso(-1), usedAt: "" }
  ],
  addresses: [
    { id: "addr1001", userId: "u1001", name: "王小满", phone: "13800000001", communityId: "c1001", communityName: "锦绣花园社区", detail: "锦绣花园 8 号楼", houseNumber: "802", tag: "家", isDefault: true, createdAt: iso(-20), updatedAt: iso(-1) },
    { id: "addr1002", userId: "u1001", name: "王小满", phone: "13800000001", communityId: "c1001", communityName: "锦绣花园社区", detail: "锦绣花园 12 号楼", houseNumber: "1201", tag: "父母家", isDefault: false, createdAt: iso(-15), updatedAt: iso(-1) },
    { id: "addr1003", userId: "u1002", name: "李橙橙", phone: "13800000002", communityId: "c1002", communityName: "春申里社区", detail: "春申里 2 期", houseNumber: "6-302", tag: "家", isDefault: true, createdAt: iso(-18), updatedAt: iso(-2) },
    { id: "addr1004", userId: "u1003", name: "赵团团", phone: "13800000003", communityId: "c1003", communityName: "星河家园社区", detail: "星河家园东区", houseNumber: "3-602", tag: "家", isDefault: true, createdAt: iso(-8), updatedAt: iso(-3) }
  ],
  carts: [
    { userId: "u1001", items: [{ id: "cart1001", goodsId: "g1001", quantity: 2, checked: true, specText: "300g/份", updatedAt: iso(-1) }, { id: "cart1002", goodsId: "g1006", quantity: 1, checked: true, specText: "300g/盒", updatedAt: iso(-1) }, { id: "cart1003", goodsId: "g1011", quantity: 1, checked: false, specText: "400g/盒", updatedAt: iso(-1) }] },
    { userId: "u1002", items: [{ id: "cart1004", goodsId: "g1003", quantity: 1, checked: true, specText: "2 枚装", updatedAt: iso(-1) }] }
  ],
  orders: [
    { id: "o1001", orderNo: "LX2026031109301001", userId: "u1001", communityId: "c1001", addressId: "addr1001", addressSnapshot: { name: "王小满", phone: "13800000001", communityName: "锦绣花园社区", detail: "锦绣花园 8 号楼", houseNumber: "802" }, items: [{ goodsId: "g1001", name: "云南高山菠菜", cover: img("goods-spinach.svg"), price: 6.8, originalPrice: 8.9, specText: "300g/份", unit: "份", quantity: 2, subtotal: 13.6 }], goodsAmount: 13.6, discountAmount: 0, deliveryFee: 4, payableAmount: 17.6, status: "pending_payment", couponId: "", userCouponId: "", deliverySlot: "今天 18:00-20:00", remark: "到门请电话联系", createdAt: iso(-1), updatedAt: iso(-1) },
    { id: "o1002", orderNo: "LX2026030208101002", userId: "u1001", communityId: "c1001", addressId: "addr1001", addressSnapshot: { name: "王小满", phone: "13800000001", communityName: "锦绣花园社区", detail: "锦绣花园 8 号楼", houseNumber: "802" }, items: [{ goodsId: "g1006", name: "谷饲肥牛卷", cover: img("goods-beef.svg"), price: 38.9, originalPrice: 45.9, specText: "300g/盒", unit: "盒", quantity: 2, subtotal: 77.8 }], goodsAmount: 77.8, discountAmount: 15, deliveryFee: 0, payableAmount: 62.8, status: "pending_delivery", couponId: "cp1002", userCouponId: "uc1002", deliverySlot: "今天 10:00-12:00", remark: "", createdAt: iso(-10), updatedAt: iso(-10), payInfo: { payAt: iso(-10), channel: "mock_wechat_pay", tradeNo: "trade-1002" } },
    { id: "o1003", orderNo: "LX2026030509101003", userId: "u1001", communityId: "c1001", addressId: "addr1002", addressSnapshot: { name: "王小满", phone: "13800000001", communityName: "锦绣花园社区", detail: "锦绣花园 12 号楼", houseNumber: "1201" }, items: [{ goodsId: "g1005", name: "鲜活白虾仁", cover: img("goods-shrimp.svg"), price: 26.9, originalPrice: 32.9, specText: "250g/盒", unit: "盒", quantity: 2, subtotal: 53.8 }], goodsAmount: 53.8, discountAmount: 0, deliveryFee: 0, payableAmount: 53.8, status: "delivering", couponId: "", userCouponId: "", deliverySlot: "今天 12:00-14:00", remark: "", createdAt: iso(-6), updatedAt: iso(-5) },
    { id: "o1004", orderNo: "LX2026022608101004", userId: "u1001", communityId: "c1001", addressId: "addr1001", addressSnapshot: { name: "王小满", phone: "13800000001", communityName: "锦绣花园社区", detail: "锦绣花园 8 号楼", houseNumber: "802" }, items: [{ goodsId: "g1007", name: "林间散养鲜鸡蛋", cover: img("goods-egg.svg"), price: 12.9, originalPrice: 15.9, specText: "10 枚装", unit: "盒", quantity: 2, subtotal: 25.8 }], goodsAmount: 25.8, discountAmount: 0, deliveryFee: 4, payableAmount: 29.8, status: "completed", couponId: "", userCouponId: "", deliverySlot: "今天 08:00-10:00", remark: "", createdAt: iso(-14), updatedAt: iso(-13) },
    { id: "o1005", orderNo: "LX2026022408101005", userId: "u1002", communityId: "c1002", addressId: "addr1003", addressSnapshot: { name: "李橙橙", phone: "13800000002", communityName: "春申里社区", detail: "春申里 2 期", houseNumber: "6-302" }, items: [{ goodsId: "g1003", name: "即食牛油果", cover: img("goods-avocado.svg"), price: 15.9, originalPrice: 18.9, specText: "2 枚装", unit: "个", quantity: 2, subtotal: 31.8 }], goodsAmount: 31.8, discountAmount: 0, deliveryFee: 5, payableAmount: 36.8, status: "cancelled", couponId: "", userCouponId: "", deliverySlot: "今天 16:00-18:00", remark: "", createdAt: iso(-16), updatedAt: iso(-16), cancelReason: "计划有变" },
    { id: "o1006", orderNo: "LX2026030408101006", userId: "u1002", communityId: "c1002", addressId: "addr1003", addressSnapshot: { name: "李橙橙", phone: "13800000002", communityName: "春申里社区", detail: "春申里 2 期", houseNumber: "6-302" }, items: [{ goodsId: "g1009", name: "五常香米", cover: img("goods-rice.svg"), price: 59.9, originalPrice: 69.9, specText: "5kg/袋", unit: "袋", quantity: 2, subtotal: 119.8 }], goodsAmount: 119.8, discountAmount: 20, deliveryFee: 0, payableAmount: 99.8, status: "refunding", couponId: "cp1004", userCouponId: "uc1005", deliverySlot: "明天 09:00-11:00", remark: "门口可放", createdAt: iso(-8), updatedAt: iso(-7) },
    { id: "o1007", orderNo: "LX2026030808101007", userId: "u1003", communityId: "c1003", addressId: "addr1004", addressSnapshot: { name: "赵团团", phone: "13800000003", communityName: "星河家园社区", detail: "星河家园东区", houseNumber: "3-602" }, items: [{ goodsId: "g1002", name: "沙瓤番茄", cover: img("goods-tomato.svg"), price: 7.9, originalPrice: 9.9, specText: "500g/袋", unit: "袋", quantity: 5, subtotal: 39.5 }], goodsAmount: 39.5, discountAmount: 0, deliveryFee: 0, payableAmount: 39.5, status: "pending_delivery", couponId: "", userCouponId: "", deliverySlot: "次日 07:30-09:00", remark: "", createdAt: iso(-4), updatedAt: iso(-3) },
    { id: "o1008", orderNo: "LX2026022008101008", userId: "u1001", communityId: "c1001", addressId: "addr1001", addressSnapshot: { name: "王小满", phone: "13800000001", communityName: "锦绣花园社区", detail: "锦绣花园 8 号楼", houseNumber: "802" }, items: [{ goodsId: "g1004", name: "赣南脐橙", cover: img("goods-orange.svg"), price: 29.9, originalPrice: 39.9, specText: "4 斤礼盒装", unit: "箱", quantity: 1, subtotal: 29.9 }], goodsAmount: 29.9, discountAmount: 0, deliveryFee: 4, payableAmount: 33.9, status: "completed", couponId: "", userCouponId: "", deliverySlot: "今天 17:00-19:00", remark: "", createdAt: iso(-20), updatedAt: iso(-20) }
  ],
  contents: [
    { id: "ct1001", type: "notice", title: "暴雨天气配送时效说明", cover: img("banner-delivery.svg"), summary: "受短时暴雨影响，部分社区配送时段略有延迟。", contentBlocks: [{ type: "paragraph", text: "今日部分社区受天气影响，预计配送时效将延后 15-30 分钟。" }, { type: "paragraph", text: "如需改约配送时间，可在订单详情页联系在线客服。" }], isPublished: true, publishAt: iso(-1), sort: 1, updatedAt: iso(-1) },
    { id: "ct1002", type: "activity", title: "鲜果周末专场，全场 88 折起", cover: img("banner-fruit.svg"), summary: "橙子、牛油果、香蕉等鲜果专区限时折扣。", contentBlocks: [{ type: "paragraph", text: "周末鲜果专场开启，热门单品限时折扣。" }, { type: "paragraph", text: "部分礼盒支持拼团价，适合家庭囤货。" }], isPublished: true, publishAt: iso(-2), sort: 2, updatedAt: iso(-2) },
    { id: "ct1003", type: "activity", title: "新人首单券包领取攻略", cover: img("banner-newcomer.svg"), summary: "新人可领取 10 元 / 20 元 / 50 元组合券包。", contentBlocks: [{ type: "paragraph", text: "登录后进入新人礼包页，即可一键领取券包。" }, { type: "paragraph", text: "券包含满减券和专区券，适合首单下单使用。" }], isPublished: true, publishAt: iso(-3), sort: 3, updatedAt: iso(-3) },
    { id: "ct1004", type: "guide", title: "配送与售后服务说明", cover: img("banner-fresh.svg"), summary: "配送范围、时段、售后时效统一说明。", contentBlocks: [{ type: "paragraph", text: "营业时间内下单，系统将按社区配送时段安排履约。" }, { type: "paragraph", text: "商品如有损坏、缺件或品质问题，可在订单详情发起售后。" }], isPublished: true, publishAt: iso(-4), sort: 4, updatedAt: iso(-4) }
  ],
  serviceTickets: [
    { id: "st1001", orderId: "o1006", orderNo: "LX2026030408101006", userId: "u1002", type: "refund", reason: "米袋外包装破损", status: "processing", images: [img("goods-rice.svg")], remark: "希望退部分款", reply: "已提交仓配核实，将在 24 小时内处理。", createdAt: iso(-6), updatedAt: iso(-5) },
    { id: "st1002", orderId: "o1004", orderNo: "LX2026022608101004", userId: "u1001", type: "quality", reason: "鸡蛋有 1 枚破损", status: "resolved", images: [img("goods-egg.svg")], remark: "已拍照", reply: "已补发 1 枚鸡蛋优惠券。", createdAt: iso(-12), updatedAt: iso(-11) },
    { id: "st1003", orderId: "o1003", orderNo: "LX2026030509101003", userId: "u1001", type: "delivery", reason: "配送超时", status: "submitted", images: [], remark: "比预计晚了 40 分钟", reply: "", createdAt: iso(-4), updatedAt: iso(-4) }
  ],
  systemConfig: {
    brandName: "邻鲜到家",
    theme: { primaryColor: "#22B45A", primaryDark: "#18964A", primaryLight: "#EAF8EF", pageBg: "#F6F7F9" },
    homeNotice: "新鲜直采，每日清晨到仓，最快 30 分钟送货到家",
    customerServiceText: "客服在线时间 08:00-22:00，售后 24 小时内响应",
    minOrderAmount: 39,
    defaultDeliveryFee: 4,
    deliverySlots: [
      { id: "slot1001", label: "今天 10:00-12:00", enabled: true },
      { id: "slot1002", label: "今天 12:00-14:00", enabled: true },
      { id: "slot1003", label: "今天 18:00-20:00", enabled: true },
      { id: "slot1004", label: "明天 07:30-09:00", enabled: true }
    ],
    quickEntries: [
      { key: "vegetable", title: "蔬菜水果", icon: "🥬", target: "cat1001" },
      { key: "meat", title: "肉禽蛋奶", icon: "🥩", target: "cat1002" },
      { key: "grocery", title: "粮油百货", icon: "🛒", target: "cat1003" },
      { key: "flash", title: "限时秒杀", icon: "⏰", target: "flash_sale" },
      { key: "coupon", title: "优惠专区", icon: "🎟️", target: "coupon_center" }
    ],
    newcomerCoupons: ["cp1001", "cp1002", "cp1004"],
    updatedAt: iso(-1)
  }
};

async function writeJson(name, data) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, `${name}.json`), JSON.stringify(data, null, 2), "utf-8");
}

async function writeSvgs() {
  const mockDir = path.join(staticDir, "mock");
  await fs.mkdir(mockDir, { recursive: true });
  await Promise.all(
    Object.entries(assetDefs).map(([name, def]) => fs.writeFile(path.join(mockDir, name), createSvg(def), "utf-8"))
  );
}

async function main() {
  await Promise.all(Object.entries(seed).map(([name, data]) => writeJson(name, data)));
  await writeSvgs();
  console.log("[seed] generated files:", Object.keys(seed).join(", "));
}

main().catch((error) => {
  console.error("[seed:error]", error);
  process.exit(1);
});
