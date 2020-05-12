<template>
  <div class="admin-component">
    <el-container v-loading="table_loading">
      <el-header>
        <div class="form-line-box">
          <el-form :inline="true" :model="search_form" size="mini">
            <el-form-item v-if="have_param">
              <el-button @click="goBack">返回上一页</el-button>
            </el-form-item>
            <el-form-item label="用户ID">
              <el-input v-model="search_form.user_id"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="search_form.user_name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址">
              <el-input v-model="search_form.mail_address"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          :data="admin_list"
          height="750"
          border
          style="width: 100%"
          :default-sort="{prop: 'id', order: 'descending'}"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left">
                <div v-if="props.row.user_mail_address">
                  <el-form-item label="用户邮箱">
                    <span>{{props.row.user_mail_address}}</span>
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column label="用户ID" prop="id" width="120" :sortable="true"></el-table-column>
          <el-table-column label="用户名" prop="name" width="180" :sortable="true"></el-table-column>
          <el-table-column label="邮箱地址" prop="mail_address" width="250"></el-table-column>
          <el-table-column label="角色名" prop="role_name" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.role_name == 'admin'">管理员</span>
              <span v-if="scope.row.role_name == 'root'">超级管理员</span>
              <span v-if="scope.row.role_name == 'user'">普通用户</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="set_password(scope.row)">修改管理员密码</el-button>
              <el-button size="mini" @click="get_log(scope.row)">查看管理员日志</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-footer>
        <div class="page-box">
          <div class="block">
            <el-pagination
              @size-change="ppnChange"
              @current-change="pageChange"
              :current-page="search_form.page"
              :page-sizes="[15,30,50,100,200,400,800]"
              :page-size="search_form.ppn"
              :total="user_num"
              layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      have_param: false,
      table_loading: false,

      admin_num: 0,
      admin_list: [],

      search_form: {
        user_name: "",
        mail_address: "",
        no_comment: "",
        no_upload_explain: "",
        user_id: "",
        page: 1,
        ppn: 15
      }
    };
  },
  computed: {},
  methods: {
    get_admin() {
      let vm = this;
      vm.table_loading = true;
      let baseurl = "/api/web/get_admin?";
      for (let key in vm.search_form) {
        if (vm.search_form[key] != "") {
          baseurl += key + "=" + vm.search_form[key] + "&";
        }
      }
      vm.$http
        .get(baseurl)
        .then(res => {
          console.log(res);
          if (res.data.status == 1) {
            vm.admin_list = res.data.data.admin_list;
            vm.$message({
              message: res.data.data.msg,
              center: true
            });
          } else {
            vm.$message({
              message: res.data.error_des
            });
          }
          vm.table_loading = false;
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
          vm.table_loading = false;
        });
    },
    get_admin_num() {
      let vm = this;
      let baseurl = "/api/web/get_admin_num?";
      for (let key in vm.search_form) {
        if (key == "ppn" || key == "page") continue;
        if (vm.search_form[key] != "") {
          baseurl += key + "=" + vm.search_form[key] + "&";
        }
      }
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.admin_num = res.data.data.admin_num;
            vm.$message({
              message: res.data.data.msg,
              center: true
            });
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
    search() {
      this.get_admin();
      this.get_admin_num();
    },
    goBack() {
      this.$router.back();
    },
    ppnChange(ppn) {
      let vm = this;
      vm.search_form.ppn = ppn;
      vm.search_form.page = 1;
      vm.get_user();
    },
    pageChange(page) {
      let vm = this;
      vm.search_form.page = page;
      vm.get_user();
    },
    get_log(row) {
      console.log(row);
    },
    set_password(row) {
      console.log(row);
    },
    no_use() {}
  },

  //生命周期函数
  created() {
    var vm = this;
    
    vm.search();
  }
};
</script>

<style >
.admin-component .form-line-box {
  text-align: center;
}
.admin-component .form-line-box .el-form-item {
  text-align: center;
  padding-top: 20px;
}

.admin-component .page-box {
  text-align: center;
}
</style>