<template>
  <el-dialog
    title="帮助中心编辑文章"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="文章位置" prop="position" >
        <el-input v-model="formValidate.position" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="文章名称" prop="title">
        <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="图文详情" prop="content">
        <Editor :defaultContent="formValidate.content" @on-change-content="onChangeEditor"/>
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
  import { get, update } from '@/project/service/page'
  import Emitter from '@/framework/mixins/emitter'

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
      editId: {
        type: [Number, String],
        default: 0,
      }
    },
    data() {
      const validateContent = (rule, value, callback) => {
        if (this.formValidate.content === '') {
          callback("文章内容不能为空");
        } else {
          callback();
        }
      }
      return {
        formValidate: {
          position: null,
          title: '',
          content: ''
        },
        ruleValidate: {
          position: [{required: true, message: '文章位置数值不能为空', trigger: 'blur'}],
          title: [{required: true, message: '文章标题不能为空', trigger: 'blur'}],
          content: [{validator: validateContent}]
        }
      }
    },
    methods: {
      onChangeEditor(val){
        this.formValidate.content = val.html
      },
      handleClose() {
        this.$emit('on-dialog-close')
      },
      handleConfirm(name) {
        this.$refs[name].validate(valid => {
          if (!valid) return false
          update({page: this.formValidate}, res => {
            this.$message.success('修改成功')
            this.handleClose()
            this.$emit('onRefreshData')
          })
        })
      },
      findById() {
        if (this.editId) {
          get({id: this.editId},res => {
            this.formValidate = res;
          })
        }
      },
    },
    watch: {
      dialogVisible(val) {
        if (val) {
          this.findById()
        }
      }
    }
  }
</script>

<style scoped>

</style>
