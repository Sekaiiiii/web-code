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
              <el-button type="info" @click="insAdminDialogShow = true">新增用户</el-button>
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
              <el-button size="mini" @click="want_set_password(scope.row)">修改管理员密码</el-button>
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
              :total="admin_num"
              layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>
      </el-footer>
    </el-container>
    <el-dialog title="新增管理员" :visible.sync="insAdminDialogShow">
      <el-form :model="ins_admin_form">
        <el-form-item label="管理员名字" :label-width="formLabelWidth">
          <el-input v-model="ins_admin_form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" :label-width="formLabelWidth">
          <el-input v-model="ins_admin_form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员邮箱" :label-width="formLabelWidth">
          <el-input v-model="ins_admin_form.mail_address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insAdminDialogShow = false">取 消</el-button>
        <el-button type="primary" :loading="ins_admin_loding" @click="ins_admin">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="管理员日志" :visible.sync="AdminLogDialogShow" @close="closeLogDialog">
      <el-table :data="admin_log_list">
        <el-table-column prop="time" label="时间" width="150"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="previous_log_page">上一页</el-button>
        <el-button @click="next_log_page">下一页</el-button>
        <el-button @click="AdminLogDialogShow = false">返 回</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改管理员密码" :visible.sync="setAdminPasswordDialogShow">
      <el-form :model="set_password_form">
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="set_password_form.password1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="再次确认密码" :label-width="formLabelWidth">
          <el-input v-model="set_password_form.password2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setAdminPasswordDialogShow = false">取 消</el-button>
        <el-button type="primary" :loading="set_password_loding" @click="set_password">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      insAdminDialogShow: false,
      AdminLogDialogShow: false,
      setAdminPasswordDialogShow: false,
      have_param: false,

      //加载框
      table_loading: false,
      ins_admin_loding: false,
      set_password_loding: false,

      //管理员列表
      admin_num: 0,
      admin_list: [],

      //管理员日志
      admin_log_list: [],
      admin_log_page: 1,
      temp_user_id: 0, //临时变量

      ins_admin_form: {
        name: "",
        password: "",
        mail_address: ""
      },

      set_password_form: {
        user_id: 0,
        password1: "",
        password2: ""
      },

      search_form: {
        user_name: "",
        mail_address: "",
        no_comment: "",
        no_upload_explain: "",
        user_id: "",
        page: 1,
        ppn: 15
      },
      formLabelWidth: "120px"
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
      let vm = this;
      //打开对话框
      vm.AdminLogDialogShow = true;
      let user_id;
      if (row) {
        user_id = row.id;
        vm.temp_user_id = row.id;
      } else {
        user_id = vm.temp_user_id;
      }
      let baseurl = `/api/web/get_admin_log?user_id=${user_id}&page=${vm.admin_log_page}`;
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.admin_log_list = res.data.data.log_list;
          } else {
            vm.$message({
              message: res.data.error_des,
              center: true
            });
          }
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求错误，请重试",
            center: true
          });
        });
    },
    next_log_page() {
      let vm = this;
      vm.admin_log_page += 1;
      vm.get_log();
    },
    previous_log_page() {
      let vm = this;
      if (vm.admin_log_page == 1) {
        vm.$message({
          message: "已经是第一页了",
          center: true
        });
      } else {
        vm.admin_log_page -= 1;
        vm.get_log();
      }
    },
    closeLogDialog() {
      let vm = this;
      vm.temp_user_id = 0;
      vm.admin_log_page = 1;
      vm.admin_log_list = [];
    },
    ins_admin() {
      let vm = this;
      vm.ins_admin_loding = true;
      vm.$http({
        method: "post",
        url: "/api/web/ins_admin",
        data: vm.ins_admin_form
      })
        .then(res => {
          vm.ins_admin_loding = false;
          if (res.data.status == 1) {
            vm.insAdminDialogShow = false;
            for (let key in vm.ins_admin_form) {
              vm.ins_admin_form[key] = "";
            }
            vm.$message({
              message: "添加管理员成功",
              center: true
            });
          } else {
            vm.$message({
              message: res.data.error_des,
              center: true
            });
          }
        })
        .catch(err => {
          vm.ins_admin_loding = false;
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    want_set_password(row) {
      let vm = this;
      //打开会话框
      vm.setAdminPasswordDialogShow = true;
      //初始化表单
      for (let key in vm.set_password_form) {
        vm.set_password_form[key] = "";
      }
      vm.set_password_form.user_id = row.id;
    },
    set_password() {
      let vm = this;
      //检查表单内容
      if (vm.set_password_form.password1 != vm.set_password_form.password2) {
        return vm.$message({
          message: "输入密码不一致",
          center: true
        });
      }

      vm.set_password_loding = true;
      vm.$http({
        url: "/api/web/set_user_password",
        method: "post",
        data: {
          user_id: vm.set_password_form.user_id,
          password: vm.set_password_form.password2
        }
      })
        .then(res => {
          vm.set_password_loding = true;
          if (res.data.status == 1) {
            vm.setAdminPasswordDialogShow = false;
            vm.$message({
              message: res.data.data.msg,
              center: true
            });
          } else {
            vm.$message({
              message: res.data.error_des,
              center: true
            });
          }
        })
        .catch(err => {
          vm.set_password_loding = false;
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
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