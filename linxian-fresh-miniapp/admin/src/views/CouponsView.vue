<template>
  <div class="panel">
    <div class="page-header">
      <strong>优惠券管理</strong>
      <el-button type="success" @click="openDialog()">新增优惠券</el-button>
    </div>
    <el-table :data="list">
      <el-table-column prop="title" label="标题" min-width="220" />
      <el-table-column prop="thresholdAmount" label="门槛" width="100" />
      <el-table-column prop="discountAmount" label="面额" width="100" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column prop="endAt" label="结束日期" width="120" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="success" @click="openDialog(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="visible" title="优惠券信息" width="620px">
    <el-form :model="form" label-width="110px">
      <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
      <el-form-item label="使用门槛"><el-input-number v-model="form.thresholdAmount" :min="0" /></el-form-item>
      <el-form-item label="优惠金额"><el-input-number v-model="form.discountAmount" :min="0" /></el-form-item>
      <el-form-item label="开始日期"><el-input v-model="form.startAt" /></el-form-item>
      <el-form-item label="结束日期"><el-input v-model="form.endAt" /></el-form-item>
      <el-form-item label="范围"><el-input v-model="form.scopeType" /></el-form-item>
      <el-form-item label="状态"><el-input v-model="form.status" /></el-form-item>
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
  title: "",
  thresholdAmount: 39,
  discountAmount: 10,
  startAt: "",
  endAt: "",
  scopeType: "all",
  status: "active"
});

function openDialog(row) {
  Object.assign(form, row || {
    id: "",
    title: "",
    thresholdAmount: 39,
    discountAmount: 10,
    startAt: "",
    endAt: "",
    scopeType: "all",
    status: "active"
  });
  visible.value = true;
}

async function loadData() {
  const data = await adminApi.getCoupons({ pageSize: 50 });
  list.value = data.list || [];
}

async function saveRow() {
  await adminApi.saveCoupon(form);
  ElMessage.success("保存成功");
  visible.value = false;
  loadData();
}

onMounted(loadData);
</script>
