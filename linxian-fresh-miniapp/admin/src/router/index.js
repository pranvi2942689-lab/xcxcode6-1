import { createRouter, createWebHashHistory } from "vue-router";
import { getToken } from "../utils/auth";
import AppLayout from "../layout/AppLayout.vue";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import GoodsView from "../views/GoodsView.vue";
import CategoriesView from "../views/CategoriesView.vue";
import HomeOpsView from "../views/HomeOpsView.vue";
import CouponsView from "../views/CouponsView.vue";
import OrdersView from "../views/OrdersView.vue";
import UsersView from "../views/UsersView.vue";
import CommunitiesView from "../views/CommunitiesView.vue";
import ContentsView from "../views/ContentsView.vue";
import ServiceTicketsView from "../views/ServiceTicketsView.vue";
import SystemConfigView from "../views/SystemConfigView.vue";

export const menuRoutes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", component: DashboardView, meta: { title: "数据概览", menu: true } },
  { path: "/goods", component: GoodsView, meta: { title: "商品管理", menu: true } },
  { path: "/categories", component: CategoriesView, meta: { title: "分类管理", menu: true } },
  { path: "/home-ops", component: HomeOpsView, meta: { title: "首页运营", menu: true } },
  { path: "/coupons", component: CouponsView, meta: { title: "优惠券管理", menu: true } },
  { path: "/orders", component: OrdersView, meta: { title: "订单管理", menu: true } },
  { path: "/users", component: UsersView, meta: { title: "用户管理", menu: true } },
  { path: "/communities", component: CommunitiesView, meta: { title: "社区管理", menu: true } },
  { path: "/contents", component: ContentsView, meta: { title: "公告活动", menu: true } },
  { path: "/service-tickets", component: ServiceTicketsView, meta: { title: "售后反馈", menu: true } },
  { path: "/system-config", component: SystemConfigView, meta: { title: "系统配置", menu: true } }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/login", component: LoginView, meta: { public: true } },
    {
      path: "/",
      component: AppLayout,
      children: menuRoutes
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.public) {
    next();
    return;
  }
  if (!getToken()) {
    next("/login");
    return;
  }
  next();
});

export default router;
