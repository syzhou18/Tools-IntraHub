import { createRouter, createWebHistory } from 'vue-router';

// --- 路由定義 ---
// 已移除所有 meta: { requiresAuth: true } 以及 /login 路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  // 捕捉所有未定義路由，導向首頁
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 已移除原本的 router.beforeEach 全域導航守衛與 Firebase 初始化邏輯

export default router;