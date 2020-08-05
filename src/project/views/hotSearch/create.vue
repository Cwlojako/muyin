<template>
  <el-dialog
    title="热搜词"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="关键词" prop="name">
        <el-input v-model="formValidate.name" placeholder="请输入关键词"></el-input>
      </el-form-item>
      <el-form-item label="排序数值" prop="position">
        <el-input-number v-model="formValidate.position" placeholder="请输入排序数值"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm('formValidate')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import emitter from '@/framework/mixins/emitter'
  import {save} from '@/project/service/hotword'

  export default {
    mixins: [emitter],
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
          name: [{required: true, message: "关键词不能为空", trigger: "blur"}],
          position: [{required: true, message: "排序数值不能为空", trigger: "change"}]
        },
        model:'hotword',
        formValidate: {
          name: '',
          position: 0
        }
      }
    },
    methods: {
      handleClose() {
        this.$refs.formValidate.resetFields();
        this.$emit('on-dialog-close');
      },

      handleConfirm(name) {
        this.$refs[name].validate(valid => {
          if (!valid) return false
          save(
            {[this.model]: this.formValidate},
            res => {
              this.$message.success('添加成功')
              this.handleClose()
              this.$emit('onRefreshData')
            })
        })
      }
    }
  }
</script>

<style scoped>
</style>
