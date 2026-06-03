import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router' // 👈 Switched to createWebHashHistory

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/live-chat/index.vue')
      },
      {
        path: ':id',
        name: 'chat',
        component: () => import('@/views/ChatView/index.vue')
      }
    ]
  }
]

const router = createRouter({
  // 👈 Use hash history and pass the base path from Vite env
  history: createWebHashHistory(import.meta.env.BASE_URL), 
  routes,
})

export default router