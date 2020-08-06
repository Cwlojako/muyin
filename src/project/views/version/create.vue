<template>
  <el-dialog
    title="版本信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    :width="platform === 'iphone' ? '40%' : '50%'"
    :before-close="handleClose">

    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="系统" prop="platform">
        <el-input v-model="platform" disabled></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="number" >
        <el-input v-model="formValidate.number" placeholder="输入版本号"></el-input>
      </el-form-item>
      <el-form-item label="强制更新" prop="optional" >
        <el-select v-model="formValidate.optional" placeholder="请选择">
          <el-option
          v-for="item in options"
          :label="item.label"
          :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本描述" prop="description" >
        <el-input type="textarea" v-model="formValidate.description"></el-input>
      </el-form-item>
      <el-form-item label="下载地址" prop="url" v-if="platform === 'android' || platform === 'androidPanel' ">
        <Upload
          :type="'file'"
          @on-transport-file-list="handleTransportFileList"
          :accept="'apk'"
        ></Upload>
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
  import { save } from '@/project/service/application'
  import emitter from '@/framework/mixins/emitter'
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
      platform: {
        type: String,
        default: '',
      }
    },
    data() {
      const validateUrl = (rule, value, callback) => {
        if (this.formValidate.url === '') {
          callback("请上传安卓端下载地址");
        } else {
          callback();
        }
      }
      return {
        model: 'application',
        formValidate: {
          number: '',
          optional: '',
          description: '',
          url: ''
        },
        ruleValidate: {
          number: [{required: true, message: '不能为空', trigger: 'blur'}],
          optional: [{required: true, message: '请选择', trigger: 'change'}],
          description: [{required: true, message: '不能为空', trigger: 'blur'}],
          url: [{validator: validateUrl}]
        },
        options: [
          {label: '是', value: true},
          {label: '否', value: false}
        ]
      }
    },
    methods: {
      handleClose() {
        this.$emit('on-dialog-close');
      },
      handleConfirm(name) {
        this.formValidate.platform = this.platform
        this.broadcast("SiUpload", "on-form-submit", () => {})
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (!valid) return false
            let param = Object.assign({},this.formValidate)
            // 如果url为空证明是苹果版本
            if (param.url === '') {
              delete param.url
            }
            param.number = parseInt(param.number)
            save({[this.model]: param}, res => {
              this.$message.success('添加成功')
              this.handleClose()
              this.$emit('onRefreshData')
            })
          })
        })
      },
      handleTransportFileList(fileList) {
        console.log(fileList)
        console.log(fileList[0].response.data)
        if (fileList.length > 0) {
          this.formValidate.url = fileList[0].response.data
        }
      }
    }
  }
</script>

<style scoped>

</style>
