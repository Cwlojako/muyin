<template>
  <el-dialog
    title="基本信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <Editor :defaultContent="formValidate.content" @on-change-content="onChangeEditor"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm('formValidate')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Editor from "@/framework/components/editor"
  import { save } from '@/project/service/article'

  export default {
    components: {
      Editor
    },
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
          title: '',
          content: ''
        },
        ruleValidate: {
          title: [{required: true, message: '标题不能为空', trigger: 'blur'}]
        },
        model:'article'
      }
    },
    methods: {
      onChangeEditor(val){
        this.formValidate.content = val.html;
      },
      handleClose() {
        this.$emit('on-dialog-close');
      },
      handleConfirm(name) {
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (!valid) return false
            save({[this.model]: this.formValidate},res => {
              this.$message.success('添加成功');
              this.$emit('on-save-success');
            })
          })
        });
      }
    }
  }
</script>

<style scoped>

</style>
