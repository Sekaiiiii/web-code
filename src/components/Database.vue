<template>
  <div class="database-component">
    <el-container v-loading="table_loading">
      <el-header>
        <div class="form-line-box">
          <el-form :inline="true" size="mini">
            <el-form-item>
              <el-button type="primary" @click="mysql_dump">备份当前数据库</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table :data="dump_list" height="750" border style="width: 100%">
          <el-table-column label="备份年月日" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.substr(2,10)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="备份具体时间" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.substr(13,2) + ":" + scope.row.substr(15,2) + ":" + scope.row.substr(17,2)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="备份文件名" width="300">
            <template slot-scope="scope">
              <span>{{scope.row}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="recovery(scope.row)">恢复到这个备份</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      table_loading: false,

      dump_num: 0,
      dump_list: []
    };
  },
  methods: {
    get_dump() {
      let vm = this;
      vm.table_loading = true;
      vm.$http
        .get("/api/web/get_mysql_dump")
        .then(res => {
          vm.table_loading = false;
          vm.dump_num = res.data.data.dump_list.length;
          vm.dump_list = res.data.data.dump_list;
        })
        .catch(err => {
          console.error(err);
          vm.$message({
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    mysql_dump() {
      let vm = this;
      vm.table_loading = true;
      vm.$http
        .get("/api/web/mysql_dump")
        .then(res => {
          vm.table_loading = false;
          if (res.data.status == 1) {
            vm.$message({
              message: res.data.data.msg,
              center: true
            });
            vm.get_dump();
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
            message: "请求失败，请重试",
            center: true
          });
        });
    },
    recovery(row) {
      let vm = this;
      vm.table_loading = true;
      vm.$http
        .post("/api/web/recovery_database", {
          name: row
        })
        .then(res => {
          vm.table_loading = false;
          if (res.data.status == 1) {
            vm.$message({
              message: res.data.data.msg,
              center: true
            });
            vm.get_dump();
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
            message: "请求失败，请重试",
            center: true
          });
        });
    }
  },
  //生命周期函数
  created() {
    var vm = this;
    vm.get_dump();
  }
};
</script>

<style >
.database-component .form-line-box {
  text-align: center;
}
.database-component .form-line-box .el-form-item {
  text-align: center;
  padding-top: 20px;
}
</style>