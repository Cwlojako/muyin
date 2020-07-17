<template>
  <el-dialog
    title="基本信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="状态" prop="status">
        <el-select v-model="formValidate.status" placeholder="请选择" @change="changeType">
          <el-option value="1" label="启用"></el-option>
          <el-option value="2" label="禁用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上级分类" prop="parentCate">
        <span>顶级分类</span>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formValidate.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="排序数值" prop="order">
        <el-input-number v-model="formValidate.order" placeholder="请输入排序数值"></el-input-number>
      </el-form-item>
      <el-form-item label="分类图" prop="avatar">
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
  import {save} from '@/project/service/manager'

  export default {
    name: "createDialog",
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
          status: [
            {required: true, message: "请选择状态", trigger: "blur"}
          ],
          name: [
            {required: true, message: "名称不能为空", trigger: "blur"}
          ],
          order: [
            {required: true, message: "排序数值不能为空", trigger: "blur"}
          ]
        },
        model:'goodsCategory',
        formValidate: {
          status: '',
          name: '',
          order: '',
          avatar: ''
        }
      }
    },
    computed: {},
    methods: {
      changeType() {},
      handleClose() {
        this.$refs.formValidate.resetFields();
        this.$emit('on-dialog-close');
      },

      handleConfirm(name) {
        // 通知上传子组件执行相应的操作
        this.broadcast('SiUpload', 'on-form-submit', () => {});
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (valid) {
              save(
                {[this.model]:this.formValidate},
                res => {
                  this.$message.success('添加成功');
                  this.$refs.formValidate.resetFields();
                  this.$emit('on-save-success');
                })
            }
          })
        });
      },

      handleTransportFileList(fileList) {
        this.formValidate.avatar = fileList[0].response.data;
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
