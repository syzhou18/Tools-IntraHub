<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import api from '../api/axios';
import { saveUser } from '../utils/auth';

const router = useRouter();
const username = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';

  if (!username.value || !password.value) {
    errorMessage.value = '請輸入帳號與密碼';
    return;
  }

  loading.value = true;

  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value,
    });

    if (response.data?.success) {
      saveUser(response.data.user);
      router.push('/announcements');
      return;
    }

    errorMessage.value = response.data?.message || '登入失敗';
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '登入失敗，請稍後再試';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-title">
        <Icon icon="ic:baseline-shield" width="26" />
        <h2>Intranet 登入</h2>
      </div>

      <p class="login-subtitle">使用 FreeIPA 帳號登入系統</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">帳號</label>
          <input id="username" v-model="username" type="text" autocomplete="username" placeholder="請輸入 FreeIPA 帳號" />
        </div>

        <div class="form-group">
          <label for="password">密碼</label>
          <input id="password" v-model="password" type="password" autocomplete="current-password" placeholder="請輸入密碼" />
        </div>

        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <button class="btn btn-success login-button" :disabled="loading" type="submit">
          {{ loading ? '登入中...' : '登入' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #eef2f7 0%, #dce4ec 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 28px;
  text-align: left;
}

.login-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #343a40;
}

.login-title h2 {
  margin: 0;
  font-size: 22px;
}

.login-subtitle {
  margin: 10px 0 22px;
  color: #6c757d;
  font-size: 14px;
}

.error-text {
  margin: 0 0 12px;
  color: #c82333;
  font-size: 14px;
}

.login-button {
  width: 100%;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
