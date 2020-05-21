<template>
  <div class="education-activity-component">
    <el-container v-loading="table_loading">
      <el-header>
        <div class="form-line-box">
          <el-form :inline="true" :model="search_form">
            <el-form-item v-if="have_param">
              <el-button @click="goBack">返回上一页</el-button>
            </el-form-item>
            <el-form-item label="教育活动名称">
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
          :data="education_activity_list"
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
                <div v-if="props.row.start_time">
                  <el-form-item label="开始时间">
                    <span>{{props.row.start_time}}</span>
                  </el-form-item>
                </div>
                <div v-if="props.row.end_time">
                  <el-form-item label="结束时间">
                    <span>{{props.row.end_time}}</span>
                  </el-form-item>
                </div>
                <div v-if="props.row.time">
                  <el-form-item label="活动时间">
                    <span>{{props.row.time}}</span>
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column label="教育活动ID" prop="id" width="120" :sortable="true"></el-table-column>
          <el-table-column label="教育活动名称" prop="name" width="300" :sortable="true"></el-table-column>
          <el-table-column label="教育活动时间" prop="time" width="300" :sortable="true">
            <template slot-scope="props">
              <span v-if="props.row.time">{{props.row.time}}</span>
              <span v-else>未获取到数据</span>
            </template>
          </el-table-column>
          <el-table-column label="所属博物馆" width="250" prop="museum_name" :sortable="true"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="toImageDialog(scope.row)">查看图片</el-button>
              <el-button size="mini" @click="toMuseum(scope.row)">查看博物馆</el-button>
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
              :total="education_activity_num"
              layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>
      </el-footer>
    </el-container>
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
              :data="{education_activity_id:image_dialog.education_activity_id}"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      have_param: false,

      imageDialogShow: false,

      deleteImageLoading: false,
      table_loading: false,

      museum_list: [],

      education_activity_num: 0,
      education_activity_list: [],

      image_dialog: {
        index: "",
        upload: false,
        delete: false,
        education_activity_id: "",
        image_list: [],
        file_list: []
      },

      search_form: {
        museum_id: "",
        education_activity_id: "",

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
    get_education_activity() {
      let vm = this;
      vm.table_loading = true;
      let baseurl = "/api/web/get_education_activity?";
      for (let key in vm.search_form) {
        if (vm.search_form[key] != "") {
          baseurl += key + "=" + vm.search_form[key] + "&";
        }
      }
      vm.$http
        .get(baseurl)
        .then(res => {
          if (res.data.status == 1) {
            vm.education_activity_list = res.data.data.education_activity_list;
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
    get_education_activity_num() {
      let vm = this;
      let baseurl = "/api/web/get_education_activity_num?";
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
            vm.education_activity_num = res.data.data.education_activity_num;
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
      vm.get_education_activity();
    },
    pageChange(page) {
      let vm = this;
      vm.search_form.page = page;
      vm.get_education_activity();
    },
    search() {
      let vm = this;
      vm.get_education_activity();
      vm.get_education_activity_num();
    },
    toMuseum(row) {
      this.$router.push({
        path: "/index/museum",
        query: {
          museum_id: row.museum_id
        }
      });
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
      vm.image_dialog.education_activity_id = row.id;
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
        vm.get_education_activity();
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
    vm.search();
  }
};
</script>

<style >
.education-activity-component .form-line-box {
  text-align: center;
  padding-top: 10px;
}
.education-activity-component .form-line-box .el-form-item {
  padding: 10px;
}
.education-activity-component .page-box {
  text-align: center;
}

.education-activity-component .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: gray;
}
.education-activity-component .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.education-activity-component .avatar-uploader-icon {
  font-size: 50px;
  color: black;
  width: 400px;
  height: 400px;
  line-height: 400px;
  text-align: center;
}
.education-activity-component .avatar {
  width: 400px;
  height: 400px;
  display: block;
}
</style>