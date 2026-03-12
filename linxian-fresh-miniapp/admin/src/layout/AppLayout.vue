<template>
  <div class="layout">
    <aside class="layout__aside">
      <div class="layout__brand">邻鲜到家后台</div>
      <router-link
        v-for="route in menus"
        :key="route.path"
        class="layout__menu"
        :class="{ 'is-active': route.path === $route.path }"
        :to="route.path"
      >
        {{ route.meta.title }}
      </router-link>
    </aside>
    <div class="layout__main">
      <header class="layout__header">
        <div>
          <div class="layout__title">{{ $route.meta.title }}</div>
          <div class="layout__subtitle">运营配置与交易履约统一管理</div>
        </div>
        <div class="layout__user">
          <span>{{ user?.name || "管理员" }}</span>
          <el-button type="success" plain @click="logout">退出</el-button>
        </div>
      </header>
      <main class="layout__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { menuRoutes } from "../router";
import { clearToken, getAdminUser } from "../utils/auth";

const router = useRouter();
const user = computed(() => getAdminUser());
const menus = menuRoutes.filter((item) => item.meta?.menu);

function logout() {
  clearToken();
  router.replace("/login");
}
</script>
