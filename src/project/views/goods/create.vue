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
          <el-option value="1" label="1"></el-option>
          <el-option value="2" label="2"></el-option>
          <el-option value="3" label="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品分类" prop="name">
        <el-select v-model="formValidate.category1" placeholder="请选择一级分类">
          <el-option value="1" label="1"></el-option>
          <el-option value="2" label="2"></el-option>
          <el-option value="3" label="3"></el-option>
        </el-select>
        <el-select v-model="formValidate.category2" placeholder="请选择二级分类">
          <el-option value="1" label="1"></el-option>
          <el-option value="2" label="2"></el-option>
          <el-option value="3" label="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="喂养阶段" prop="name">
        <el-select v-model="formValidate.feedLevel" placeholder="请选择喂养阶段">
          <el-option value="1" label="1"></el-option>
          <el-option value="2" label="2"></el-option>
          <el-option value="3" label="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序数值" prop="name">
        <el-input-number size="small" v-model="formValidate.position" style="width: 200px"></el-input-number>
      </el-form-item>
      <el-form-item label="单笔订单运费" prop="name">
        <el-input type='number' v-model="formValidate.deliver" placeholder="请输入"></el-input>&nbsp;元
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
      <el-button type="primary" @click="handleConfirm('formValidate')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Upload from "@/framework/components/upload";
  import emitter from '@/framework/mixins/emitter'
  import {save} from '@/project/service/manager'

  export default {
    name: "createDialog",
    mixins: [emitter],
    components: {
      Upload
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        // 添加表单校验规则
        ruleValidate: {
          phone: [
            {required: true, message: "手机号不能为空", trigger: "blur"}
          ],
          nickname: [
            {required: true, message: "昵称不能为空", trigger: "blur"}
          ]
        },
        model:'manager',
        formValidate: {
          status: '启用',
          nickname: '',
          phone: ''
        }
      }
    },
    computed: {},
    methods: {
      handleClose() {
        this.$refs.formValidate.resetFields();
        this.$emit('on-dialog-close');
      },

      handleConfirm(name) {
        // 通知上传子组件执行相应的操作
        this.broadcast('SiUpload', 'on-form-submit', () => {});
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (valid) {
              save(
                {[this.model]:this.formValidate},
                res => {
                  this.$message.success('添加成功');
                  this.$refs.formValidate.resetFields();
                  this.$emit('on-save-success');
                })
            }
          })
        });
      },

      handleTransportFileList(fileList) {
        console.log(fileList)
        this.formValidate.avatar = fileList[0].response.data;
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
