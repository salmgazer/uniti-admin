import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuth } from '@/services/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('@/views/UserDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('@/views/Messages.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/messages/:id',
    name: 'MessageDetail',
    component: () => import('@/views/MessageDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/message-templates',
    name: 'MessageTemplates',
    component: () => import('@/views/MessageTemplates.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/message-templates/create',
    name: 'CreateMessageTemplate',
    component: () => import('@/views/CreateMessageTemplate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/message-templates/:id/edit',
    name: 'EditMessageTemplate',
    component: () => import('@/views/EditMessageTemplate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/goal-categories',
    name: 'GoalCategories',
    component: () => import('@/views/GoalCategories.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/goal-categories/:id',
    name: 'GoalCategoryDetail',
    component: () => import('@/views/GoalCategoryDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/apps',
    name: 'Apps',
    component: () => import('@/views/Apps.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/apps/:id',
    name: 'AppDetail',
    component: () => import('@/views/AppDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/countries',
    name: 'Countries',
    component: () => import('@/views/Countries.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/languages',
    name: 'Languages',
    component: () => import('@/views/Languages.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminUsers',
    component: () => import('@/views/AdminUsers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/app-settings',
    name: 'AppSettings',
    component: () => import('@/views/AppSettings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/app-settings/:screenName',
    name: 'AppScreenDetail',
    component: () => import('@/views/AppScreenDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  console.log({from});
  const { isAuthenticated, checkAuth } = useAuth();
  
  if (to.meta.requiresAuth) {
    if (isAuthenticated.value) {
      next();
    } else {
      const isAuthed = await checkAuth();
      if (isAuthed) {
        next();
      } else {
        next('/login');
      }
    }
  } else {
    next();
  }
});

export default router;