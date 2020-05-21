<template>
  <div class="main-component">
    <el-container>
      <el-header height="80px">
        <div class="header-title">
          <h1>后台管理子系统首页</h1>
        </div>
      </el-header>
      <el-main>
        <el-row class="card-row" :gutter="40">
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>博物馆信息</span>
                <el-link href="/#/index/museum" style="float: right; padding: 3px 0">GOTO</el-link>
              </div>
              <div>
                <span>博物馆数量:</span>
                <span style="float:right">{{museum_num}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>展览信息</span>
                <el-link href="/#/index/exhibition" style="float: right; padding: 3px 0">GOTO</el-link>
              </div>
              <div>
                <span>展览数量:</span>
                <span style="float:right">{{exhibition_num}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>教育活动信息</span>
                <el-link
                  href="/#/index/education_activity"
                  style="float: right; padding: 3px 0"
                >GOTO</el-link>
              </div>
              <div>
                <span>教育活动数量:</span>
                <span style="float:right">{{education_activity_num}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="card-row" :gutter="40">
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>藏品信息</span>
                <el-link href="/#/index/collection" style="float: right; padding: 3px 0">GOTO</el-link>
              </div>
              <div>
                <span>藏品数量:</span>
                <span style="float:right">{{collection_num}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>新闻信息</span>
                <el-link href="/#/index/new" style="float: right; padding: 3px 0">GOTO</el-link>
              </div>
              <div>
                <span>新闻数量:</span>
                <span style="float:right">{{new_num}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>讲解信息</span>
                <el-link href="/#/index/explain" style="float: right; padding: 3px 0">GOTO</el-link>
              </div>
              <div>
                <span>讲解数量:</span>
                <span style="float:right">{{explain_num}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="card-row" :gutter="40">
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>评论信息</span>
                <el-link href="/#/index/comment" style="float: right; padding: 3px 0">GOTO</el-link>
              </div>
              <div>
                <span>评论数量:</span>
                <span style="float:right">{{comment_num}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>用户信息</span>
                <el-link href="/#/index/user" style="float: right; padding: 3px 0">GOTO</el-link>
              </div>
              <div>
                <span>用户数量:</span>
                <span style="float:right">{{user_num}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>管理员信息</span>
                <el-link href="/#/index/admin" style="float: right; padding: 3px 0">GOTO</el-link>
              </div>
              <div>
                <span>管理员数量:</span>
                <span style="float:right">{{admin_num}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      museum_num: "",
      collection_num: "",
      exhibition_num: "",
      education_activity_num: "",
      comment_num: "",
      explain_num: "",
      new_num: "",
      user_num: "",
      admin_num: ""
    };
  },
  methods: {
    check_cache() {
      //从vuex里面找
      let vm = this;
      if (vm.$store.state.main_page_cache.museum_num == "") {
        vm.get_museum_num();
      } else {
        vm.museum_num = vm.$store.state.main_page_cache.museum_num;
      }
      if (vm.$store.state.main_page_cache.collection_num == "") {
        vm.get_collection_num();
      } else {
        vm.collection_num = vm.$store.state.main_page_cache.collection_num;
      }
      if (vm.$store.state.main_page_cache.exhibition_num == "") {
        vm.get_exhibition_num();
      } else {
        vm.exhibition_num = vm.$store.state.main_page_cache.exhibition_num;
      }
      if (vm.$store.state.main_page_cache.education_activity_num == "") {
        vm.get_education_activity_num();
      } else {
        vm.education_activity_num =
          vm.$store.state.main_page_cache.education_activity_num;
      }
      if (vm.$store.state.main_page_cache.comment_num == "") {
        vm.get_comment_num();
      } else {
        vm.comment_num = vm.$store.state.main_page_cache.comment_num;
      }
      if (vm.$store.state.main_page_cache.new_num == "") {
        vm.get_new_num();
      } else {
        vm.new_num = vm.$store.state.main_page_cache.new_num;
      }
      if (vm.$store.state.main_page_cache.explain_num == "") {
        vm.get_explain_num();
      } else {
        vm.explain_num = vm.$store.state.main_page_cache.explain_num;
      }
      if (vm.$store.state.main_page_cache.user_num == "") {
        vm.get_user_num();
      } else {
        vm.user_num = vm.$store.state.main_page_cache.user_num;
      }
      if (vm.$store.state.main_page_cache.admin_num == "") {
        vm.get_admin_num();
      } else {
        vm.admin_num = vm.$store.state.main_page_cache.admin_num;
      }
    },
    get_museum_num() {
      let vm = this;
      let baseurl = "/api/web/get_museum";
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.museum_num = res.data.data.museum_list.length;
            vm.$store.commit("setMainPageCacheMuseumNum", vm.museum_num);
          } else {
            vm.$message({
              message: res.data.error_des
            });
          }
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    get_exhibition_num() {
      let vm = this;
      let baseurl = "/api/web/get_exhibition_num";
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.exhibition_num = res.data.data.exhibition_num;
            vm.$store.commit(
              "setMainPageCacheExhibitionNum",
              vm.exhibition_num
            );
          } else {
            vm.$message({
              message: res.data.error_des
            });
          }
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    get_collection_num() {
      let vm = this;
      let baseurl = "/api/web/get_collection_num";
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.collection_num = res.data.data.collection_num;
            vm.$store.commit(
              "setMainPageCacheCollectionNum",
              vm.collection_num
            );
          } else {
            vm.$message({
              message: res.data.error_des
            });
          }
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    get_education_activity_num() {
      let vm = this;
      let baseurl = "/api/web/get_education_activity_num";
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.education_activity_num = res.data.data.education_activity_num;
            vm.$store.commit(
              "setMainPageCacheEducationActivityNum",
              vm.education_activity_num
            );
          } else {
            vm.$message({
              message: res.data.error_des
            });
          }
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    get_new_num() {
      let vm = this;
      let baseurl = "/api/web/get_new_num";
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.new_num = res.data.data.new_num;
            vm.$store.commit("setMainPageCacheNewNum", vm.new_num);
          } else {
            vm.$message({
              message: res.data.error_des
            });
          }
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    get_comment_num() {
      let vm = this;
      let baseurl = "/api/web/get_comment_num";
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.comment_num = res.data.data.comment_num;
            vm.$store.commit("setMainPageCacheCommentNum", vm.comment_num);
          } else {
            vm.$message({
              message: res.data.error_des
            });
          }
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    get_explain_num() {
      let vm = this;
      let baseurl = "/api/web/get_explain_num";
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.explain_num = res.data.data.explain_num;
            vm.$store.commit("setMainPageCacheExplainNum", vm.explain_num);
          } else {
            vm.$message({
              message: res.data.error_des
            });
          }
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    get_user_num() {
      let vm = this;
      let baseurl = "/api/web/get_user_num";
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.user_num = res.data.data.user_num;
            vm.$store.commit("setMainPageCacheUserNum", vm.user_num);
          } else {
            vm.$message({
              message: res.data.error_des
            });
          }
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    get_admin_num() {
      let vm = this;
      let baseurl = "/api/web/get_admin_num";
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.admin_num = res.data.data.admin_num;
            vm.$store.commit("setMainPageCacheAdminNum", vm.admin_num);
          } else {
            vm.$message({
              message: res.data.error_des
            });
          }
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    }
  },
  created() {
    var vm = this;
    vm.check_cache();
  }
};
</script>



<style>
.main-component .header-title {
  height: 100%;
  width: 100%;
  font-size: 40px;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  text-align: center;
  padding-top: 20px;
}

.main-component .card-row {
  padding: 30px;
}

</style>