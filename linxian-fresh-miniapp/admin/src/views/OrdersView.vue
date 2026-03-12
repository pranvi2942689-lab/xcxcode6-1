<template>
  <div class="panel">
    <div class="page-header">
      <strong>订单管理</strong>
    </div>
    <div class="toolbar">
      <el-input v-model="query.orderNo" placeholder="搜索订单号" clearable />
      <el-select v-model="query.status" placeholder="订单状态" clearable style="width: 180px">
        <el-option label="待支付" value="pending_payment" />
        <el-option label="待配送" value="pending_delivery" />
        <el-option label="配送中" value="delivering" />
        <el-option label="已完成" value="completed" />
        <el-option label="已取消" value="cancelled" />
        <el-option label="售后中" value="refunding" />
      </el-select>
      <el-button type="success" plain @click="loadData">筛选</el-button>
    </div>
    <el-table :data="list">
      <el-table-column prop="orderNo" label="订单号" min-width="220" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="payableAmount" label="实付金额" width="100" />
      <el-table-column prop="deliverySlot" label="配送时间" width="150" />
      <el-table-column prop="createdAt" label="创建时间" min-width="180" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button link type="success" @click="showDetail(row)">详情</el-button>
          <el-button link type="warning" @click="openStatus(row)">改状态</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="detailVisible" title="订单详情" width="760px">
    <pre style="white-space: pre-wrap">{{ JSON.stringify(currentOrder, null, 2) }}</pre>
  </el-dialog>

  <el-dialog v-model="statusVisible" title="更新订单状态" width="520px">
    <el-form :model="statusForm" label-width="100px">
      <el-form-item label="订单编号">{{ currentOrder?.orderNo }}</el-form-item>
      <el-form-item label="目标状态">
        <el-select v-model="statusForm.status" style="width: 100%">
          <el-option label="待配送" value="pending_delivery" />
          <el-option label="配送中" value="delivering" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
          <el-option label="售后中" value="refunding" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注"><el-input v-model="statusForm.adminRemark" type="textarea" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="statusVisible = false">取消</el-button>
      <el-button type="success" @click="saveStatus">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { adminApi } from "../api/admin";

const list = ref([]);
const currentOrder = ref(null);
const detailVisible = ref(false);
const statusVisible = ref(false);
const query = reactive({ orderNo: "", status: "" });
const statusForm = reactive({ id: "", status: "", adminRemark: "" });

async function loadData() {
  const data = await adminApi.getOrders({ ...query, pageSize: 50 });
  list.value = data.list || [];
}

async function showDetail(row) {
  currentOrder.value = await adminApi.getOrderDetail(row.id);
  detailVisible.value = true;
}

function openStatus(row) {
  currentOrder.value = row;
  Object.assign(statusForm, { id: row.id, status: row.status, adminRemark: row.adminRemark || "" });
  statusVisible.value = true;
}

async function saveStatus() {
  await adminApi.updateOrderStatus(statusForm);
  ElMessage.success("状态已更新");
  statusVisible.value = false;
  loadData();
}

onMounted(loadData);
</script>
