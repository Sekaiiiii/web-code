<template>
  <div class="collection-component">
    <el-container v-loading="table_loading">
      <el-header>
        <div class="form-line-box">
          <el-form :inline="true" :model="search_form">
            <el-form-item v-if="have_param">
              <el-button @click="goBack">返回上一页</el-button>
            </el-form-item>
            <el-form-item label="藏品名称">
              <el-input v-model="search_form.name"></el-input>
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
          :data="collection_list"
          height="750"
          border
          style="width: 100%"
          :default-sort="{prop: 'id', order: 'ascending'}"
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

          <el-table-column label="藏品ID" prop="id" width="120" :sortable="true"></el-table-column>
          <el-table-column label="藏品名称" prop="name" width="300" :sortable="true"></el-table-column>
          <el-table-column label="藏品分类" prop="material" width="300" :sortable="true">
            <template slot-scope="props">
              <span v-if="props.row.material">{{props.row.material}}</span>
              <span v-else>未获取到数据</span>
            </template>
          </el-table-column>
          <el-table-column label="所属博物馆" width="250" prop="museum_name" :sortable="true"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="no_use(scope.$index, scope.row)">编辑</el-button>
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
              :total="collection_num"
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

      museum_list: [],

      collection_num: 0,
      collection_list: [],

      search_form: {
        museum_id: "",
        collection_id: "",

        name: "",
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
    get_exhibtion() {
      let vm = this;
      vm.table_loading = true;
      let baseurl = "/api/web/get_collection?";
      for (let key in vm.search_form) {
        if (vm.search_form[key] != "") {
          baseurl += key + "=" + vm.search_form[key] + "&";
        }
      }
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.collection_list = res.data.data.collection_list;
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
    get_exhibition_num() {
      let vm = this;
      let baseurl = "/api/web/get_collection_num?";
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
            vm.collection_num = res.data.data.collection_num;
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
      vm.get_collection();
    },
    pageChange(page) {
      let vm = this;
      vm.search_form.page = page;
      vm.get_collection();
    },
    search() {
      let vm = this;
      vm.get_collection();
      vm.get_colleciton_num();
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
    vm.get_museum();
    vm.get_exhibtion();
    vm.get_exhibition_num();
  }
};
</script>

<style >
.collection-component .form-line-box {
  text-align: center;
  padding-top: 10px;
}
.collection-component .form-line-box .el-form-item {
  padding: 10px;
}
.collection-component .page-box {
  text-align: center;
}
</style>