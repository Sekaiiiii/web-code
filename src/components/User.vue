<template>
  <div class="user-component">
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
            <el-form-item label="禁止评论">
              <el-select v-model="search_form.no_comment">
                <el-option label="全部" value></el-option>
                <el-option label="禁言用户" value="1"></el-option>
                <el-option label="非禁言用户" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="禁止上传讲解">
              <el-select v-model="search_form.no_upload_explain">
                <el-option label="全部" value></el-option>
                <el-option label="禁止上传讲解用户" value="1"></el-option>
                <el-option label="非禁止上传讲解用户" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          :data="user_list"
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
          <el-table-column label="发布评论" width="150" prop="no_comment">
            <template slot-scope="scope">
              <span v-if="scope.row.no_comment == 1">禁止评论</span>
              <span v-if="scope.row.no_comment == 0">允许评论</span>
            </template>
          </el-table-column>
          <el-table-column label="上传讲解" width="150" prop="no_upload_explain">
            <template slot-scope="scope">
              <span v-if="scope.row.no_upload_explain == 1">禁止上传讲解</span>
              <span v-if="scope.row.no_upload_explain == 0">允许上传讲解</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="toComment(scope.row)">查看评论</el-button>
              <el-button size="mini" @click="toExplain(scope.row)">查看讲解</el-button>
              <el-button size="mini" @click="wantSetPermission(scope.row)">设置权限</el-button>
              <el-button size="mini" @click="wantSetPassword(scope.row)">重置密码</el-button>
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

    <el-dialog title="重设密码" :visible.sync="setPasswordDialogShow">
      <el-form :model="set_password_form">
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="set_password_form.password1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input v-model="set_password_form.password2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setPasswordDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="setUserPassword" :loading="setUserPasswordLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置权限" :visible.sync="setPermissionDialogShow">
      <el-form :model="set_permission_form">
        <el-form-item label="禁止评论" :label-width="formLabelWidth">
          <el-switch
            v-model="set_permission_form.no_comment"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="禁止上传讲解" :label-width="formLabelWidth">
          <el-switch
            v-model="set_permission_form.no_upload_explain"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setPermissionDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="setUserPermission" :loading="setUserPermissionLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      have_param: false,

      setPermissionDialogShow: false,
      setPasswordDialogShow: false,

      table_loading: false,
     
      setUserPermissionLoading: false,
      setUserPasswordLoading: false,

      user_num: 0,
      user_list: [],

      set_permission_form: {
        no_comment: "",
        no_upload_explain: "",
        user_id: ""
      },

      set_password_form: {
        password1: "",
        password2: "",
        user_id: ""
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
    get_user() {
      let vm = this;
      vm.table_loading = true;
      let baseurl = "/api/web/get_user?";
      for (let key in vm.search_form) {
        if (vm.search_form[key] != "") {
          baseurl += key + "=" + vm.search_form[key] + "&";
        }
      }
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.user_list = res.data.data.user_list;
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
    get_user_num() {
      let vm = this;
      let baseurl = "/api/web/get_user_num?";
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
            vm.user_num = res.data.data.user_num;
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
      this.get_user();
      this.get_user_num();
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
    toExplain(row) {
      this.$router.push({
        path: "/index/explain",
        query: {
          user_id: row.id
        }
      });
    },
    toComment(row) {
      this.$router.push({
        path: "/index/comment",
        query: {
          user_id: row.id
        }
      });
    },
    wantSetPermission(row) {
      let vm = this;
      vm.set_permission_form.user_id = row.id;
      vm.set_permission_form.no_comment = row.no_comment ? true : false;
      vm.set_permission_form.no_upload_explain = row.no_upload_explain
        ? true
        : false;
      vm.setPermissionDialogShow = true;
    },
    wantSetPassword(row) {
      let vm = this;
      vm.set_password_form.user_id = row.id;
      vm.set_password_form.password1 = "";
      vm.set_password_form.password2 = "";
      vm.setPasswordDialogShow = true;
    },
    setUserPermission() {
      let vm = this;
      vm.setUserPermissionLoading = true;
      let param = {};
      if (vm.set_permission_form.no_comment) {
        param.no_comment = "1";
      } else {
        param.no_comment = "0";
      }
      if (vm.set_permission_form.no_upload_explain) {
        param.no_upload_explain = "1";
      } else {
        param.no_upload_explain = "0";
      }
      param.user_id = vm.set_permission_form.user_id;
      vm.$http({
        url: "/api/web/set_user_permission",
        method: "post",
        data: param
      })
        .then(res => {
          vm.setUserPermissionLoading = false;
          if (res.data.status == 1) {
            vm.setPermissionDialogShow = false;
            vm.$message({
              message: "修改权限成功",
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
          vm.setUserPermissionLoading = false;
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    setUserPassword() {
      let vm = this;
      if (vm.set_password_form.password1 != vm.set_password_form.password2) {
        return vm.$message({
          message: "输入的密码不相同",
          center: true
        });
      }
      vm.setUserPasswordLoading = true;
      vm.$http({
        url: "/api/web/set_user_password",
        method: "post",
        data: {
          user_id: vm.set_password_form.user_id,
          password: vm.set_password_form.password2
        }
      })
        .then(res => {
          vm.setUserPasswordLoading = false;
          if (res.data.status == 1) {
            vm.setPasswordDialogShow = false;
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
          vm.setUserPasswordLoading = false;
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
    if (vm.$route.query.user_id != undefined) {
      vm.have_param = true;
      vm.search_form.user_id = vm.$route.query.user_id;
    }
    vm.search();
  }
};
</script>

<style >
.user-component .form-line-box {
  text-align: center;
}
.user-component .form-line-box .el-form-item {
  text-align: center;
  padding-top: 20px;
}

.user-component .page-box {
  text-align: center;
}
</style>