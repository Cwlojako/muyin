<template>
  <el-dialog
    title="帮助中心添加文章"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="文章名字" prop="title">
        <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="排序数字" prop="position">
        <el-input-number v-model="formValidate.position"></el-input-number>      </el-form-item>
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
  import { save } from '@/project/service/page' //接口

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
      const validateContent = (rule, value, callback) => {
        if (this.formValidate.content === '') {
          callback("文章内容不能为空");
        } else {
          callback();
        }
      }
      return {
        formValidate: {
          label: 'help',
          content: '',
          title: '',
          position: 0
        },
        ruleValidate: {
          title: [{required: true, message: '文章标题不能为空', trigger: 'blur'}],
          position: [{required: true, message: '文章位置不能为空', trigger: 'blur'}],
          content: [{validator: validateContent}],
        },
        model: 'page'
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
          this.$refs[name].validate(valid => {
          if (!valid) return false
          save({[this.model]: this.formValidate},res => {
            this.$message.success('添加成功')
            this.handleClose()
            this.$emit('onRefreshData')
          })
        });
      }
    }
  }
</script>

<style scoped>

</style>
