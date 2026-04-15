import { createRouter, createWebHistory } from 'vue-router'

const routes = [
      {
        path: '/dashboard',
        name: 'main',
        component: () => import('@/layouts/MainLayout.vue'), // 👈 مهم
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