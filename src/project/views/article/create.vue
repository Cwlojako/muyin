<template>
  <el-dialog
    title="论坛中心添加文章"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="cover">
        <upload
          @on-transport-file-list="handleTransportCover"
          :max-size="5120"
          :limit="1">
        </upload>
        <span class="upload-tip">*建议上传图片尺寸200*200，上传本地图片，最多1张</span>
      </el-form-item>
      <el-form-item label="正文" prop="content">
        <el-input type="textarea" v-model="formValidate.content"></el-input>
      </el-form-item>
      <el-form-item label="正文图片" prop="images">
        <upload
          @on-transport-file-list="handleTransportImages"
          :max-size="5120"
          :limit="7">
        </upload>
        <span class="upload-tip">*建议上传图片尺寸200*200，上传本地图片，最多7张</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm('formValidate')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Upload from "@/framework/components/upload";
  import emitter from '@/framework/mixins/emitter'
  import { save } from '@/project/service/post'
  export default {
    mixins: [emitter],
    components: {
      Upload
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      id: {
        type: Number,
        default: 0,
      }
    },
    data() {
      return {
        show: false,
        formValidate: {
          title: '',
          cover: '',
          content: '',
          images: ''
        },
        ruleValidate: {
          title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
          content: [{required: true, message: '内容不能为空', trigger: 'blur'}],
        },
        model: 'post'
      }
    },
    methods: {
      handleClose() {
        this.$emit('on-dialog-close');
        this.broadcast('SiUpload', 'on-close', () => {});
      },
      handleConfirm(name) {
        this.broadcast('SiUpload', 'on-form-submit', () => {});
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (!valid) return false
            save({[this.model]: this.formValidate}, res => {
              this.$message.success('添加成功');
              this.handleClose()
              this.$emit('refreshData');
            })
          })
        });

      },
      // 封面图
      handleTransportCover(e) {
        console.log(e)
        this.formValidate.cover = e[0].response.data
      },
      // 正文图片
      handleTransportImages(e) {
        console.log(e)
        if (e.length === 0) {
          this.formValidate.images = e[0].response.data
        } else {
          let imageArr = []
          for (let i = 0; i < e.length; i++) {
            imageArr.push(e[i].response.data)
          }
          this.formValidate.images = imageArr.join(';')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .upload-tip {
    color: #ccc;
    font-size: 12px;
  }
</style>
