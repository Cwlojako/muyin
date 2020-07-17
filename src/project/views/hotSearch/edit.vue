<template>
  <el-dialog
    title="热搜词编辑"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="formValidate.username" placeholder="请输入关键词"></el-input>
      </el-form-item>
      <el-form-item label="排序数值" prop="sort">
        <el-input-number v-model="formValidate.sort" placeholder="请输入排序数值"></el-input-number>
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
  import {get, update} from '@/project/service/manager'
  import Emitter from '@/framework/mixins/emitter'

  export default {
    mixins: [Emitter],
    name: "hotSearchEdit",
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
          name: [{required: true, message: '不能为空', trigger: 'blur'}],
        },

      }
    },
    methods: {
      changeType() {},
      handleClose() {
        this.$emit('on-dialog-close');
      },
      handleConfirm() {
        update({page: this.formValidate}, res => {
          this.$notify.success('修改成功');
          this.$emit('on-save-success');
        })
      },
      findById(val) {
        get({id: val},res => {
          this.formValidate = res;
        })
      },
    },
    watch: {
      id(val) {
        this.findById(val)
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
