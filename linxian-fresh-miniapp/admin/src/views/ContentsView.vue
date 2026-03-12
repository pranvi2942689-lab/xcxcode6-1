<template>
  <div class="panel">
    <div class="page-header">
      <strong>公告活动管理</strong>
      <el-button type="success" @click="openDialog()">新增内容</el-button>
    </div>
    <el-table :data="list">
      <el-table-column prop="title" label="标题" min-width="240" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="publishAt" label="发布时间" width="140" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="success" @click="openDialog(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="visible" title="内容信息" width="760px">
    <el-form :model="form" label-width="110px">
      <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
      <el-form-item label="类型"><el-input v-model="form.type" /></el-form-item>
      <el-form-item label="封面"><el-input v-model="form.cover" /></el-form-item>
      <el-form-item label="摘要"><el-input v-model="form.summary" type="textarea" /></el-form-item>
      <el-form-item label="正文段落"><el-input v-model="form.contentText" type="textarea" :rows="6" placeholder="每行一个段落" /></el-form-item>
      <el-form-item label="发布时间"><el-input v-model="form.publishAt" /></el-form-item>
      <el-form-item label="排序"><el-input-number v-model="form.sort" :min="1" /></el-form-item>
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
  type: "notice",
  cover: "",
  summary: "",
  contentText: "",
  publishAt: "",
  sort: 1
});

function openDialog(row) {
  Object.assign(form, {
    id: row?.id || "",
    title: row?.title || "",
    type: row?.type || "notice",
    cover: row?.cover || "",
    summary: row?.summary || "",
    contentText: (row?.contentBlocks || []).map((item) => item.text).join("\n"),
    publishAt: row?.publishAt || "",
    sort: row?.sort || 1
  });
  visible.value = true;
}

async function loadData() {
  const data = await adminApi.getContents({ pageSize: 50 });
  list.value = data.list || [];
}

async function saveRow() {
  await adminApi.saveContent({
    ...form,
    contentBlocks: form.contentText.split("\n").map((text) => text.trim()).filter(Boolean).map((text) => ({ type: "paragraph", text }))
  });
  ElMessage.success("保存成功");
  visible.value = false;
  loadData();
}

onMounted(loadData);
</script>
