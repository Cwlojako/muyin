<template>
  <el-dialog
    title="商品基本信息编辑"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="formValidate.name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌" prop="brand">
        <el-select v-model="formValidate.brand" placeholder="请选择商品品牌" @change="changeType">
          <el-option value="1">1</el-option>
          <el-option value="2">2</el-option>
          <el-option value="3">3</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品分类" prop="name">
        <el-select v-model="formValidate.category1" placeholder="请选择一级分类" @change="changeType">
          <el-option value="1">1</el-option>
          <el-option value="2">2</el-option>
          <el-option value="3">3</el-option>
        </el-select>
        <el-select v-model="formValidate.category2" placeholder="请选择二级分类" @change="changeType">
          <el-option value="1">1</el-option>
          <el-option value="2">2</el-option>
          <el-option value="3">3</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="喂养阶段" prop="name">
        <el-select v-model="formValidate.feedLevel" placeholder="请选择喂养阶段" @change="changeType">
          <el-option value="1">1</el-option>
          <el-option value="2">2</el-option>
          <el-option value="3">3</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序数值" prop="name">
        <el-input-number size="small" v-model="formValidate.position" style="width: 200px"></el-input-number>
      </el-form-item>
      <el-form-item label="单笔订单运费" prop="name">
        <el-input type='number' v-model="formValidate.deliver" placeholder="请输入"></el-input>&nbsp;元
      </el-form-item>
      <el-form-item label="售卖状态" prop="status">
        <el-select v-model="formValidate.status" placeholder="请选择" @change="changeType">
          <el-option value="上架">上架</el-option>
          <el-option value="下架">下架</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="热门状态" prop="hStatus">
        <el-select v-model="formValidate.hStatus" placeholder="请选择" @change="changeType">
          <el-option value="是">是</el-option>
          <el-option value="否">否</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推荐状态" prop="rStatus">
        <el-select v-model="formValidate.rStatus" placeholder="请选择" @change="changeType">
          <el-option value="是">是</el-option>
          <el-option value="否">否</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品缩略图" prop="avatar">
        <upload
          @on-transport-file-list="handleTransportFileList"
          :max-size="5120"
          :limit="1"
        >
        </upload>
        <span class="upload-tip">*建议上传图片尺寸200*200，上传本地图片，最多1张</span>
      </el-form-item>
      <el-form-item label="轮播图" prop="avatar">
        <upload
          @on-transport-file-list="handleTransportFileList"
          :max-size="5120"
          :limit="5"
        >
        </upload>
        <span class="upload-tip">*建议上传图片尺寸200*200，上传本地图片，最多5张，第一张图片默认为商品主图</span>
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
