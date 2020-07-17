<template>
  <el-dialog
    title="基本信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="喂养阶段名称" prop="name">
        <el-input v-model="formValidate.name" placeholder="请输入喂养阶段名称"></el-input>
      </el-form-item>
      <el-form-item label="初始年龄" prop="age">
        <el-input v-model="formValidate.age" placeholder="请输入该阶段的初始年龄"></el-input>
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
          phone: [
            {required: true, message: "手机号不能为空", trigger: "blur"}
          ],
          nickname: [
            {required: true, message: "昵称不能为空", trigger: "blur"}
          ]
        },
        model:'manager',
        formValidate: {
          status: '启用',
          nickname: '',
          phone: ''
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
        console.log(fileList)
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
