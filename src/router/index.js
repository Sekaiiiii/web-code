import Vue from 'vue'
import Index from '../components/Index.vue'
import Login from '../components/Login.vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'index',
    component : Index
  }
]

const router = new VueRouter({
  routes
})

export default router
