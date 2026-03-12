<template>
  <div class="panel">
    <div class="page-header">
      <strong>系统配置</strong>
      <el-button type="success" @click="saveConfig">保存配置</el-button>
    </div>
    <el-form :model="form" label-width="120px">
      <el-form-item label="首页公告"><el-input v-model="form.homeNotice" /></el-form-item>
      <el-form-item label="客服文案"><el-input v-model="form.customerServiceText" /></el-form-item>
      <el-form-item label="起送门槛"><el-input-number v-model="form.minOrderAmount" :min="0" /></el-form-item>
      <el-form-item label="默认运费"><el-input-number v-model="form.defaultDeliveryFee" :min="0" /></el-form-item>
      <el-form-item label="配送时段">
        <el-input v-model="form.deliverySlotsText" type="textarea" :rows="6" placeholder='JSON 数组，例如 [{"id":"slot1","label":"今天 10:00-12:00","enabled":true}]' />
      </el-form-item>
      <el-form-item label="首页金刚区">
        <el-input v-model="form.quickEntriesText" type="textarea" :rows="6" placeholder='JSON 数组，例如 [{"key":"vegetable","title":"蔬菜水果","icon":"🥬","target":"cat1001"}]' />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { adminApi } from "../api/admin";

const form = reactive({
  homeNotice: "",
  customerServiceText: "",
  minOrderAmount: 39,
  defaultDeliveryFee: 4,
  deliverySlotsText: "[]",
  quickEntriesText: "[]"
});

onMounted(async () => {
  const data = await adminApi.getSystemConfig();
  Object.assign(form, {
    ...data,
    deliverySlotsText: JSON.stringify(data.deliverySlots || [], null, 2),
    quickEntriesText: JSON.stringify(data.quickEntries || [], null, 2)
  });
});

async function saveConfig() {
  await adminApi.saveSystemConfig({
    homeNotice: form.homeNotice,
    customerServiceText: form.customerServiceText,
    minOrderAmount: Number(form.minOrderAmount),
    defaultDeliveryFee: Number(form.defaultDeliveryFee),
    deliverySlots: JSON.parse(form.deliverySlotsText || "[]"),
    quickEntries: JSON.parse(form.quickEntriesText || "[]")
  });
  ElMessage.success("配置已保存");
}
</script>
