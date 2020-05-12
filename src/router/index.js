//引入组件
import Vue from 'vue'
import Index from '../components/Index.vue'
import Login from '../components/Login.vue'
import PageNotFound from "../components/PageNotFound.vue"
import User from "../components/User.vue"
import Admin from "../components/Admin.vue"
import Audit from "../components/Audit.vue"
import Museum from "../components/Museum.vue"
import Exhibition from "../components/Exhibition.vue"
import EducationActivity from "../components/EducationActivity.vue"
import Collection from "../components/Collection.vue"
import New from "../components/New.vue"
import Explain from "../components/Explain.vue"
import Comment from "../components/Comment.vue"
import Database from "../components/Database.vue"
import Main from"../components/Main.vue"
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: "root",
    redirect: "/login"
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    children: [
      {
        path:"main",
        component:Main
      },
      {
        path: "user",
        component: User
      },
      {
        path: "admin",
        component: Admin
      },
      {
        path: 'audit',
        component: Audit
      },
      {
        path: 'museum',
        component: Museum,
        
      },
      {
        path: 'exhibition',
        component: Exhibition
      },
      {
        path: 'education_activity',
        component: EducationActivity
      },
      {
        path: 'collection',
        component: Collection
      },
      {
        path: 'new',
        component: New
      },
      {
        path: 'explain',
        component: Explain
      },
      {
        path: 'comment',
        component: Comment,
       
      },
      {
        path: 'database',
        component: Database
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