//引入组件
import Vue from 'vue'
import Index from '../components/Index.vue'
import Login from '../components/Login.vue'
import PageNotFound from "../components/PageNotFound"

import New from "../components/New.vue"

import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:"root",
    redirect:"/login"
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'index',
    component : Index,
    children:[
      {
        path:"new",
        component:New
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: PageNotFound
  }
]

const router = new VueRouter({
  routes
})

export default router
