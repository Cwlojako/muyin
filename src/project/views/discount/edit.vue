<template>
  <el-dialog
    title="编辑优惠券"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formValidate.name" placeholder="输入优惠券名称"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="formValidate.type" placeholder="请选择优惠券类型">
        <el-option value="1" label="现金券"></el-option>
        <el-option value="2" label="折扣券"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="面额" prop="faceValue">
      <el-input v-model="formValidate.faceValue" placeholder="输入面额"></el-input>&nbsp;元
    </el-form-item>
    <el-form-item label="起用条件" prop="limit">
      <el-input v-model="formValidate.limit" placeholder="输入起用条件"></el-input>&nbsp;元
    </el-form-item>
    <el-form-item label="兑换积分" prop="point">
      <el-input v-model="formValidate.point" placeholder="输入兑换积分"></el-input>
    </el-form-item>
    <el-form-item label="有效时长" prop="effectTime">
      <el-input v-model="formValidate.effectTime" placeholder="输入有效时长"></el-input>&nbsp;天
    </el-form-item>
    <el-form-item label="结束兑换日期" prop="deadline">
      <el-input v-model="formValidate.effectTime" placeholder="输入有效时长"></el-input>
    </el-form-item>
    <el-form-item label="数量" prop="total">
      <el-input v-model="formValidate.total" placeholder="输入该优惠券总量"></el-input>
    </el-form-item>
  </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm('formValidate')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Upload from "@/framework/components/upload";
  import {get,update} from '@/project/service/manager'
  import emitter from "@/framework/mixins/emitter"
  export default {
    name: "edit",
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
        type: Number,
        default: 0
      }
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("登录密码不能为空"));
        } else {
          if (this.formValidate.password !== "") {
            // 对第二个密码框单独验证
            this.$refs.formValidate.validateField("confirmPassword");
          }
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("再次输入你的密码"));
        } else if (value !== this.formValidate.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      };
      const validateFileList = (rule, value, callback) => {
        if (this.formValidate.fileList.length === 0) {
          callback("头像不能为空");
        } else {
          callback();
        }
      };
      return {
        model: 'manager',
        isFinished:false,
        formValidate: {
        },
        ruleValidate: {
          username: [
            {required: true, message: "账号不能为空", trigger: "blur"}
          ],
          password: [
            {required: true, message: "不能为空", trigger: "blur"}
          ],
          avatar: [
            {required: true, message: "头像不能为空" , trigger: "blur"}
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
      }
    },
    computed: {},
    watch: {
      // 监听editId的变化，如果发生变化则获取对应id的数据
      editId(val) {
        this.get(val);
      }
    },
    methods: {
      handleClose() {
        this.$emit('on-dialog-close');
      },
      handleConfirm(name) {
        //指向广播 this.broadcast为混入的方法
        this.broadcast("SiUpload", "on-form-submit", () => {});
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (valid) {
              update({[this.model]: this.formValidate}, res => {
                this.$message.success('修改成功');
                this.$emit('on-save-success');
              })
            }
          })
        })
      },
      //接收文件列表
      handleTransportFileList(fileList) {
        this.formValidate.avatar = fileList[0].response.data;
      },
      get(id) {
        this.isFinished = false;
        get({id: id}, res => {
          this.formValidate = res;
          this.isFinished = true;
        });
      }
    }
  }
</script>

<style scoped>

</style>
