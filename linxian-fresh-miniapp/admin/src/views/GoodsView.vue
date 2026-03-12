<template>
  <div class="panel">
    <div class="page-header">
      <strong>商品管理</strong>
      <el-button type="success" @click="openDialog()">新增商品</el-button>
    </div>
    <div class="toolbar">
      <el-input v-model="query.keyword" placeholder="搜索商品" clearable />
      <el-select v-model="query.status" placeholder="上下架状态" clearable style="width: 180px">
        <el-option label="上架" value="online" />
        <el-option label="下架" value="offline" />
      </el-select>
      <el-button type="success" plain @click="loadData">筛选</el-button>
    </div>
    <el-table :data="list">
      <el-table-column prop="name" label="商品名称" min-width="220" />
      <el-table-column prop="specText" label="规格" width="120" />
      <el-table-column prop="price" label="售价" width="100" />
      <el-table-column prop="stock" label="库存" width="100" />
      <el-table-column prop="soldCount" label="销量" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">{{ row.isOffline ? "下架" : "上架" }}</template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template #default="{ row }">
          <el-button link type="success" @click="openDialog(row)">编辑</el-button>
          <el-button link type="warning" @click="toggleRow(row)">{{ row.isOffline ? "上架" : "下架" }}</el-button>
          <el-button link type="danger" @click="removeRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="visible" :title="form.id ? '编辑商品' : '新增商品'" width="760px">
    <el-form :model="form" label-width="110px">
      <el-form-item label="商品名称"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="副标题"><el-input v-model="form.subtitle" /></el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.categoryId" style="width: 100%">
          <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="规格"><el-input v-model="form.specText" /></el-form-item>
      <el-form-item label="封面"><el-input v-model="form.cover" /></el-form-item>
      <el-form-item label="售价">
        <el-input-number v-model="form.price" :min="0" />
        <span style="margin: 0 12px">原价</span>
        <el-input-number v-model="form.originalPrice" :min="0" />
      </el-form-item>
      <el-form-item label="库存 / 销量">
        <el-input-number v-model="form.stock" :min="0" />
        <span style="margin: 0 12px">销量</span>
        <el-input-number v-model="form.soldCount" :min="0" />
      </el-form-item>
      <el-form-item label="标签"><el-input v-model="form.tagsText" placeholder="逗号分隔" /></el-form-item>
      <el-form-item label="商品说明"><el-input v-model="form.desc" type="textarea" :rows="4" /></el-form-item>
      <el-form-item label="运营标记">
        <el-checkbox v-model="form.isHot">热销</el-checkbox>
        <el-checkbox v-model="form.isNew">新品</el-checkbox>
        <el-checkbox v-model="form.isOffline">下架</el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="success" @click="saveRow">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { adminApi } from "../api/admin";

const list = ref([]);
const categories = ref([]);
const visible = ref(false);
const query = reactive({ keyword: "", status: "" });
const form = reactive({
  id: "",
  name: "",
  subtitle: "",
  categoryId: "",
  specText: "",
  cover: "",
  price: 0,
  originalPrice: 0,
  stock: 0,
  soldCount: 0,
  desc: "",
  tagsText: "",
  isHot: false,
  isNew: false,
  isOffline: false
});

function resetForm() {
  Object.assign(form, {
    id: "",
    name: "",
    subtitle: "",
    categoryId: categories.value[0]?.id || "",
    specText: "",
    cover: "",
    price: 0,
    originalPrice: 0,
    stock: 0,
    soldCount: 0,
    desc: "",
    tagsText: "",
    isHot: false,
    isNew: false,
    isOffline: false
  });
}

function openDialog(row) {
  if (row) {
    Object.assign(form, { ...row, tagsText: (row.tags || []).join(",") });
  } else {
    resetForm();
  }
  visible.value = true;
}

async function loadData() {
  const data = await adminApi.getGoods({ ...query, pageSize: 50 });
  list.value = data.list || [];
}

async function loadCategories() {
  const data = await adminApi.getCategories({ pageSize: 50 });
  categories.value = data.list || [];
}

async function saveRow() {
  await adminApi.saveGoods({
    ...form,
    tags: form.tagsText.split(",").map((item) => item.trim()).filter(Boolean)
  });
  ElMessage.success("保存成功");
  visible.value = false;
  loadData();
}

async function toggleRow(row) {
  await adminApi.toggleGoods(row.id);
  ElMessage.success("状态已更新");
  loadData();
}

async function removeRow(row) {
  await ElMessageBox.confirm(`确认删除商品“${row.name}”吗？`, "提示");
  await adminApi.deleteGoods(row.id);
  ElMessage.success("删除成功");
  loadData();
}

onMounted(async () => {
  await loadCategories();
  resetForm();
  await loadData();
});
</script>
