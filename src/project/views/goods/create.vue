<template>
  <el-dialog
    title="基本信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="50%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="formValidate.name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌" prop="brand">
        <el-select v-model="formValidate.brand" placeholder="请选择商品品牌">
          <el-option :value="item.id" :label="item.name" v-for='(item, index) in brandOptions' :key='index'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品分类" prop="category">
        <el-select v-model="formValidate.category" placeholder="请选择一级分类">
          <el-option :value="item.id" :label="item.name" v-for='(item, index) in categoryOptions' :key='index'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="喂养阶段" prop="feedLevel">
        <el-select v-model="formValidate.feedLevel" placeholder="请选择喂养阶段">
          <el-option value="-1" label="无"></el-option>
          <el-option :value="item.name" :label="item.name" v-for='(item, index) in stageOptions' :key='index'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序数值" prop="position">
        <el-input-number size="small" v-model="formValidate.position" style="width: 200px"></el-input-number>
      </el-form-item>
      <el-form-item label="商品缩略图" prop="thumbnail">
        <upload
          @on-transport-file-list="handleTransportThumbnail"
          :max-size="5120"
          :limit="1"
        >
        </upload>
        <span class="upload-tip">*建议上传图片尺寸200*200，上传本地图片，最多1张</span>
      </el-form-item>
      <el-form-item label="轮播图" prop="images">
        <upload
          @on-transport-file-list="handleTransportImages"
          :max-size="5120"
          :limit="5"
        >
        </upload>
        <span class="upload-tip">*建议上传图片尺寸200*200，上传本地图片，最多5张，第一张图片默认为商品主图</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm('formValidate')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Upload from "@/framework/components/upload";
  import emitter from '@/framework/mixins/emitter'
  import { save } from '@/project/service/product'
  
  export default {
    mixins: [emitter],
    components: {
      Upload
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      brandOptions: {
        type: Array,
        default: []
      },
      categoryOptions: {
        type: Array,
        default: []
      },
      stageOptions: {
        type: Array,
        default: []
      }
    },
    data() {
      const validateThumbnail = (rule, value, callback) => {
        if (this.formValidate.thumbnail === '') {
          callback("缩略图不能为空");
        } else {
          callback();
        }
      }
      const validateImages = (rule, value, callback) => {
        if (this.formValidate.images === '') {
          callback("轮播图不能为空");
        } else {
          callback();
        }
      }
      return {
        // 添加表单校验规则
        ruleValidate: {
          brand: [{required: true, message: "请选择商品品牌", trigger: "change"}],
          name: [{required: true, message: "商品名称不能为空", trigger: "blur"}],
          category: [{required: true, message: "请选择一级分类", trigger: "change"}],
          position: [{required: true, message: "排序数值不能为空", trigger: "blur"}],
          thumbnail: [{validator: validateThumbnail}],
          images: [{validator: validateImages}]
        },
        model: 'product',
        formValidate: {
          name: '',
          brand: '',
          category: '',
          feedLevel: '',
          position: 0,
          thumbnail: '',
          images: ''
        }
      }
    },
    methods: {
      handleClose() {
        this.$refs.formValidate.resetFields()
        this.$emit('on-dialog-close')
        this.broadcast('SiUpload', 'on-close', () => {})
      },

      handleConfirm(name) {
        // 通知上传子组件执行相应的操作
        this.broadcast('SiUpload', 'on-form-submit', () => {})
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (!valid) return false
            let param = Object.assign({}, this.formValidate)
            if (param.feedLevel === '-1') {
              delete param.feedLevel
            }
            param.brand = {id: this.formValidate.brand}
            param.category = {id: this.formValidate.category}
            save({[this.model]: param}, res => {
              this.$message.success('添加成功')
              this.handleClose()
              this.$emit('onRefreshData')
            })
          })
        })
      },

      handleTransportThumbnail(fileList) {
        if (fileList.length === 0) {
          this.formValidate.thumbnail = ''
        } else {
          this.formValidate.thumbnail = fileList[0].response.data
        }
      },

      handleTransportImages(fileList) {
        if (fileList.length === 0) {
          this.formValidate.images = ''
        } else {
          let imageArr = []
          for (let i = 0; i < fileList.length; i++) {
            imageArr.push(fileList[i].response.data)
          }
          this.formValidate.images = imageArr.join(';')
        }
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
