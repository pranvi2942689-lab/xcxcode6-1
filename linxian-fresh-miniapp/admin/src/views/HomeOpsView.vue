<template>
  <div class="grid-2">
    <div class="panel">
      <div class="page-header">
        <strong>Banner 配置</strong>
        <el-button type="success" @click="openBanner()">新增 Banner</el-button>
      </div>
      <el-table :data="banners">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="linkType" label="跳转类型" />
        <el-table-column prop="linkValue" label="跳转值" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button link type="success" @click="openBanner(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="panel">
      <div class="page-header">
        <strong>首页专区配置</strong>
        <el-button type="success" @click="openSection()">新增专区</el-button>
      </div>
      <el-table :data="sections">
        <el-table-column prop="title" label="专区标题" />
        <el-table-column prop="type" label="专区类型" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button link type="success" @click="openSection(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="bannerVisible" title="Banner 配置" width="620px">
    <el-form :model="bannerForm" label-width="100px">
      <el-form-item label="标题"><el-input v-model="bannerForm.title" /></el-form-item>
      <el-form-item label="图片"><el-input v-model="bannerForm.image" /></el-form-item>
      <el-form-item label="跳转类型"><el-input v-model="bannerForm.linkType" /></el-form-item>
      <el-form-item label="跳转值"><el-input v-model="bannerForm.linkValue" /></el-form-item>
      <el-form-item label="排序"><el-input-number v-model="bannerForm.sort" :min="1" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="bannerVisible = false">取消</el-button>
      <el-button type="success" @click="saveBanner">保存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="sectionVisible" title="首页专区配置" width="680px">
    <el-form :model="sectionForm" label-width="100px">
      <el-form-item label="标题"><el-input v-model="sectionForm.title" /></el-form-item>
      <el-form-item label="类型"><el-input v-model="sectionForm.type" /></el-form-item>
      <el-form-item label="副标题"><el-input v-model="sectionForm.subtitle" /></el-form-item>
      <el-form-item label="商品 ID"><el-input v-model="sectionForm.goodsText" placeholder="逗号分隔" /></el-form-item>
      <el-form-item label="内容 ID"><el-input v-model="sectionForm.contentText" placeholder="逗号分隔" /></el-form-item>
      <el-form-item label="排序"><el-input-number v-model="sectionForm.sort" :min="1" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="sectionVisible = false">取消</el-button>
      <el-button type="success" @click="saveSection">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { adminApi } from "../api/admin";

const banners = ref([]);
const sections = ref([]);
const bannerVisible = ref(false);
const sectionVisible = ref(false);
const bannerForm = reactive({ id: "", title: "", image: "", linkType: "", linkValue: "", sort: 1 });
const sectionForm = reactive({ id: "", title: "", type: "", subtitle: "", goodsText: "", contentText: "", sort: 1 });

async function loadData() {
  const [bannerData, sectionData] = await Promise.all([
    adminApi.getBanners({ pageSize: 50 }),
    adminApi.getSections({ pageSize: 50 })
  ]);
  banners.value = bannerData.list || [];
  sections.value = sectionData.list || [];
}

function openBanner(row) {
  Object.assign(bannerForm, row || { id: "", title: "", image: "", linkType: "", linkValue: "", sort: 1 });
  bannerVisible.value = true;
}

function openSection(row) {
  Object.assign(sectionForm, {
    id: row?.id || "",
    title: row?.title || "",
    type: row?.type || "",
    subtitle: row?.subtitle || "",
    goodsText: (row?.goodsIds || []).join(","),
    contentText: (row?.contentIds || []).join(","),
    sort: row?.sort || 1
  });
  sectionVisible.value = true;
}

async function saveBanner() {
  await adminApi.saveBanner(bannerForm);
  ElMessage.success("Banner 已保存");
  bannerVisible.value = false;
  loadData();
}

async function saveSection() {
  await adminApi.saveSection({
    ...sectionForm,
    goodsIds: sectionForm.goodsText.split(",").map((item) => item.trim()).filter(Boolean),
    contentIds: sectionForm.contentText.split(",").map((item) => item.trim()).filter(Boolean)
  });
  ElMessage.success("专区已保存");
  sectionVisible.value = false;
  loadData();
}

onMounted(loadData);
</script>
