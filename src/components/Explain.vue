<template>
  <div class="explain-component">
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
            <el-form-item label="审核情况">
              <el-select v-model="search_form.is_illegal">
                <el-option label="全部" value></el-option>
                <el-option label="审核通过" value="0"></el-option>
                <el-option label="未审核" value="1"></el-option>
                <el-option label="审核不通过" value="2"></el-option>
              </el-select>
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
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          :data="explain_list"
          height="750"
          border
          style="width: 100%"
          :default-sort="{prop: 'time', order: 'descending'}"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left">
                <div v-if="props.row.artist">
                  <el-form-item label="作者">
                    <span>{{props.row.artist}}</span>
                  </el-form-item>
                </div>
                <div v-if="props.row.album">
                  <el-form-item label="专辑">
                    <span>{{props.row.album}}</span>
                  </el-form-item>
                </div>
                <div v-if="props.row.genre">
                  <el-form-item label="流派">
                    <span>{{props.row.genre}}</span>
                  </el-form-item>
                </div>
                <div v-if="props.row.duration">
                  <el-form-item label="持续时间">
                    <span>{{props.row.duration}}</span>
                  </el-form-item>
                </div>
                <div v-if="props.row.duration_unit">
                  <el-form-item label="持续时间单元">
                    <span>{{props.row.duration_unit}}</span>
                  </el-form-item>
                </div>
                <div v-if="props.row.album_art_res_id">
                  <el-form-item label="唱片集ID">
                    <span>{{props.row.album_art_res_id}}</span>
                  </el-form-item>
                </div>
                <div v-if="props.row.album_art_res_name">
                  <el-form-item label="唱片集名字">
                    <span>{{props.row.album_art_res_name}}</span>
                  </el-form-item>
                </div>
                <div v-if="props.row.user_mail_address">
                  <el-form-item label="用户邮箱">
                    <span>{{props.row.user_mail_address}}</span>
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column label="讲解ID" prop="id" width="120" :sortable="true"></el-table-column>
          <el-table-column label="讲解标题" prop="title" width="180" :sortable="true"></el-table-column>
          <el-table-column label="上传用户" prop="user_name" width="150" :sortable="true"></el-table-column>
          <el-table-column label="讲解分类" width="150" prop="is_illegal">
            <template slot-scope="scope">
              <span v-if="scope.row.museum_id">博物馆讲解</span>
              <span v-if="scope.row.exhibition_id">展览讲解</span>
              <span v-if="scope.row.collection_id">藏品讲解</span>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="150" prop="is_illegal">
            <template slot-scope="scope">
              <span v-if="scope.row.is_illegal == 1">未审核</span>
              <span v-if="scope.row.is_illegal == 0">审核通过</span>
              <span v-if="scope.row.is_illegal == 2">审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column width="330">
            <template slot="header">
              <span>播放讲解</span>
            </template>
            <template slot-scope="scope">
              <audio controls>
                <source :src="'http://192.144.239.176:8080/'+scope.row.file" type="audio/mpeg" />
              </audio>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.museum_id" size="mini" @click="toMuseum(scope.row)">查看博物馆</el-button>
              <el-button
                v-if="scope.row.exhibition_id"
                size="mini"
                @click="toExhibition(scope.row)"
              >查看展览</el-button>
              <el-button
                v-if="scope.row.collection_id"
                size="mini"
                @click="toCollection(scope.row)"
              >查看藏品</el-button>
              <el-button size="mini" @click="toUser(scope.row)">查看用户</el-button>
              <el-button size="mini" @click="wantDeleteExplain(scope.row)">删除讲解</el-button>
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
              :total="explain_num"
              layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>
      </el-footer>
    </el-container>
    <el-dialog
      title="提示"
      :visible.sync="deleteExplainConfirmDialogShow"
      width="20%"
    >
      <span>确定要删除ID为{{delete_explain_form.id}}的讲解吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteExplainConfirmDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="deleteExplain" :loading="deleteExplainLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      have_param: false,

      deleteExplainConfirmDialogShow: false,

      deleteExplainLoading: false,
      table_loading: false,

      museum_list: [],

      explain_num: 0,
      explain_list: [],

      delete_explain_form: {
        id: ""
      },

      search_form: {
        museum_id: "",
        collection_id: "",
        exhibition_id: "",
        user_name: "",
        is_illegal: "",
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
    get_explain() {
      let vm = this;
      vm.table_loading = true;
      let baseurl = "/api/web/get_explain?";
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
            vm.explain_list = res.data.data.explain_list;
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
    get_explain_num() {
      let vm = this;
      let baseurl = "/api/web/get_explain_num?";
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
            vm.explain_num = res.data.data.explain_num;
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
      this.get_explain();
      this.get_explain_num();
    },
    goBack() {
      this.$router.back();
    },
    ppnChange(ppn) {
      let vm = this;
      vm.search_form.ppn = ppn;
      vm.search_form.page = 1;
      vm.get_explain();
    },
    pageChange(page) {
      let vm = this;
      vm.search_form.page = page;
      vm.get_explain();
    },
    toMuseum(row) {
      this.$router.push({
        path: "/index/museum",
        query: {
          museum_id: row.museum_id
        }
      });
    },
    toExhibition(row) {
      this.$router.push({
        path: "/index/exhibition",
        query: {
          exhibition_id: row.exhibition_id
        }
      });
    },
    toCollection(row) {
      this.$router.push({
        path: "/index/collection",
        query: {
          collection_id: row.collection_id
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
    wantDeleteExplain(row) {
      let vm = this;
      vm.deleteExplainConfirmDialogShow = true;
      vm.delete_explain_form.id = row.id;
    },
    deleteExplain() {
      let vm = this;
      vm.deleteExplainLoading = true;
      vm.$http({
        url: "/api/web/del_explain",
        method: "post",
        data: {
          id: vm.delete_explain_form.id
        }
      })
        .then(res => {
          vm.deleteExplainLoading = false;
          if (res.data.status == 1) {
            vm.deleteExplainConfirmDialogShow = false;
            vm.$message({
              message: res.data.data.msg,
              center: true
            });
            //刷新页面
            vm.get_explain();
            vm.get_explain_num();
          } else {
            vm.$message({
              message: res.data.error_des,
              center: true
            });
          }
        })
        .catch(err => {
          vm.deleteExplainLoading = false;
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
    if (vm.$route.query.exhibition_id != undefined) {
      vm.have_param = true;
      vm.search_form.exhibition_id = vm.$route.query.exhibition_id;
    }
    if (vm.$route.query.collection_id != undefined) {
      vm.have_param = true;
      vm.search_form.collection_id = vm.$route.query.collection_id;
    }
    if (vm.$route.query.user_id != undefined) {
      vm.have_param = true;
      vm.search_form.user_id = vm.$route.query.user_id;
    }
    vm.get_museum();
    vm.get_explain();
    vm.get_explain_num();
  }
};
</script>

<style >
.explain-component .form-line-box {
  height: 100px;
  padding-top: 10px;
  text-align: center;
}

.explain-component .form-line-box .el-form-item {
  padding: 10px;
}

.explain-component .page-box {
  text-align: center;
}
</style>