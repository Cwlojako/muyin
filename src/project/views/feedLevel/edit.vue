<template>
  <el-dialog
    title="喂养阶段编辑"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="喂养阶段名称" prop="name">
        <el-input v-model="formValidate.username" placeholder="请输入喂养阶段名称"></el-input>
      </el-form-item>
      <el-form-item label="初始年龄" prop="age">
        <el-input v-model="formValidate.id" placeholder="请输入该阶段的初始年龄"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Upload from "@/framework/components/upload";
  import Editor from "@/framework/components/editor"
  import {get,update} from '@/project/service/manager'
  import Emitter from '@/framework/mixins/emitter'

  export default {
    mixins: [Emitter],
    name: "feedLevelEdit",
    components: {
      Upload,Editor
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
        formValidate: {},
        ruleValidate: {
          username: [{required: true, message: '不能为空', trigger: 'blur'}],
          id: [{required: true, message: '不能为空', trigger: 'blur'}],
        },

      }
    },
    methods: {
      handleClose() {
        this.$refs.formValidate.resetFields()
        this.$emit('on-dialog-close');
      },
      handleConfirm() {
        update({page: this.formValidate}, res => {
          this.$notify.success('修改成功');
          this.$emit('on-save-success');
        })
      },
      findById() {
        if (this.id) {
          get({id:this.id},res => {
            this.formValidate = res;
          })
        }
      },
    },
    watch: {
      dialogVisible(e) {
        if(e){
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
