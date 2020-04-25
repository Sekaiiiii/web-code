<template>
  <div class="index-component">
    <el-container>
      <el-header height="100px">
        <!-- 这里面放标题 用户按钮 -->
      </el-header>
      <el-container>
        <el-aside width="300px">
          <!-- 这里面放menu -->
          <div class="el-menu-box">
            <el-menu
              default-active="1"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              :router="true"
            >
              <el-submenu index="index">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>新闻管理</span>
                </template>
                <el-menu-item-group>
                  <template slot="title">分组一</template>
                  <el-menu-item index="1-1"></el-menu-item>
                  <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
              </el-submenu>

              <el-menu-item index="/index/new">
                <i class="el-icon-menu"></i>
                <span slot="title">新闻管理</span>
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
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
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
    }
  },
  beforeCreate(){
    var vm = this;
    //检查登录状态
    if(!vm.$store.state.is_login){
      vm.$message({
        message:"用户未登录,请先登录",
        center:true
      })
      vm.$router.replace({
        path:"/login"
      })
    }else{
      document.title = "博物馆后台管理系统";
    }
  },
  created(){

  },
  mounted(){

  },

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
  background-color: aqua;
  width: 100%;
}
.el-menu-box {
  height: 100%;
}
.el-menu {
  width: 100%;
  height: 100%;
}
</style>