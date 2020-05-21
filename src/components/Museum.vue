<template>
  <el-container class="museum-component" v-loading="table_loading">
    <el-header>
      <div class="form-line-box">
        <el-form :inline="true" :model="search_form">
          <el-form-item v-if="have_param">
            <el-button @click="goBack">返回上一页</el-button>
          </el-form-item>
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
            <el-button size="mini" @click="toImageDialog(scope.row)">图片</el-button>
            <el-button size="mini" @click="toExhibition(scope.row)">展览</el-button>
            <el-button size="mini" @click="toEducationActivity( scope.row)">教育活动</el-button>
            <el-button size="mini" @click="toCollection(scope.row)">藏品</el-button>
            <el-button size="mini" @click="toComment(scope.row)">评论</el-button>
            <el-button size="mini" @click="toExplain(scope.row)">讲解</el-button>
            <el-button size="mini" @click="toNew(scope.row)">新闻</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-footer></el-footer>
    <el-dialog title="图片" :visible.sync="imageDialogShow" @close="closeImageDialog">
      <template>
        <el-carousel type="card" height="400px" @change="switchImage">
          <el-carousel-item v-for="image in image_dialog.image_list" :key="image.index">
            <el-image fit="contain" :src="image"></el-image>
          </el-carousel-item>
          <el-carousel-item>
            <el-upload
              class="avatar-uploader"
              name="image_list"
              action="/api/web/upload_image"
              :multiple="true"
              :data="{museum_id:image_dialog.museum_id}"
              :on-success="uploadFileSuccess"
              :on-error="uploadFileError"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-carousel-item>
        </el-carousel>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="deleteImage" :loading="deleteImageLoading">删除</el-button>
        <el-button @click="imageDialogShow = false">返 回</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      have_param: false,

      imageDialogShow: false,

      deleteImageLoading: false,
      table_loading: false,

      image_dialog: {
        index: "",
        upload: false,
        delete: false,
        museum_id: "",
        image_list: [],
        file_list: []
      },

      search_form: {
        name: "",
        museum_id: "",
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
    toComment(row) {
      let vm = this;
      vm.$router.push({
        path: "/index/comment",
        query: { museum_id: row.id }
      });
    },
    toEducationActivity(row) {
      let vm = this;
      vm.$router.push({
        path: "/index/education_activity",
        query: { museum_id: row.id }
      });
    },
    toExhibition(row) {
      let vm = this;
      vm.$router.push({
        path: "/index/exhibition",
        query: { museum_id: row.id }
      });
    },
    toCollection(row) {
      let vm = this;
      vm.$router.push({
        path: "/index/collection",
        query: { museum_id: row.id }
      });
    },
    toNew(row) {
      let vm = this;
      vm.$router.push({
        path: "/index/new",
        query: { museum_id: row.id }
      });
    },
    toExplain(row) {
      let vm = this;
      vm.$router.push({
        path: "/index/explain",
        query: { museum_id: row.id }
      });
    },
    goBack() {
      this.$router.back();
    },
    toImageDialog(row) {
      let vm = this;
      vm.image_dialog.index = 0;
      vm.image_dialog.image_list = [];
      vm.image_dialog.file_list = [];
      vm.image_dialog.delete = false;
      vm.image_dialog.upload = false;
      row.image_list.forEach(file => {
        vm.image_dialog.image_list.push(`http://192.144.239.176:8080/${file}`);
        vm.image_dialog.file_list.push(file);
      });
      vm.image_dialog.museum_id = row.id;
      vm.imageDialogShow = true;
    },
    switchImage(index) {
      let vm = this;
      vm.image_dialog.index = index;
    },
    uploadFileSuccess(res) {
      let vm = this;
      if (res.status == 1) {
        //上传文件成功了
        vm.image_dialog.upload = true;
        vm.imageDialogShow = false;
        vm.$message({
          message: res.data.msg,
          center: true
        });
      } else {
        //上传文件失败了
        vm.$message({
          message: res.error_des,
          center: true
        });
      }
    },
    uploadFileError(err) {
      let vm = this;
      console.error(err);
      vm.$message({
        message: "请求失败，请重试",
        center: true
      });
    },
    deleteImage() {
      let vm = this;
      //检查index
      if (vm.image_dialog.index >= vm.image_dialog.file_list.length) {
        return vm.$message({
          message: "请选择图片",
          center: true
        });
      }

      vm.deleteImageLoading = true;
      vm.$http({
        url: "/api/web/del_image",
        method: "post",
        data: {
          file: vm.image_dialog.file_list[vm.image_dialog.index]
        }
      })
        .then(res => {
          console.log(res);
          vm.deleteImageLoading = false;
          if (res.data.status == 1) {
            vm.image_dialog.delete = true;
            vm.$message({
              message: res.data.data.msg,
              center: true
            });
            vm.image_dialog.image_list.splice(vm.image_dialog.index, 1);
            vm.image_dialog.file_list.splice(vm.image_dialog.index, 1);
            vm.image_dialog.index = 0;
          } else {
            vm.$message({
              message: res.data.error_des,
              center: true
            });
          }
        })
        .catch(err => {
          vm.deleteImageLoading = false;
          console.error(err);
          vm.message({
            message: "请求失败,请重试",
            center: true
          });
        });
    },
    closeImageDialog() {
      let vm = this;
      if (vm.image_dialog.upload || vm.image_dialog.delete) {
        vm.get_museum();
      }
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
  }
};
</script>

<style>
.museum-component .form-line-box {
  text-align: center;
  padding-top: 10px;
}
.museum-component .form-line-box .el-form-item {
  padding: 10px;
}
.museum-component .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: gray;
}
.museum-component .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.museum-component .avatar-uploader-icon {
  font-size: 50px;
  color: black;
  width: 400px;
  height: 400px;
  line-height: 400px;
  text-align: center;
}
.museum-component .avatar {
  width: 400px;
  height: 400px;
  display: block;
}
</style>