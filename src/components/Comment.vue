<template>
  <div class="comment-component">
    <el-container v-loading="table_loading">
      <el-header>
        <div class="form-line-box">
          <el-form :inline="true" :model="search_form">
            <el-form-item v-if="have_param">
              <el-button @click="goBack">返回上一页</el-button>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="search_form.user_name"></el-input>
            </el-form-item>
            <el-form-item label="博物馆">
              <el-select v-model="search_form.museum_id">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="museum in museum_list"
                  :key="museum.id"
                  :label="museum.name"
                  :value="museum.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="get_museum">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          :data="comment_list"
          height="750"
          border
          style="width: 100%"
          :default-sort="{prop: 'time', order: 'descending'}"
        >
          <el-table-column label="评论ID" prop="id" width="120" :sortable="true"></el-table-column>
          <el-table-column label="评论时间" prop="time" width="180" :sortable="true"></el-table-column>
          <el-table-column label="评论内容" prop="content" width="180" :sortable="true"></el-table-column>
          <el-table-column label="展览评分" width="150" prop="exhibition_score" :sortable="true">
            <template slot-scope="scope">
              <el-rate v-model="scope.row.exhibition_score" disabled text-color="#ff9900"></el-rate>
            </template>
          </el-table-column>
          <el-table-column label="环境评分" width="150" prop="environment_score" :sortable="true">
            <template slot-scope="scope">
              <el-rate v-model="scope.row.environment_score" disabled text-color="#ff9900"></el-rate>
            </template>
          </el-table-column>
          <el-table-column label="服务评分" width="150" prop="service_score" :sortable="true">
            <template slot-scope="scope">
              <el-rate v-model="scope.row.service_score" disabled text-color="#ff9900"></el-rate>
            </template>
          </el-table-column>
          <el-table-column label="评论用户" prop="name" width="150" :sortable="true"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="toMuseum(scope.row)">查看博物馆</el-button>
              <el-button size="mini" @click="toUser(scope.row)">查看用户</el-button>
              <el-button size="mini" @click="wantDeleteComment(scope.row)">删除评论</el-button>
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
              :total="comment_num"
              layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>
      </el-footer>
    </el-container>
    <el-dialog title="提示" :visible.sync="deleteCommentConfirmDialogShow" width="20%">
      <span>确定要删除ID为{{delete_comment_form.id}}的评论吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteCommentConfirmDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="deleteComment" :loading="deleteCommentLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      have_param: false,

      deleteCommentConfirmDialogShow: false,

      table_loading: false,
      deleteCommentLoading: false,

      museum_list: [],

      comment_num: 0,
      comment_list: [],

      delete_comment_form: {
        id: ""
      },

      search_form: {
        museum_id: "",
        user_name: "",
        user_id: "",
        page: 1,
        ppn: 15
      }
    };
  },
  computed: {},
  methods: {
    get_museum() {
      let vm = this;
      vm.$http
        .get("/api/web/get_museum")
        .then(res => {
          if (res.data.status == 1) {
            vm.museum_list = res.data.data.museum_list;
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
    get_comment() {
      let vm = this;
      vm.table_loading = true;
      let baseurl = "/api/web/get_comment?";
      for (let key in vm.search_form) {
        if (vm.search_form[key] != "") {
          baseurl += key + "=" + vm.search_form[key] + "&";
        }
      }
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.comment_list = res.data.data.comment_list;
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
    get_comment_num() {
      let vm = this;
      let baseurl = "/api/web/get_comment_num?";
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
            vm.comment_num = res.data.data.comment_num;
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
    goBack() {
      this.$router.back();
    },
    ppnChange(ppn) {
      let vm = this;
      vm.search_form.ppn = ppn;
      vm.search_form.page = 1;
      vm.get_comment();
    },
    pageChange(page) {
      let vm = this;
      vm.search_form.page = page;
      vm.get_comment();
    },
    toMuseum(row) {
      this.$router.push({
        path: "/index/museum",
        query: {
          museum_id: row.museum_id
        }
      });
    },
    toUser(row) {
      this.$router.push({
        path: "/index/user",
        query: {
          user_id: row.user_id
        }
      });
    },
    wantDeleteComment(row) {
      let vm = this;
      vm.deleteCommentConfirmDialogShow = true;
      vm.delete_comment_form.id = row.id;
    },
    deleteComment() {
      let vm = this;
      vm.deleteCommentLoading = true;
      vm.$http({
        url: "/api/web/del_comment",
        method: "post",
        data: {
          id: vm.delete_comment_form.id
        }
      })
        .then(res => {
          vm.deleteCommentLoading = false;
          if (res.data.status == 1) {
            vm.deleteCommentConfirmDialogShow = false;
            vm.$message({
              message: res.data.data.msg,
              center: true
            });
            vm.get_comment();
            vm.get_comment_num();
          } else {
            vm.$message({
              message: res.data.error_des,
              center: true
            });
          }
        })
        .catch(err => {
          vm.deleteCommentLoading = false;
          console.error(err);
          vm.message({
            message: "请求失败,请重试",
            center: true
          });
        });
    },
    no_use() {}
  },

  //生命周期函数
  created() {
    var vm = this;
    if (vm.$route.query.museum_id != undefined) {
      vm.have_param = true;
      vm.search_form.museum_id = vm.$route.query.museum_id;
    }
    if (vm.$route.query.user_id != undefined) {
      vm.have_param = true;
      vm.search_form.user_id = vm.$route.query.user_id;
    }
    vm.get_museum();
    vm.get_comment();
    vm.get_comment_num();
  }
};
</script>

<style >
.comment-component .form-line-box {
  text-align: center;
  padding-top: 10px;
}
.comment-component .form-line-box .el-form-item {
  padding: 10px;
}
.comment-component .page-box {
  text-align: center;
}
</style>