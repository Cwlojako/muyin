<template>
  <el-dialog
    title="商品分类编辑"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="状态" prop="brand">
        <el-select v-model="formValidate.status" placeholder="请选择" @change="changeType">
          <el-option value="1" label="启用"></el-option>
          <el-option value="2" label="禁用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上级分类" prop="parentCate">
        <span>顶级分类</span>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formValidate.username" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="排序数值" prop="order">
        <el-input-number v-model="formValidate.id" placeholder="请输入排序数值"></el-input-number>
      </el-form-item>
      <el-form-item label="分类图" prop="image">
        <upload
          @on-transport-file-list="handleTransportFileList"
          :file-list="formValidate.avatar ? formValidate.avatar.split(';') : []"
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
  import Editor from "@/framework/components/editor"
  import {get,update} from '@/project/service/manager'
  import Emitter from '@/framework/mixins/emitter'

  export default {
    mixins: [Emitter],
    name: "goodsCategoryEdit",
    components: {
      Upload, Editor
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
        formValidate: {},
        ruleValidate: {
          username: [{required: true, message: '不能为空', trigger: 'blur'}],
          image: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    methods: {
      changeType() {},
      handleClose() {
        // this.visible = false;
        this.$emit('on-dialog-close');
      },
      handleConfirm(name) {
        this.broadcast("SiUpload", "on-form-submit", () => {});
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (valid) {
              update({page: this.formValidate}, res => {
                this.$notify.success('修改成功');
                this.$emit('on-save-success');
              })
            }
          })
        })
      },
      handleTransportFileList(fileList) {
        this.formValidate.image = fileList[0].response.data;
      },
      findById() {
        if (this.id) {
          get({id:this.id},res => {
            console.log(res)
            this.formValidate = res;
          })
        }
      },
    },
    watch: {
      dialogVisible(e) {
        if (e) {
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
