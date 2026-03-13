<script setup>
import { Icon } from '@iconify/vue';
// useRoute 在這裡可以用來判斷路由，但在 CSS 中我們已經用了 router-link-active 自動處理樣式
// 所以這裡暫時不需要額外邏輯
</script>

<template>
  <div class="app-layout">
    
    <header class="app-header">
      <div class="logo">
        <Icon icon="ic:baseline-shield" width="28" height="28" color="#343a40" />
        <h1>Tools Intranet Portal <span class="badge">CI/CD</span></h1>
      </div>
      
      <div style="margin-left: auto; display: flex; align-items: center; gap: 10px;">
         <span style="font-size: 14px; color: #666;">Admin</span>
         <Icon icon="carbon:user-avatar-filled" width="24" height="24" color="#666" />
      </div>
    </header>

    <main class="main-container">
      
      <aside class="sidebar">
        <ul class="sidebar-nav">
          <li>
            <router-link to="#">
              <Icon icon="material-symbols:group" width="20" />
              <span>公司公告 / 最新消息</span>
            </router-link>
          </li>
          <li>
            <router-link to="#">
              <Icon icon="material-symbols:computer" width="20" />
              <span>內部系統入口</span>
            </router-link>
          </li>
          <li>
            <router-link to="#">
              <Icon icon="material-symbols:assignment-ind" width="20" />
              <span>IT服務入口</span>
            </router-link>
          </li>
          <li>
            <router-link to="#">
              <Icon icon="material-symbols:apps" width="20" />
              <span>公司文件中心</span>
            </router-link>
          </li>
          <li>
            <router-link to="/hrm">
              <Icon icon="material-symbols:apps" width="20" />
              <span>員工資訊</span>
            </router-link>
          </li>
          <li>
            <router-link to="#">
              <Icon icon="material-symbols:apps" width="20" />
              <span>活動照片</span>
            </router-link>
          </li>
          <li>
            <router-link to="#">
              <Icon icon="material-symbols:apps" width="20" />
              <span>文件搜尋 / 知識庫</span>
            </router-link>
          </li>
        </ul>
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



/* 按鈕 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
  background-color: #fff;
  border-color: #ced4da;
  color: #333;
}
.btn:hover { background-color: #f8f9fa; }

.btn-success {
  background-color: #198754;
  color: #fff;
  border-color: #198754;
}
.btn-success:hover { background-color: #157347; }

/* 表格 */
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.data-table th, .data-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #dee2e6;
  text-align: left;
}
.data-table thead {
  background-color: #343a40;
  color: #fff;
}

</style>