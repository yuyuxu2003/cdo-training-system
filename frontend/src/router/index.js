import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/login', component: () => import('@/views/Login.vue') },
  { path: '/enroll', component: () => import('@/views/Enroll.vue') },
  { path: '/course', component: () => import('@/views/Course.vue') },
  { path: '/promote', component: () => import('@/views/Promote.vue') },
  { path: '/profile', component: () => import('@/views/Profile.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
