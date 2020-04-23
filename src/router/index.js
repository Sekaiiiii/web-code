//引入组件
import Vue from 'vue'
import Index from '../components/Index.vue'
import Login from '../components/Login.vue'
import PageNotFound from "../components/PageNotFound"
import Test1 from "../components/Test1.vue"
import Test2 from "../components/Test2.vue"
import Test3 from "../components/Test3.vue"


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
        path:"1",
        component:Test1
      },
      {
        path:"2",
        component:Test2
      },
      {
        path:"3",
        component:Test3
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
