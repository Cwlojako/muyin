<template>
  <el-dialog
    title="基本信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="状态">
        <el-radio-group v-model="formValidate.enabled">
          <el-radio label="启用" value='启用'></el-radio>
          <el-radio label="禁用" value='禁用'></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上级分类">
        <span>顶级分类</span>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formValidate.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="排序数值" prop="position">
        <el-input-number v-model="formValidate.position" placeholder="请输入排序数值"></el-input-number>
      </el-form-item>
      <el-form-item label="分类图" prop="image">
        <upload
          @on-transport-file-list="handleTransportFileList"
          :max-size="5120"
          :limit="1"
        >
        </upload>
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
  import emitter from '@/framework/mixins/emitter'
  import {save} from '@/project/service/category'

  export default {
    mixins: [emitter],
    components: {
      Upload
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        // 添加表单校验规则
        ruleValidate: {
          name: [{required: true, message: "名称不能为空", trigger: "blur"}],
          position: [{required: true, message: "排序数值不能为空", trigger: "blur"}]
        },
        model:'category',
        formValidate: {
          enabled: '启用',
          name: '',
          position: '',
          image: ''
        }
      }
    },
    methods: {
      handleClose() {
        this.$refs.formValidate.resetFields();
        this.$emit('on-dialog-close');
        this.broadcast('SiUpload', 'on-close', () => {});
      },

      handleConfirm(name) {
        // 通知上传子组件执行相应的操作
        this.broadcast('SiUpload', 'on-form-submit', () => {});
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (!valid) return false
            let param = Object.assign({type: 'product'}, this.formValidate)
            param.enabled = this.formValidate.enabled === '启用'
            save(
              {[this.model]: param},
              res => {
                this.$message.success('添加成功');
                this.handleClose()
                this.$emit('onRefreshData');
              })
          })
        });
      },

      handleTransportFileList(fileList) {
        if (fileList.length === 0) {
          this.formValidate.image = ''
        } else {
          this.formValidate.image = fileList[0].response.data
        }
      }
    }
  }
</script>

<style scoped>
  .upload-tip {
    color: #ccc;
    font-size: 12px;
  }
</style>
