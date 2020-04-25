<template>
  <div class="new-component">
    <el-table  :data="new_list" height="100%" border style="width: 100%">
      <el-table-column prop="author" label="日期" width="180"></el-table-column>
      <el-table-column prop="content" label="姓名" width="180"></el-table-column>
      <el-table-column prop="description" label="地址"></el-table-column>
      <el-table-column prop="id" label="地址"></el-table-column>
      <el-table-column prop="tag" label="地址"></el-table-column>
      <el-table-column prop="time" label="地址"></el-table-column>
      <el-table-column prop="title" label="地址"></el-table-column>
      <el-table-column prop="url" label="地址"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      new_list: []
    };
  },
  methods: {
    get_new() {
      var vm = this;
      vm.$http({
        url: "/api/web/get_new",
        method: "get"
      }).then(function(res) {
        console.log(res);
        vm.new_list = res.data.data.data;
        console.log(vm.new_list);
      });
    }
  },
  created() {
    var vm = this;
    vm.get_new();
  }
};
</script>

<style>
.new-component {
  height: 100%;
  width: 100%;
}

.new-table{
  height:100%;
  width:100%;
}
</style>