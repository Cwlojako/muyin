<template>
  <el-dialog
    title="论坛中心编辑文章"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="cover">
        <transition name='opacity'>
          <upload
            @on-transport-file-list="handleTransportCover"
            :file-list="formValidate.cover ? formValidate.cover.split(';') : []"
            :max-size="5120"
            :limit="1"
            v-if='isCoverFinished'>
          </upload>
        </transition>
        <span class="upload-tip">*建议上传图片尺寸200*200，上传本地图片，最多1张</span>
      </el-form-item>
      <el-form-item label="正文" prop="content">
        <el-input type="textarea" v-model="formValidate.content"></el-input>
      </el-form-item>
      <el-form-item label="正文图片" prop="images">
        <transition name='opacity'>
          <upload
            @on-transport-file-list="handleTransportImages"
            :file-list="formValidate.images ? formValidate.images.split(';') : []"
            :max-size="5120"
            :limit="9"
            v-if='isImagesFinished'>
          </upload>
        </transition>
        <span class="upload-tip">*建议上传图片尺寸200*200，上传本地图片，最多7张</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Upload from "@/framework/components/upload";
  import {get, update} from '@/project/service/post'
  import Emitter from '@/framework/mixins/emitter'

  export default {
    mixins: [Emitter],
    components: {
      Upload
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      editId: {
        type: [String, Number],
        default: 0,
      }
    },
    data() {
      const validateCover = (rule, value, callback) => {
        if (this.formValidate.cover === '') {
          callback("封面不能为空");
        } else {
          callback();
        }
      }
      return {
        formValidate: {
          title: '',
          cover: '',
          content: '',
          images: ''
        },
        ruleValidate: {
          title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
          content: [{required: true, message: '内容不能为空', trigger: 'blur'}],
          cover: [{validator: validateCover, trigger: 'blur'}]
        },
        isCoverFinished: false,
        isImagesFinished: false
      }
    },
    methods: {
      handleClose() {
        this.$emit('on-dialog-close');
        this.isCoverFinished = false
        this.isImagesFinished = false
      },
      handleConfirm() {
        this.broadcast('SiUpload', 'on-form-submit', () => {});
        this.$nextTick(() => {
          this.$refs.formValidate.validate(valid => {
            if (!valid) return false
            update({post: this.formValidate}, res => {
              this.$message({
                type: 'success',
                message: '编辑成功'
              });
              this.$emit('onRefreshData');
              this.handleClose()
            })
          })
        })
      },
      handleTransportCover(fileList) {
        if (fileList.length === 0) {
          this.formValidate.cover = ''
        } else {
          this.formValidate.cover = fileList[0].response.data
        }
      },
      handleTransportImages(fileList) {
        let imageArr = []
        for(let i = 0; i < fileList.length; i++) {
          imageArr.push(fileList[i].response.data)
        }
        this.formValidate.images = imageArr.join(';')
      },
      findById() {
        if (this.editId) {
          get({id: this.editId}, res => {
            this.formValidate = res;
            this.isCoverFinished = true
            this.isImagesFinished = true
          })
        }
      },
    },
    watch: {
      dialogVisible(val) {
        if(val){
          this.findById()
        }
      }
    },
    created() {
      this.findById()
    }
  }
</script>

<style scoped>
.upload-tip {
  color: #ccc;
  font-size: 12px;
}
</style>
