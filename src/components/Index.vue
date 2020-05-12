<template>
  <div class="index-component">
    <el-container>
      <el-header height="50px">
        <!-- 这里面放标题 用户按钮 -->
      </el-header>
      <el-container>
        <el-aside>
          <!-- 这里面放menu -->
          <div class="el-menu-box">
            <el-menu
              default-active="1"
              @open="no_use"
              @close="no_use"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              :router="true"
            >
              <el-menu-item index="/index/main">
                <i class="el-icon-setting"></i>
                <span slot="title">首页</span>
              </el-menu-item>

              <el-submenu index="/index">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span slot="title">数据管理</span>
                </template>
                <el-menu-item index="/index/museum">博物馆信息</el-menu-item>
                <el-menu-item index="/index/exhibition">展览信息</el-menu-item>
                <el-menu-item index="/index/education_activity">教育活动信息</el-menu-item>
                <el-menu-item index="/index/collection">藏品信息</el-menu-item>
                <el-menu-item index="/index/new">新闻信息</el-menu-item>
                <el-menu-item index="/index/explain">讲解信息</el-menu-item>
                <el-menu-item index="/index/comment">评论信息</el-menu-item>
              </el-submenu>
              <el-menu-item index="/index/user">
                <i class="el-icon-menu"></i>
                <span slot="title">用户管理</span>
              </el-menu-item>
              <el-menu-item index="/index/admin">
                <i class="el-icon-menu"></i>
                <span slot="title">管理员管理</span>
              </el-menu-item>
              <el-menu-item index="/index/audit">
                <i class="el-icon-menu"></i>
                <span slot="title">讲解审核</span>
              </el-menu-item>
              <el-menu-item index="/index/database">
                <i class="el-icon-menu"></i>
                <span slot="title">数据库备份与恢复</span>
              </el-menu-item>
              <el-menu-item @click="logout" v-loading.fullscreen.lock="fullscreenLoading">
                <i class="el-icon-setting"></i>
                <span slot="title">退出登录</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
        <el-main>
          <!-- 这里面放个路由组件 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullscreenLoading: false
    };
  },
  methods: {
    logout() {
      var vm = this;
      vm.fullscreenLoading = true;
      this.$http({
        method: "get",
        url: "/api/web/logout"
      })
        .then(function(res) {
          console.log(res);
          vm.fullscreenLoading = false;
          //退出登录成功
          if (res.data.status == 1) {
            //显示退出登录成功
            vm.$message({
              message: res.data.data.msg,
              center: true
            });
            //跳转至登录页面
            vm.$router.replace({
              path: "/login"
            });
          } else {
            //退出登录失败
            vm.$message({
              message: res.data.error_des,
              center: true
            });
          }
        })
        .catch(function(err) {
          vm.fullscreenLoading = false;
          console.error(err);
          vm.$message({
            message: "发生意外的错误",
            center: true
          });
        });
    },
    no_use() {}
  },
  beforeCreate() {
    var vm = this;
    //检查登录状态
    if (!vm.$store.state.is_login) {
      vm.$message({
        message: "用户未登录,请先登录",
        center: true
      });
      vm.$router.replace({
        path: "/login"
      });
    } else {
      document.title = "博物馆后台管理系统";
    }
  },
  created() {},
  mounted() {}
};
</script>

<style scoped>
.index-component {
  height: 100%;
  width: 100%;
}
.el-container {
  height: 100%;
  width: 100%;
}
.el-header {
  background-color: gray;
}
.el-aside {
  background-color: gray;
}
.el-main {
  background-color: white;
  width: 100%;
  padding: 0px;
}
.el-menu-box {
  height: 100%;
}
.el-menu {
  width: 100%;
  height: 100%;
  border: 0px;
}
</style>