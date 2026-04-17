<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { clearAuth, getUser } from './utils/auth';

const route = useRoute();
const router = useRouter();
const currentUser = ref(getUser());

watch(
  () => route.fullPath,
  () => {
    currentUser.value = getUser();
  }
);

const isLoginPage = computed(() => route.path === '/login');

const displayName = computed(() => {
  return currentUser.value?.displayName || currentUser.value?.username || '訪客';
});

const logout = () => {
  clearAuth();
  currentUser.value = null;
  router.push('/login');
};
</script>

<template>
  <router-view v-if="isLoginPage" />

  <div v-else class="app-layout">
    <header class="app-header">
      <div class="logo">
        <Icon icon="ic:baseline-shield" width="28" height="28" color="#343a40" />
        <h1>Tools Intranet Portal <span class="badge">CI/CD</span></h1>
      </div>

      <div class="header-user">
        <span class="header-user-name">{{ displayName }}</span>
        <button class="logout-btn" type="button" @click="logout">登出</button>
      </div>
    </header>

    <main class="main-container">
      <aside class="sidebar">
        <ul class="sidebar-nav">
          <li>
            <router-link to="/announcements">
              <Icon icon="material-symbols:campaign-outline" width="20" />
              <span>公司公告</span>
            </router-link>
          </li>
          <li>
            <router-link to="/internal-systems">
              <Icon icon="material-symbols:grid-view-outline" width="20" />
              <span>內部系統入口</span>
            </router-link>
          </li>
          <li>
            <router-link to="/it-services">
              <Icon icon="material-symbols:build-outline" width="20" />
              <span>IT服務入口</span>
            </router-link>
          </li>
          <li>
            <router-link to="/document-center">
              <Icon icon="material-symbols:folder-open-outline" width="20" />
              <span>公司文件中心</span>
            </router-link>
          </li>
          <li>
            <router-link to="/hrm">
              <Icon icon="material-symbols:badge-outline" width="20" />
              <span>員工資訊</span>
            </router-link>
          </li>
          <li>
            <router-link to="/activity-photos">
              <Icon icon="material-symbols:image-outline" width="20" />
              <span>活動照片</span>
            </router-link>
          </li>
          <li>
            <router-link to="/knowledge-base">
              <Icon icon="material-symbols:menu-book-outline" width="20" />
              <span>文件搜尋 / 知識庫</span>
            </router-link>
          </li>
        </ul>

        <div class="sidebar-user-footer">
          <Icon icon="carbon:user-avatar-filled" width="20" color="#ced4da" />
          <span>{{ displayName }}</span>
        </div>
      </aside>

      <div class="main-content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<style>
.badge {
  font-size: 12px;
  background-color: #ffeeba;
  color: #856404;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: normal;
}

.header-user {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-user-name {
  font-size: 14px;
  color: #666;
}

.logout-btn {
  border: 1px solid #ced4da;
  background: #fff;
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
}

.sidebar-user-footer {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  color: #e9ecef;
  font-size: 14px;
}
</style>
