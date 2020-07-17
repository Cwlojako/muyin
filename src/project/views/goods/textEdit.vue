<template>
  <el-dialog
    title="图文信息编辑"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <!--    <div style="overflow: auto;height:40vh;padding: 10px 0 40px;">-->
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="图文详情" prop="content">
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
        type: [Number,String],
        default: 0,
      }
    },
    data() {
      return {
        categoryList:[],
        show: false,

        formValidate: {
        },
        ruleValidate: {
          name: [{required: true, message: '不能为空', trigger: 'blur'}],
        },

      }
    },
    created() {
      cosnole.log(this.id)
    },
    methods: {
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
