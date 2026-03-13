const SITE_CONFIG = require("../../config/site")

const COPY = {
  brandTitle: "\u4e91\u88f3\u666e\u62c9\u63d0",
  location: "\u4e0a\u6d77\u5f90\u6c47",
  heroTitle: "\u91cd\u5851\u4f18\u96c5\u81ea\u6211",
  promoLabel: "\u65b0\u5ba2\u4e13\u4eab",
  promoTitleLeft: "\u65b0\u5ba2\u4e13\u4eab",
  promoTitleRight: "\u9996\u6b21\u79c1\u6559\u5bf9\u6298",
  claimText: "\u7acb\u5373\u9886\u53d6 >",
  assetError:
    "\u56fe\u7247\u8d44\u6e90\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u81ea\u5efa\u540e\u7aef\u57df\u540d\u3001HTTPS \u8bc1\u4e66\u548c\u670d\u52a1\u72b6\u6001",
  domainMissing:
    "\u8bf7\u5148\u5728 config/site.js \u91cc\u914d\u7f6e\u5df2\u5907\u6848\u7684 HTTPS \u57df\u540d",
  featureFallback: "\u529f\u80fd",
  featurePending: "\u5f85\u63a5\u5165",
  pageFallback: "\u9875\u9762",
  pagePending: "\u9875\u9762\u5f85\u63a5\u5165",
  booking: "\u4f53\u9a8c\u8bfe\u9884\u5b9a",
  schedule: "\u56e2\u8bfe\u8bfe\u8868",
  member: "\u4f1a\u5458\u4e2d\u5fc3",
  home: "\u9996\u9875",
  course: "\u7ea6\u8bfe",
  order: "\u8ba2\u5355",
  profile: "\u6211\u7684"
}

function normalizeBaseUrl(url) {
  return (url || "").replace(/\/+$/, "")
}

function isConfigured(baseUrl) {
  return Boolean(baseUrl) && !/your-domain\.com/i.test(baseUrl)
}

function buildBackendImages(baseUrl) {
  const root = normalizeBaseUrl(baseUrl)
  return {
    heroBg: `${root}/uploads/home/hero-bg.jpg`,
    logo: `${root}/uploads/home/logo.jpg`,
    booking: `${root}/uploads/home/booking-icon.jpg`,
    schedule: `${root}/uploads/home/schedule-icon.jpg`,
    member: `${root}/uploads/home/member-icon.jpg`,
    promoBoard: `${root}/uploads/home/promo-board.jpg`,
    claimButton: `${root}/uploads/home/claim-button.jpg`
  }
}

const EMPTY_IMAGES = {
  heroBg: "",
  logo: "",
  booking: "",
  schedule: "",
  member: "",
  promoBoard: "",
  claimButton: ""
}

function buildQuickActions(images) {
  return [
    {
      key: "booking",
      title: COPY.booking,
      icon: images.booking,
      active: true
    },
    {
      key: "schedule",
      title: COPY.schedule,
      icon: images.schedule,
      active: false
    },
    {
      key: "member",
      title: COPY.member,
      icon: images.member,
      active: false
    }
  ]
}

const tabs = [
  {
    key: "home",
    label: COPY.home,
    icon: "../../assets/tab-home-active.png",
    active: true
  },
  {
    key: "course",
    label: COPY.course,
    icon: "../../assets/tab-course.png",
    active: false
  },
  {
    key: "order",
    label: COPY.order,
    icon: "../../assets/tab-order.png",
    active: false
  },
  {
    key: "profile",
    label: COPY.profile,
    icon: "../../assets/tab-profile.png",
    active: false
  }
]

function getLayoutMetrics() {
  const systemInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
  const statusBarHeight = systemInfo.statusBarHeight || 20
  const safeArea = systemInfo.safeArea || null
  const screenHeight = systemInfo.screenHeight || systemInfo.windowHeight || 812
  const windowWidth = systemInfo.windowWidth || 375
  const capsule = wx.getMenuButtonBoundingClientRect
    ? wx.getMenuButtonBoundingClientRect()
    : null

  const safeBottom = safeArea ? Math.max(screenHeight - safeArea.bottom, 12) : 12
  const capsuleTop = capsule && capsule.top ? capsule.top : statusBarHeight + 8
  const capsuleHeight = capsule && capsule.height ? capsule.height : 32
  const capsuleRight = capsule ? Math.max(windowWidth - capsule.right, 14) : 14

  return {
    brandTop: statusBarHeight + 16,
    brandCopyTop: statusBarHeight + 18,
    heroTop: statusBarHeight + 154,
    capsuleTop,
    capsuleHeight,
    capsuleRight,
    safeBottom
  }
}

const backendReady = isConfigured(SITE_CONFIG.baseUrl)
const backendImages = backendReady ? buildBackendImages(SITE_CONFIG.baseUrl) : EMPTY_IMAGES

Page({
  data: {
    copy: COPY,
    layout: getLayoutMetrics(),
    images: backendImages,
    quickActions: buildQuickActions(backendImages),
    tabs,
    loadState: backendReady ? "ready" : "error",
    loadErrorText: backendReady ? "" : COPY.domainMissing
  },

  onLoad() {
    this.setData({
      layout: getLayoutMetrics()
    })
  },

  handleImageError(event) {
    const imageKey = event.currentTarget.dataset.imageKey || "unknown"
    console.error("Backend image render failed.", {
      imageKey,
      url: this.data.images[imageKey] || ""
    })

    if (this.data.loadState !== "error") {
      this.setData({
        loadState: "error",
        loadErrorText: COPY.assetError
      })
    }
  },

  handlePlaceholderTap(event) {
    const label = event.currentTarget.dataset.label || COPY.featureFallback
    wx.showToast({
      title: `${label}${COPY.featurePending}`,
      icon: "none"
    })
  },

  handleTabTap(event) {
    const { active, label = COPY.pageFallback } = event.currentTarget.dataset
    if (active === true || active === "true") {
      return
    }

    wx.showToast({
      title: `${label}${COPY.pagePending}`,
      icon: "none"
    })
  }
})
