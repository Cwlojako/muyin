<template>
  <el-dialog
    title="编辑积分规则"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="50%"
    :before-close="handleClose">

    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="160px">
      <el-form-item label="单次分享资讯获赠积分" prop="zxPoint">
        <el-input v-model="formValidate.zxPoint" placeholder="输入赠送积分数额"></el-input>
      </el-form-item>
      <el-form-item label="资讯分享每日奖励上限" prop="zxLimit">
        <el-input v-model="formValidate.zxLimit" placeholder="输入每日上限次数"></el-input>&nbsp;次
      </el-form-item>
      <el-form-item label="单次分享商品获赠积分" prop="fxPoint">
        <el-input v-model="formValidate.fxPoint" placeholder="输入赠送积分数额"></el-input>
      </el-form-item>
      <el-form-item label="商品分享每日奖励上限" prop="fxLimit">
        <el-input v-model="formValidate.fxLimit" placeholder="输入每日上限次数"></el-input>&nbsp;次
      </el-form-item>
      <el-form-item label="单次订单评价获赠积分" prop="ddPoint">
        <el-input v-model="formValidate.ddPoint" placeholder="输入赠送积分数额"></el-input>
      </el-form-item>
      <el-form-item label="购物赠送积分比例" prop="percent">
        <el-input v-model="formValidate.percent" placeholder="输入赠送积分比例"></el-input>&nbsp;%
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
    name: "ponitRuleEdit",
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
