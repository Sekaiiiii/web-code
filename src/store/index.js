import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        //用户登录状态
        is_login: false,
        //用户信息
        user_info: {
            user_id: "",
            name: "",
            mail_address: "",
            admin_permission: "",
            root_permission: ""
        },

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
        setUserInfo(state, user_info) {
            state.user_info.user_id = user_info.user_id;
            state.user_info.name = user_info.name;
            state.user_info.mail_address = user_info.mail_address;
            state.user_info.admin_permission = user_info.admin_permission;
            state.user_info.root_permission = user_info.root_permission;
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