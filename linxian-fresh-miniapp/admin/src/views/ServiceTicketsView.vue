<template>
  <div class="panel">
    <div class="page-header">
      <strong>售后反馈管理</strong>
    </div>
    <el-table :data="list">
      <el-table-column prop="orderNo" label="订单号" min-width="220" />
      <el-table-column prop="type" label="类型" width="100" />
      <el-table-column prop="reason" label="原因" min-width="220" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="success" @click="openDialog(row)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="visible" title="处理售后" width="620px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="订单">{{ current?.orderNo }}</el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="submitted" value="submitted" />
          <el-option label="processing" value="processing" />
          <el-option label="resolved" value="resolved" />
          <el-option label="closed" value="closed" />
        </el-select>
      </el-form-item>
      <el-form-item label="回复"><el-input v-model="form.reply" type="textarea" :rows="4" /></el-form-item>
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
const current = ref(null);
const form = reactive({ id: "", status: "", reply: "" });

async function loadData() {
  const data = await adminApi.getServiceTickets({ pageSize: 50 });
  list.value = data.list || [];
}

function openDialog(row) {
  current.value = row;
  Object.assign(form, { id: row.id, status: row.status, reply: row.reply || "" });
  visible.value = true;
}

async function saveRow() {
  await adminApi.updateServiceTicket(form);
  ElMessage.success("处理完成");
  visible.value = false;
  loadData();
}

onMounted(loadData);
</script>
