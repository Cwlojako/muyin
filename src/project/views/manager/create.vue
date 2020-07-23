<template>
  <el-dialog
    title="基本信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="formValidate.username" placeholder="输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type='password' v-model="formValidate.password" placeholder="输入密码"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realname">
        <el-input v-model="formValidate.realname" placeholder="输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <upload
          @on-transport-file-list="handleTransportFileList"
          :max-size="5120"
          :limit="1"
        >
        </upload>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formValidate.phone" placeholder="输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type='email' v-model="formValidate.email" placeholder="输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input v-model="formValidate.comment" placeholder="输入备注"></el-input>
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
  import { save } from '@/project/service/manager'
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
      }
    },
    data() {
      return {
        // 添加表单校验规则
        ruleValidate: {
          username: [
            {required: true, message: "账号不能为空", trigger: "blur"}
          ],
          password: [
            {required: true, message: "密码不能为空", trigger: "blur"}
          ],
          realname: [
            {required: true, message: "姓名不能为空", trigger: "blur"}
          ],
          phone: [
            {required: true, message: "手机号不能为空", trigger: "blur"}
          ],
          email: [
            {required: true, message: "邮箱不能为空", trigger: "blur"}
          ]
        },
        model: 'manager',
        formValidate: {
          username: '',
          password: '',
          realname: '',
          phone: '',
          email: '',
          comment: ''
        }
      }
    },
    methods: {
      handleClose() {
        this.$refs.formValidate.resetFields();
        this.$emit('on-dialog-close');
      },

      handleConfirm(name) {
        // 通知上传子组件执行相应的操作
        this.broadcast('SiUpload', 'on-form-submit', () => {});
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (!valid) return false
            save(
              {[this.model]: this.formValidate},
              res => {
                this.$message.success('添加成功');
                this.handleClose()
                this.$emit('onRefreshData');
              })
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

</style>
