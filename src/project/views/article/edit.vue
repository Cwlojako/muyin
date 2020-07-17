<template>
  <el-dialog
    title="论坛中心编辑文章"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="content">
        <upload
          @on-transport-file-list="handleTransportFileList"
          :max-size="5120"
          :limit="1">
        </upload>
        <span class="upload-tip">*建议上传图片尺寸200*200，上传本地图片，最多1张</span>
      </el-form-item>
      <el-form-item label="正文" prop="content">
        <el-input type="textarea" v-model="formValidate.content"></el-input>
      </el-form-item>
      <el-form-item label="正文图片" prop="avatar">
        <upload
          @on-transport-file-list="handleTransportFileList"
          :max-size="5120"
          :limit="7">
        </upload>
        <span class="upload-tip">*建议上传图片尺寸200*200，上传本地图片，最多7张</span>
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
      editId: {
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
        if (this.editId) {
          get({id:this.editId},res => {
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

</style>
