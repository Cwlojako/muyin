<template>
  <el-dialog
    title="基本信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <!--    <div style="overflow: auto;height:40vh;padding: 10px 0 40px;">-->
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <Editor :defaultContent="formValidate.content" @on-change-content="onChangeEditor"/>
      </el-form-item>
    </el-form>
    <!--    </div>-->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Upload from "@/framework/components/upload";
  import Editor from "@/framework/components/editor"
  import {get, update} from '@/project/service/article'
  import Emitter from '@/framework/mixins/emitter'

  export default {
    mixins: [Emitter],
    components: {
      Upload, Editor
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      editId: {
        type: [String, Number],
        default: 0,
      }
    },
    data() {
      return {
        formValidate: {
          title: '',
          content: ''
        },
        ruleValidate: {
          title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
        },
      }
    },
    watch: {
      editId(val) {
        this.findById()
      }
    },
    methods: {
      onChangeEditor(val){
        this.formValidate.content = val.html;
      },
      handleClose() {
        this.$emit('on-dialog-close');
      },
      handleConfirm() {
        this.$refs.formValidate.validate(valid => {
          if (!valid) return false
          update({article: this.formValidate}, res => {
            this.$message.success('修改成功');
            this.$emit('onRefreshData');
            this.handleClose()
          })
        })
      },
      findById() {
        if (this.editId) {
          get({id: this.editId}, res => {
            this.formValidate = res;
          })
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
