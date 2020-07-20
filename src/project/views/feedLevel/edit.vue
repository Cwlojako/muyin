<template>
  <el-dialog
    title="喂养阶段编辑"
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
  import { get, update } from '@/project/service/stage'

  export default {
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
        formValidate: {
          name: '',
          days: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: "阶段名称不能为空", trigger: "blur"}
          ],
          days: [
            {required: true, message: "初始年龄不能为空", trigger: "blur"}
          ]
        }
      }
    },
    methods: {
      handleClose() {
        this.$refs.formValidate.resetFields()
        this.$emit('on-dialog-close');
      },
      handleConfirm() {
        this.$refs.formValidate.validate(valid => {
          if (!valid) return false
          update({stage: this.formValidate}, res => {
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.handleClose()
            this.$emit('refreshData');
          })
        })
      },
      findById() {
        if (this.id) {
          get({id: this.id},res => {
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
</style>
