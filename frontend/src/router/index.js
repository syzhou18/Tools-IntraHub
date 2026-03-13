import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/announcements',
  },
  {
    path: '/announcements',
    name: 'Announcements',
    component: () => import('../views/Announcements.vue'),
  },
  {
    path: '/internal-systems',
    name: 'InternalSystems',
    component: () => import('../views/InternalSystems.vue'),
  },
  {
    path: '/it-services',
    name: 'ITServices',
    component: () => import('../views/ITServices.vue'),
  },
  {
    path: '/document-center',
    name: 'DocumentCenter',
    component: () => import('../views/DocumentCenter.vue'),
  },
  {
    path: '/hrm',
    name: 'HRM',
    component: () => import('../views/HRM.vue'),
  },
  {
    path: '/activity-photos',
    name: 'ActivityPhotos',
    component: () => import('../views/ActivityPhotos.vue'),
  },
  {
    path: '/knowledge-base',
    name: 'KnowledgeBase',
    component: () => import('../views/KnowledgeBase.vue'),
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

export default router;
