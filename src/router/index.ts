import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


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
        component: () => import('@/views/ChatView/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router