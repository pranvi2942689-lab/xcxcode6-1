<template>
  <div class="panel">
    <div class="page-header">
      <strong>用户管理</strong>
    </div>
    <el-table :data="list">
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="orderCount" label="订单数" width="100" />
      <el-table-column prop="couponCount" label="卡券数" width="100" />
      <el-table-column prop="favoriteCount" label="收藏数" width="100" />
      <el-table-column prop="communityId" label="社区" />
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { adminApi } from "../api/admin";

const list = ref([]);

onMounted(async () => {
  const data = await adminApi.getUsers({ pageSize: 50 });
  list.value = data.list || [];
});
</script>
