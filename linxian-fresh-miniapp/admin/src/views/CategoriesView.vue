<template>
  <div class="panel">
    <div class="page-header">
      <strong>分类管理</strong>
      <el-button type="success" @click="openDialog()">新增分类</el-button>
    </div>
    <el-table :data="list">
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="icon" label="图标" width="80" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="sort" label="排序" width="100" />
      <el-table-column label="启用" width="80">
        <template #default="{ row }">{{ row.isActive ? "是" : "否" }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button link type="success" @click="openDialog(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="visible" title="分类信息" width="560px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="图标"><el-input v-model="form.icon" /></el-form-item>
      <el-form-item label="说明"><el-input v-model="form.desc" /></el-form-item>
      <el-form-item label="排序"><el-input-number v-model="form.sort" :min="1" /></el-form-item>
      <el-form-item label="启用"><el-switch v-model="form.isActive" /></el-form-item>
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
  icon: "",
  desc: "",
  sort: 1,
  isActive: true
});

function openDialog(row) {
  Object.assign(form, row || { id: "", name: "", icon: "", desc: "", sort: 1, isActive: true });
  visible.value = true;
}

async function loadData() {
  const data = await adminApi.getCategories({ pageSize: 50 });
  list.value = data.list || [];
}

async function saveRow() {
  await adminApi.saveCategory(form);
  ElMessage.success("保存成功");
  visible.value = false;
  loadData();
}

onMounted(loadData);
</script>
