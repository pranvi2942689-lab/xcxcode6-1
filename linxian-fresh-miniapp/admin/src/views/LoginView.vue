<template>
  <div class="login-page">
    <div class="login-card">
      <h1>邻鲜到家管理后台</h1>
      <p style="color: #8a94a6; margin-bottom: 24px">默认账号：admin / 123456</p>
      <el-form :model="form" label-position="top">
        <el-form-item label="账号">
          <el-input v-model="form.account" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-button type="success" style="width: 100%" :loading="loading" @click="submit">
          登录后台
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { adminApi } from "../api/admin";
import { setAdminUser, setToken } from "../utils/auth";

const router = useRouter();
const loading = ref(false);
const form = reactive({
  account: "admin",
  password: "123456"
});

async function submit() {
  loading.value = true;
  try {
    const result = await adminApi.login(form);
    setToken(result.token);
    setAdminUser(result.admin);
    ElMessage.success("登录成功");
    router.replace("/dashboard");
  } finally {
    loading.value = false;
  }
}
</script>
