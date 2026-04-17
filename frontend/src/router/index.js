import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from '../utils/auth';

const routes = [
  {
    path: '/',
    redirect: '/announcements',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/announcements',
    name: 'Announcements',
    component: () => import('../views/Announcements.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/internal-systems',
    name: 'InternalSystems',
    component: () => import('../views/InternalSystems.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/it-services',
    name: 'ITServices',
    component: () => import('../views/ITServices.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/document-center',
    name: 'DocumentCenter',
    component: () => import('../views/DocumentCenter.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/hrm',
    name: 'HRM',
    component: () => import('../views/HRM.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/activity-photos',
    name: 'ActivityPhotos',
    component: () => import('../views/ActivityPhotos.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/knowledge-base',
    name: 'KnowledgeBase',
    component: () => import('../views/KnowledgeBase.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/announcements',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const loggedIn = isAuthenticated();

  if (to.meta.requiresAuth && !loggedIn) {
    return '/login';
  }

  if (to.path === '/login' && loggedIn) {
    return '/announcements';
  }

  return true;
});

export default router;
