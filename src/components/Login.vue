<template>
  <div class="login-component">
    <el-container>
      <el-header></el-header>
      <el-main>
        <div class="login-form-box">
          <h1>博物馆应用系统</h1>
          <h1>后台管理子系统</h1>
          <el-form>
            <el-form-item>
              <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input prefix-icon="el-icon-user" placeholder="请输入密码" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input prefix-icon="el-icon-user" placeholder="请输入密码" v-model="form.mail_address"></el-input>
            </el-form-item>
            <el-form-item>
              <el-row>
                <el-col :span="24">
                  <el-button style="width:100%" type="primary" @click="onSubmit">登录</el-button>
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
      form: {
        name: "",
        password: "",
        mail_address:""
      }
    };
  },
  methods: {
    onSubmit() {
      var vm = this;
      console.log("调用");
      this.$http({
        method:"post",
        url:"/api/web/register",
        data:{
          name:this.form.name,
          password:this.form.password,
          mail_address:this.form.mail_address
        }
      }).then(function(res){
        console.log(res);
        if(res.data.status == 1){
          console.log("注册成功，给您自动跳转至首页面");
          vm.$message({
             message: '居中的文字',
              center: true
          })
          vm.$router.push({
            path: '/index',
          })
        }else{
          vm.$message({
             message: '登录失败',
              center: true
          })
        }
      }).catch(function(err){
        console.log(err);
      })
    },
    reset() {
      this.form.name = "";
      this.form.password = "";
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
  height:40%;
  width: 20%;
  padding: 10px;

  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  border-radius: 10%;
  background-image: url("../assets/login-form-background-image.jpg");
}
</style>