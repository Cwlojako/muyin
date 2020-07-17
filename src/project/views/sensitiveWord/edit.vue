<template>
  <el-dialog
    title="热搜词编辑"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="敏感词" prop="keyword">
        <el-input v-model="formValidate.keyword" placeholder="请输入敏感词"></el-input>
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
  import {get,update} from '@/project/service/page'
  import Emitter from '@/framework/mixins/emitter'

  export default {
    mixins: [Emitter],
    name: "edit",
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
        categoryList:[],
        radio: '1',//1是启用的意思
        show: false,

        formValidate: {
        },
        ruleValidate: {
          name: [{required: true, message: '不能为空', trigger: 'blur'}],
        },

      }
    },
    computed: {},
    methods: {
      changeType() {},
      onChangeEditor(val){
        this.formValidate.content = val.html;
      },
      handleClose() {
        // this.visible = false;
        this.$emit('on-dialog-close');
      },
      handleConfirm() {
        update({page: this.formValidate}, res => {
          this.$notify.success('修改成功');
          this.$emit('on-save-success');
        })

      },
      handleTransportFileList(e) {
        console.log(e)
        this.formValidate.thumbnail = e[0].response.data
      },
      handleTransportFileList2(e) {
        console.log(e)
        this.formValidate.blueprint = e[0].response.data
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
        this.show = false
        if(e){
          this.findById()}
      }
    },
    created() {
      this.findById()
    }
  }
</script>

<style scoped>
  .upload-tip {
    color: #ccc;
    font-size: 12px;
  }
</style>
