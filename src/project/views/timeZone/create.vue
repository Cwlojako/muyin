<template>
  <el-dialog
    title="时区信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="时区名称" prop="name">
        <el-input v-model="formValidate.name" placeholder="输入时区名称"></el-input>
      </el-form-item>
      <el-form-item label="系统时差" prop="delta">
        <el-input v-model="formValidate.delta" placeholder="输入系统时差"></el-input>&nbsp;h
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { save } from '@/project/service/timezone'

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
            {required: true, message: "时区名称不能为空", trigger: "blur"}
          ],
          delta: [
            {required: true, message: "系统时差不能为空", trigger: "blur"}
          ]
        },
        formValidate: {
          name: '',
          delta: ''
        }
      }
    },
    methods: {
      handleClose() {
        this.$refs.formValidate.resetFields();
        this.$emit('on-dialog-close');
      },
      // 确认新增
      handleConfirm() {
        this.$refs.formValidate.validate(valid => {
          if (!valid) return false
          save({timezone: this.formValidate}, res => {
            this.handleClose()
            this.$message({
              type: 'success',
              messgae: '新增时区成功'
            })
            this.$emit('refreshData')
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
