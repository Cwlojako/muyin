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
      <el-form-item label="初始年龄" prop="days">
        <el-input v-model="formValidate.days" placeholder="请输入该阶段的初始年龄"></el-input>&nbsp;天
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { save } from '@/project/service/stage'

  export default {
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
          name: [
            {required: true, message: "阶段名称不能为空", trigger: "blur"}
          ],
          days: [
            {required: true, message: "初始年龄不能为空", trigger: "blur"}
          ]
        },
        model:'stage',
        formValidate: {
          name: '',
          days: ''
        }
      }
    },
    methods: {
      handleClose() {
        this.$refs.formValidate.resetFields();
        this.$emit('on-dialog-close');
      },
      handleConfirm() {
        this.$refs.formValidate.validate(valid => {
          if (!valid) return false
          if (valid) {
            save(
              {[this.model]: this.formValidate},
              res => {
                this.$message.success('添加成功');
                this.handleClose();
                this.$emit('refreshData');
              })
          }
        })
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
