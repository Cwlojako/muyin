<template>
  <el-dialog
    title="品牌编辑"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="状态">
        <el-radio-group v-model="formValidate.enabled">a
          <el-radio label="启用" value='启用'></el-radio>
          <el-radio label="禁用" value='禁用'></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formValidate.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="排序数值" prop="position">
        <el-input-number v-model="formValidate.position" placeholder="请输入排序数值"></el-input-number>
      </el-form-item>
      <el-form-item label="品牌logo" prop="image">
        <transition name='opacity'>
          <upload
            @on-transport-file-list="handleTransportFileList"
            :file-list="formValidate.image ? formValidate.image.split(';') : []"
            :max-size="5120"
            :limit="1"
            v-if='isFinished'
          >
          </upload>
        </transition>
        <span class="upload-tip">*建议上传图片尺寸200*200，上传本地图片，最多1张</span>
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
  import {get,update} from '@/project/service/brand'
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
        type: [Number, String],
        default: 0,
      }
    },
    data() {
      return {
        formValidate: {
          enabled: '启用',
          name: '',
          position: 0,
          image: ''
        },
        ruleValidate: {
          enabled: [{required: true, message: '请选择状态', trigger: 'blur'}],
          name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
          position: [{required: true, message: '排序数值不能为空', trigger: 'blur'}],
        },
        isFinished: false
      }
    },
    methods: {
      handleClose() {
        this.$emit('on-dialog-close')
        this.isFinished = false
      },
      handleConfirm(name) {
        this.broadcast("SiUpload", "on-form-submit", () => {});
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (!valid) return false
            update({brand: this.formValidate}, res => {
              this.$message.success('修改成功');
              this.handleClose()
              this.$emit('onRefreshData');
            })
          })
        })
      },
      handleTransportFileList(fileList) {
        if (fileList.length === 0) { 
          this.formValidate.image = ''
        } else {
          this.formValidate.image = fileList[0].response.data
        }
      },
      findById() {
        if (this.editId) {
          get({id: this.editId},res => {
            this.formValidate = res;
            this.formValidate.enabled =  res.enabled ? '启用' : '禁用'
            this.isFinished = true
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
