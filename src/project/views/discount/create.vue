<template>
  <el-dialog
    title="添加优惠券"
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

</style>
