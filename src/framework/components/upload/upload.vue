<template>
   <div>
     <div class="upload" v-if="type === 'img'">
       <el-upload
         ref="upload"
         :action="action"
         list-type="picture-card"
         :file-list="defaultList"
         :limit="limit"
         :multiple="multiple"
         :on-preview="handlePictureCardPreview"
         :on-remove="handleRemove"
         :on-success="handleSuccess"
         :on-exceed="handleExceed"
         :beforeUpload="onBeforeUpload"
       >
         <i class="el-icon-plus"></i>
       </el-upload>
       <el-dialog title="查看图片" :visible.sync="dialogVisible" :modal-append-to-body='false'>
         <img width="100%" :src="dialogImageUrl" alt="">
       </el-dialog>
     </div>

     <div class="upload-file" v-if="type === 'file'">
       <el-upload
         class="upload-demo"
         drag
         :limit="limit"
         :file-list="defaultList"
         :action="action"
         :multiple="multiple"
         :on-remove="handleRemove"
         :on-success="handleSuccess"
         :on-exceed="handleExceed"
         :beforeUpload="onBeforeUpload"
         >
         <i class="el-icon-upload"></i>
         <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
       </el-upload>
     </div>
      <el-upload v-if="type === 'video'"
        class="upload-demo"
        :action="action"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        multiple
        :limit="limit"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>

      <el-upload v-if="type === 'audio'"
        class="upload-demo"
        :action="action"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        multiple
        :limit="limit"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
   </div>
</template>

<script>

export default {
  name: "SiUpload",
  props:{
    //组件类型
    type: {
      type: String,
      default: 'img'
    },
    //文件列表
    fileList: {
      type: Array,
      default(){
        return []
      }
    },
    //限制数量
    limit: {
      type: Number,
      default: 1
    },
    //上传大小,单位为kb
    maxSize: {
      type: Number,
      default: 51200
    },
    //接收类型
    accept: {
      type: String,
      default: 'jpg/png/gif/jpeg/mp4/mp3'
    },
    //拼接前缀
    prefix: {
      type: String,
      default: 'http://8.129.170.69/attachment/'
    },
    //多选
    multiple: {
      type: Boolean,
      default: false
    },
    //上传接口路径
    action: {
      type: String,
      default: 'api/attachment/upload'
    }
  },
  data(){
     return{
       dialogImageUrl: '',
       dialogVisible: false,
       defaultList:[],
       imageUrl: ''
     }
  },
  created() {
    if (this.fileList.length > 0) {
      this.defaultList = this.fileList.map((s,i) => {
        if (s){
          let obj = {
            name: s,
            url: this.prefix + s,
            response:{
              data: s
            }
          };
          return obj;
        }
      });
    }
    this.$on("on-form-submit", () => {
      this.$emit("on-transport-file-list", this.defaultList);
    });
    // 关闭弹框时删除图片预览
    this.$on("on-close", () => {
      this.defaultList = []
    });
  },
  methods: {
    handleRemove(file, fileList) {
      this.defaultList = JSON.parse(JSON.stringify(fileList));
    },
    handlePreview(file) {
      console.log(file);
    },
    // 上传成功
    handleSuccess(res,file,fileList) {
      // this.defaultList.push(file);
      // 深拷贝
      this.defaultList = JSON.parse(JSON.stringify(fileList));
    },

    // 预览图片
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    
    handleExceed(file,fileList) {
      console.log(file,fileList);
      this.$notify({
        title: '警告',
        message: `最多只能上传${this.limit}个文件`,
        type: 'warning'
      });
    },

    onBeforeUpload(file) {
      // 获取后缀名
      const suffix = file.name.substring(file.name.lastIndexOf('.')+1)
      // 判断是否符合文件大小的限制需求
      const isLt2M = file.size / 1024  <  this.maxSize;
      // 判断是否符合文件类型需求
      const isLtType = this.accept.indexOf(suffix) >= 0
      if (!isLtType) {
        this.$message({
          message: `上传文件格式必须为${this.accept}`,
          type: 'warning'
        });
      }
      if(!isLt2M) {
        this.$message({
          message: `上传文件大小不能超过${this.maxSize}KB!`,
          type: 'warning'
        });
      }
      return isLt2M && isLtType;
    }
  }

}
</script>

<style scoped>
  .upload /deep/ .el-upload-list__item{
    width: 100px;
    height: 100px;
  }
  .upload /deep/ .el-upload--picture-card{
    width: 100px;
    height: 100px;
    line-height: 106px;
  }
</style>
