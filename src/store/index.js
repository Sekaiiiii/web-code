import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        //用户登录状态
        is_login: false,
        //用户信息
        name: "",
        admin_permission: "",
        root_permission: "",
        main_page_cache: {
            museum_num: "",
            collection_num: "",
            exhibition_num: "",
            education_activity_num: "",
            comment_num: "",
            explain_num: "",
            new_num: "",
            user_num: "",
            admin_num: ""
        }
    },
    mutations: {
        setLoginStatu(state, is_login) {
            state.is_login = is_login
        },
        setUserInfo(state, name, admin_permission, root_permission) {
            state.name = name;
            state.admin_permission = admin_permission;
            state.root_permission = root_permission;
        },
        setMainPageCacheMuseumNum(state, p) {
            state.main_page_cache.museum_num = p;
        },
        setMainPageCacheCollectionNum(state, p) {
            state.main_page_cache.collection_num = p;
        },
        setMainPageCacheEducationActivityNum(state, p) {
            state.main_page_cache.education_activity_num = p;
        },
        setMainPageCacheCommentNum(state, p) {
            state.main_page_cache.comment_num = p;
        },
        setMainPageCacheExplainNum(state, p) {
            state.main_page_cache.explain_num = p;
        },
        setMainPageCacheNewNum(state, p) {
            state.main_page_cache.new_num = p;
        },
        setMainPageCacheUserNum(state, p) {
            state.main_page_cache.user_num = p;
        },
        setMainPageCacheAdminNum(state, p) {
            state.main_page_cache.admin_num = p;
        },
        setMainPageCacheExhibitionNum(state, p) {
            state.main_page_cache.exhibition_num = p;
        }
    }
})