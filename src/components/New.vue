<template>
  <div class="new-component">
    <div class="form-line-box">
      <el-form :inline="true" :model="search_form">
        <el-form-item label="标题">
          <el-input v-model="search_form.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="博物馆">
          <el-select v-model="search_form.museum_id" placeholder="博物馆">
            <el-option label="全部" value></el-option>
            <el-option label="故宫博物馆" value="1"></el-option>
            <el-option label="谢奇博物馆" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新闻类型">
          <el-select v-model="search_form.tag" placeholder="新闻类型">
            <el-option label="全部" value></el-option>
            <el-option label="正面新闻" value="1"></el-option>
            <el-option label="负面新闻" value="0"></el-option>
            <el-option label="中性新闻" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="new_list"
        border
        style="width: 100%"
        :default-sort="{prop: 'new_id', order: 'descending'}"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="描述">
                <span>{{props.row.description}}</span>
              </el-form-item>

              <el-form-item label="内容">
                <span>{{props.row.content}}</span>
              </el-form-item>

              <el-form-item label="新闻连接">
                <span>{{props.row.url}}</span>
              </el-form-item>

              <el-form-item label="分类">
                <span v-if="props.row.tag == '1'">正面新闻</span>
                <span v-if="props.row.tag == '2'">中性新闻</span>
                <span v-if="props.row.tag == '0'">负面新闻</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="new_id" label="新闻ID" width="80" sortable></el-table-column>
        <el-table-column prop="title" label="标题" width="500" sortable></el-table-column>
        <el-table-column prop="author" label="作者" sortable></el-table-column>
        <el-table-column prop="time" label="时间" sortable></el-table-column>
        <el-table-column prop="museum_name" label="相关博物馆" sortable></el-table-column>
        <!-- <el-table-column align="right">
          <template slot="header" >
            <span>操作</span>
          </template>
          <template >
            <el-button size="mini" @click="click">修改</el-button>
            <el-button size="mini" @click="click">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>

    <div>
      <div class="block">
        <span class="demonstration">完整功能</span>
        <el-pagination
          @size-change="ppnChange"
          @current-change="pageChange"
          :current-page="search_form.page"
          :page-sizes="[10,20,50,100,200,400]"
          :page-size="search_form.ppn"
          :total="new_num"
          :hide-on-single-page="true"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search_form: {
        page: 1,
        ppn: 10,
        museum_id: "",
        new_id: "",
        title: "",
        tag: ""
      },
      new_list: [],
      new_num: 0
    };
  },
  computed: {},
  methods: {
    get_museum() {
      //请求博物馆列表
    },
    get_new() {
      let vm = this;

      let baseurl = "/api/web/get_new?";
      for (let key in vm.search_form) {
        if (vm.search_form[key] != "") {
          baseurl += key + "=" + vm.search_form[key] + "&";
        }
      }

      vm.$http
        .get(baseurl)
        .then(function(res) {
          vm.new_list = res.data.data.new_list;
        })
        .catch(function(err) {
          console.error(err);
        });
    },
    get_new_num() {
      let vm = this;

      let baseurl = "/api/web/get_new_num?";
      for (let key in vm.search_form) {
        if (vm.search_form[key] != "") {
          baseurl += key + "=" + vm.search_form[key] + "&";
        }
      }

      vm.$http
        .get(baseurl)
        .then(function(res) {
          vm.new_num = res.data.data.new_num;
        })
        .catch(function(err) {
          console.error(err);
        });
    },
    search() {
      let vm = this;
      vm.get_new();
      vm.get_new_num();
    },
    ppnChange(ppn) {
      let vm = this;
      vm.search_form.ppn = ppn;
      vm.search_form.page = 1;
      vm.get_new();
    },
    pageChange(page) {
      let vm = this;
      vm.search_form.page = page;
      vm.get_new();
    }
  },

  //生命周期函数
  created() {
    var vm = this;
    vm.get_new();
    vm.get_new_num();
  }
};
</script>

<style>
.new-component {
  height: 100%;
  width: 100%;
}

.new-table {
  height: 100%;
  width: 100%;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>