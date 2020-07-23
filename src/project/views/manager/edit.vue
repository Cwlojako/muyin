<template>
  <el-dialog
    title="编辑信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="50%"
    :before-close="handleClose">

    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="formValidate.username" placeholder="输入账号"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realname">
        <el-input v-model="formValidate.realname" placeholder="输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <transition name='opacity'>
          <upload
            @on-transport-file-list="handleTransportFileList"
            :file-list="formValidate.avatar ? formValidate.avatar.split(';') : []"
            :max-size="5120"
            :limit="1"
            v-if='isFinished'
          >
          </upload>
        </transition>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formValidate.phone" placeholder="输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formValidate.email" placeholder="输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input v-model="formValidate.comment" placeholder="输入备注"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleConfirm('formValidate')">确 定</el-button>
      <el-button type="info" @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Upload from "@/framework/components/upload";
  import {get,update} from '@/project/service/manager'
  import emitter from "@/framework/mixins/emitter"
  export default {
    mixins:[emitter],
    components: {
      Upload
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      editId: {
        type: [Number,String],
        default: 0
      }
    },
    data() {
      return {
        model: 'manager',
        formValidate: {},
        ruleValidate: {
          username: [
            {required: true, message: "账号不能为空", trigger: "blur"}
          ],
          realname: [
            {required: true, message: "姓名不能为空", trigger: "blur"}
          ],
          phone: [
            {required: true, message: "手机号不能为空", trigger: "blur"}
          ],
          email: [
            {required: true, message: "邮箱不能为空", trigger: "blur"},
            {type: "email", message: "邮箱格式不对", trigger: "blur"}
          ],
        },
        isFinished: false
      }
    },
    watch: {
      // 监听editId的变化，如果发生变化则获取对应id的数据
      dialogVisible(val) {
        if (val) {
          this.get(this.editId);
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('on-dialog-close');
        this.isFinished = false
      },
      handleConfirm(name) {
        //指向广播 this.broadcast为混入的方法
        this.broadcast("SiUpload", "on-form-submit", () => {});
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (!valid) return false
            update({[this.model]: this.formValidate}, res => {
              this.$message.success('修改成功');
              this.handleClose()
              this.$emit('onRefreshData');
            })
          })
        })
      },
      //接收文件列表
      handleTransportFileList(fileList) {
        this.formValidate.avatar = fileList[0].response.data;
      },
      get(id) {
        get({id: id}, res => {
          this.formValidate = res;
          if (res.avatar) {
            this.isFinished = true
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
