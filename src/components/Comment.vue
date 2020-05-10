<template>
  <div class="comment-component">
    <el-container v-loading="table_loading">
      <el-header>
        <div class="form-line-box">
          <el-form :inline="true" :model="search_form">
            <el-form-item v-if="from_museum" >
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
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left">
                <div v-if="props.row.content">
                  <el-form-item label="内容">
                    <span>{{props.row.content}}</span>
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column label="评论ID" prop="id" width="120" :sortable="true"></el-table-column>
          <el-table-column label="评论时间" prop="time" :sortable="true"></el-table-column>
          <el-table-column label="评论内容" prop="content" :sortable="true"></el-table-column>
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
          <el-table-column label="评论用户" prop="name" :sortable="true"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="no_use(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      from_museum: false,
      table_loading: false,

      museum_list: [],

      comment_num: 0,
      comment_list: [],

      search_form: {
        museum_id: "",
        user_name: "",
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
          console.log(res);
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
    no_use() {},
    goBack() {
      this.$router.back();
    }
  },

  //生命周期函数
  created() {
    var vm = this;
    if (vm.$route.query.museum_id != undefined) {
      vm.from_museum = true;
      vm.search_form.museum_id = vm.$route.query.museum_id;
    }
    vm.get_museum();
    vm.get_comment();
    vm.get_comment_num();
  }
};
</script>

<style >
.comment-component .form-line.box {
  height: 100px;
}

.form-line.box .el-form-item {
  padding: 10px;
}

.comment-component .el-page-header__title {
  font-size: 20px;
  line-height: 40px;
}
</style>