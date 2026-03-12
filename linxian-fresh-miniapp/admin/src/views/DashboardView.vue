<template>
  <div class="grid-5">
    <div v-for="item in statCards" :key="item.label" class="stat-card">
      <div class="stat-card__label">{{ item.label }}</div>
      <div class="stat-card__value">{{ item.value }}</div>
    </div>
  </div>

  <div class="grid-2" style="margin-top: 16px">
    <div class="panel">
      <div class="page-header">
        <strong>近 7 日订单趋势</strong>
      </div>
      <div class="trend">
        <div v-for="item in dashboard.trend" :key="item.date" class="trend__item">
          <div class="trend__bar" :style="{ height: `${Math.max(item.orderCount * 22, 20)}px` }"></div>
          <div class="trend__label">{{ item.date.slice(5) }}</div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="page-header">
        <strong>订单状态分布</strong>
      </div>
      <el-table :data="dashboard.orderStatus" size="small">
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="count" label="数量" />
      </el-table>
    </div>
  </div>

  <div class="panel" style="margin-top: 16px">
    <div class="page-header">
      <strong>热销商品榜单</strong>
    </div>
    <el-table :data="dashboard.hotGoods">
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="soldCount" label="销量" />
      <el-table-column prop="stock" label="库存" />
    </el-table>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";
import { adminApi } from "../api/admin";

const dashboard = reactive({
  summary: {},
  trend: [],
  hotGoods: [],
  orderStatus: []
});

const statCards = computed(() => [
  { label: "商品数", value: dashboard.summary.goodsCount || 0 },
  { label: "订单数", value: dashboard.summary.orderCount || 0 },
  { label: "今日销售额", value: `¥${dashboard.summary.todaySales || 0}` },
  { label: "用户数", value: dashboard.summary.userCount || 0 },
  { label: "待处理售后", value: dashboard.summary.pendingTickets || 0 }
]);

onMounted(async () => {
  Object.assign(dashboard, await adminApi.getDashboard());
});
</script>
