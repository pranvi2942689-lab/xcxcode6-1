<template>
  <div class="panel">
    <div class="page-header">
      <strong>社区管理</strong>
      <el-button type="success" @click="openDialog()">新增社区</el-button>
    </div>
    <el-table :data="list">
      <el-table-column prop="name" label="社区名称" />
      <el-table-column prop="district" label="区域" />
      <el-table-column prop="minOrderAmount" label="起送价" width="100" />
      <el-table-column prop="deliveryFee" label="运费" width="100" />
      <el-table-column prop="serviceHours" label="营业时间" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="success" @click="openDialog(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="visible" title="社区信息" width="620px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="社区名称"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="城市"><el-input v-model="form.city" /></el-form-item>
      <el-form-item label="区域"><el-input v-model="form.district" /></el-form-item>
      <el-form-item label="配送说明"><el-input v-model="form.deliveryDesc" /></el-form-item>
      <el-form-item label="起送 / 运费">
        <el-input-number v-model="form.minOrderAmount" :min="0" />
        <span style="margin: 0 12px">/</span>
        <el-input-number v-model="form.deliveryFee" :min="0" />
      </el-form-item>
      <el-form-item label="营业时间"><el-input v-model="form.serviceHours" /></el-form-item>
      <el-form-item label="营业状态"><el-switch v-model="form.isOpen" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="success" @click="saveRow">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { adminApi } from "../api/admin";

const list = ref([]);
const visible = ref(false);
const form = reactive({
  id: "",
  name: "",
  city: "上海市",
  district: "",
  deliveryDesc: "",
  minOrderAmount: 39,
  deliveryFee: 4,
  serviceHours: "07:30-22:00",
  isOpen: true
});

function openDialog(row) {
  Object.assign(form, row || {
    id: "",
    name: "",
    city: "上海市",
    district: "",
    deliveryDesc: "",
    minOrderAmount: 39,
    deliveryFee: 4,
    serviceHours: "07:30-22:00",
    isOpen: true
  });
  visible.value = true;
}

async function loadData() {
  const data = await adminApi.getCommunities({ pageSize: 50 });
  list.value = data.list || [];
}

async function saveRow() {
  await adminApi.saveCommunity(form);
  ElMessage.success("保存成功");
  visible.value = false;
  loadData();
}

onMounted(loadData);
</script>
