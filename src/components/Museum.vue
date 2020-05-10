<template>
  <el-container class="museum-component" v-loading="table_loading">
    <el-header>
      <div class="form-line-box">
        <el-form :inline="true" :model="search_form">
          <el-form-item label="标题">
            <el-input v-model="search_form.name" placeholder="博物馆名字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="get_museum">查询</el-button>
          </el-form-item>
          <el-form-item label="检索到的博物馆数量:">
            <span>{{museum_num}}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-header>
    <el-main>
      <el-table
        :data="museum_list"
        height="750"
        border
        style="width: 100%"
        :default-sort="{prop: 'museum_id', order: 'descending'}"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left">
              <div v-if="props.row.establishment_time">
                <el-form-item label="建馆时间">
                  <span>{{props.row.establishment_time}}</span>
                </el-form-item>
              </div>
              <div v-if="props.row.open_time">
                <el-form-item label="开馆时间">
                  <span>{{props.row.open_time}}</span>
                </el-form-item>
              </div>
              <div v-if="props.row.close_time">
                <el-form-item label="闭馆时间">
                  <span>{{props.row.close_time}}</span>
                </el-form-item>
              </div>
              <div v-if="props.row.time">
                <el-form-item label="营业时间">
                  <span>{{props.row.time}}</span>
                </el-form-item>
              </div>
              <div v-if="props.row.introduction">
                <el-form-item label="介绍">
                  <span>{{props.row.introduction}}</span>
                </el-form-item>
              </div>
              <div v-if="props.row.visit_info">
                <el-form-item label="参观信息">
                  <span>{{props.row.visit_info}}</span>
                </el-form-item>
              </div>
              <div v-if="props.row.attention">
                <el-form-item label="注意事项">
                  <span>{{props.row.attention}}</span>
                </el-form-item>
              </div>
              <div v-if="props.row.position_name">
                <el-form-item label="地点">
                  <span>{{props.row.position_name}}</span>
                </el-form-item>
              </div>
              <div v-if="props.row.longitude">
                <el-form-item label="地点经度">
                  <span>{{props.row.longitude}}</span>
                </el-form-item>
              </div>
              <div v-if="props.row.latitude">
                <el-form-item label="地点纬度">
                  <span>{{props.row.latitude}}</span>
                </el-form-item>
              </div>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="博物馆ID" prop="id" width="120" :sortable="true"></el-table-column>
        <el-table-column label="名称" prop="name" :sortable="true"></el-table-column>
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

        <el-table-column label="操作" width="600">
          <template slot-scope="scope">
            <el-button size="mini" @click="no_use(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="no_use(scope.$index, scope.row)">查看展览</el-button>
            <el-button size="mini" @click="no_use(scope.$index, scope.row)">查看教育活动</el-button>
            <el-button size="mini" @click="no_use(scope.$index, scope.row)">查看藏品</el-button>
            <el-button size="mini" @click="getComment(scope.row)">查看评论</el-button>
            <el-button size="mini" @click="no_use(scope.$index, scope.row)">查看讲解</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      table_loading: false,
      search_form: {
        name: "",
        page: "",
        ppn: ""
      },
      museum_list: [],
      museum_num: 0
    };
  },
  computed: {},
  methods: {
    get_museum() {
      let vm = this;
      vm.table_loading = true;
      let baseurl = "/api/web/get_museum?";
      for (let key in vm.search_form) {
        if (vm.search_form[key] != "") {
          baseurl += key + "=" + vm.search_form[key] + "&";
        }
      }
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.museum_list = res.data.data.museum_list;
            vm.museum_num = res.data.data.museum_list.length;
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
    getComment(row) {
      let vm = this;
      vm.$router.push({
        path: "/index/comment",
        query: { museum_id: row.id }
      });
    },
    no_use() {}
  },

  //生命周期函数
  created() {
    var vm = this;
    vm.get_museum();
  }
};
</script>

<style>
.form-line.box .el-form-item {
  padding: 10px;
}
</style>