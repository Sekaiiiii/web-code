import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        //用户登录状态
        is_login:false,
        //用户信息
        name:"",
        admin_permission:"",
        root_permission:""
    },
    mutations: {
        setLoginStatu(state,is_login){
            state.is_login = is_login
        },
        setUserInfo(state,name,admin_permission,root_permission){
            state.name = name;
            state.admin_permission = admin_permission;
            state.root_permission = root_permission;
        }
    }
})