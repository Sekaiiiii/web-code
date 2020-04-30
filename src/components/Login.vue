<template>
  <div class="login-component">
    <el-container>
      <el-header></el-header>
      <el-main>
        <div class="login-form-box">
          <el-form>
            <el-form-item>
              <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input prefix-icon="el-icon-user" placeholder="请输入密码" v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-row>
                <el-col :span="24">
                  <el-button style="width:100%" type="primary" @click="onSubmit" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
                </el-col>
              </el-row>
              <el-row  style="margin-top:10px">
                <el-col :span="24">
                  <el-button style="width:100%" type="info" @click="reset">重置</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullscreenLoading:false,
      form: {
        name: "",
        password: ""
      }
    };
  },
  methods: {
    onSubmit() {
      var vm = this;
      vm.fullscreenLoading = true;

      vm.$http({
        method:"post",
        url:"/api/web/login",
        data:{
          name:vm.form.name,
          password:vm.form.password
        }
      })
      .then(function(res){
        console.log(res);
        vm.fullscreenLoading = false;
        if(res.data.status == 1){
          //设置登录状态
          vm.$store.commit("setLoginStatu",true);
          vm.$message({
            message: res.data.data.msg,
            center: true
          })
          vm.$router.replace({
            path: '/index'
          })
        }else{
          vm.$message({
            message: res.data.error_des,
            center: true
          })
        }
      })
      .catch(function(err){
        vm.fullscreenLoading = false;
        console.log(err);
      })
    },
    reset() {
      this.form.name = "";
      this.form.password = "";
      this.$http({
        url:"/api/web/logout",
        method:"get"
      })
      .then(function(res){console.log(res)})
      .catch(function(err){console.log(err)})
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
}
.login-component {
  width: 100%;
  height: 100%;
  background-image: url("../assets/login-background-image.jpg");
}

.el-icon-user {
  display: block;
  font-size: 30px;
}

.login-form-box {
  height:240px;
  width: 400px;
  padding-top:30px;
  padding-bottom: 15px;
  padding-right:15px;
  padding-left: 15px;

  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  border-radius: 10%;
  background-image: url("../assets/login-form-background-image.jpg");
}

.el-input {
  width:400px
}
</style>