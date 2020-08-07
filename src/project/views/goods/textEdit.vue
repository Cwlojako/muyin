<template>
  <el-dialog
    title="图文信息编辑"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="图文详情" prop="description">
        <Editor :defaultContent="formValidate.description" @on-change-content="onChangeEditor"/>
      </el-form-item>
    </el-form>
    <!--    </div>-->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm('formValidate')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Editor from "@/framework/components/editor"
  import Emitter from '@/framework/mixins/emitter'
  import { update, findById } from '@/project/service/product'

  export default {
    mixins: [Emitter],
    components: {
      Editor
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      id: {
        type: [Number,String],
        default: 0
      },
      description: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        formValidate: {
          description: ''
        },
        ruleValidate: {
          description: [{required: true, message: '不能为空', trigger: 'blur'}],
        }
      }
    },
    methods: {
      onChangeEditor(val){
        this.formValidate.description = val.html;
      },
      handleClose() {
        this.$emit('on-dialog-close');
      },
      handleConfirm(name) {
        this.$refs[name].validate(valid => {
          if (!valid) return false
          let param = Object.assign({id: this.id}, this.formValidate)
          update({product: param}, res => {
            this.$message.success('更新编辑成功')
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
