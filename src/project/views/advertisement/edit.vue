<template>
  <el-dialog
    title="广告管理"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <div style="overflow: auto;height:40vh;padding: 10px 0 40px;">
      <el-steps :active="active" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
      </el-steps>
      <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px" v-show="active === 1">
        <el-form-item label="广告位" prop="location">
          <el-select v-model="formValidate.location" placeholder="请选择">
            <el-option
              v-for="item in locationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告标题" prop="title">
          <el-input v-model="formValidate.title" placeholder="输入标题"></el-input>
        </el-form-item>
        <el-form-item label="广告图片" prop="image">
          <transition name='opacity'>
            <upload
              @on-transport-file-list="handleTransportFileList"
              :file-list="formValidate.image ? formValidate.image.split(';') :[]"
              v-if='isFinished'
              :max-size="5120"
              :limit="1">
            </upload>
          </transition>
        </el-form-item>
        <el-form-item label="开始时间" prop="effectiveTime">
          <el-date-picker
            v-model="formValidate.effectiveTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="expirationTime">
          <el-date-picker
            v-model="formValidate.expirationTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序数字">
          <el-input-number size="small" v-model="formValidate.position" style="width: 200px"></el-input-number>
        </el-form-item>
      </el-form>
      <el-form :model="formValidate" v-if="active === 2">
        <el-form-item label="广告类型" prop="title">
          <el-select v-model="formValidate.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外部链接" prop="title" v-if="formValidate.type === '外部链接'">
          <el-input v-model="formValidate.link" placeholder="输入链接"></el-input>
        </el-form-item>
        <goods @on-select-id="onSelectId" v-if="formValidate.type === '商品详情'" :productId='productId'></goods>
        <articles @on-select-id="onSelectId" v-if="formValidate.type === '图文详情'" :articleId='articleId'></articles>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="pre" v-if="active === 2">上一步</el-button>
      <el-button type="info" @click="next" v-if="active === 1">下一步</el-button>
      <el-button type="primary" @click="handleConfirm('formValidate')" v-if="active === 2">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Editor from "@/framework/components/editor"
  import Upload from "@/framework/components/upload";
  import Search from "@/framework/components/search";
  import emitter from "@/framework/mixins/emitter";
  import goods from './goods'
  import articles from './articles'
  import {save, get, update} from '@/project/service/slide';
  import {search, count} from "@/project/service/store"

  export default {
    mixins: [emitter],
    components: {
      Upload, Editor, Search, goods, articles
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      id: {
        type: [Number,String],
        default: 0
      }
    },
    data() {
      const validateImage = (rule, value, callback) => {
        if (this.formValidate.cover === '') {
          callback("广告图不能为空")
        } else {
          callback();
        }
      }
      return {
        model: 'slide',
        isFinished: false,
        // 广告类型可选项
        typeOptions: [{
          value: '外部链接',
          label: '外部链接'
        }, {
          value: '商品详情',
          label: '商品详情'
        }, {
          value: '图文详情',
          label: '图文详情'
        }],
        // 广告位可选项
        locationOptions: [
          {
            value: '首页banner图',
            label: '首页banner图'
          }, {
            value: '商城banner图',
            label: '商城banner图'
          }, {
            value: '直播banner图',
            label: '直播banner图'
          }],
        // 表单绑定数据对象
        formValidate: {
          location: '', //广告位
          title: '',  //广告标题
          image: '',  //广告图片
          effectiveTime: '', //开始时间
          expirexpirationTimeeAt: '', //结束时间
          position: 0,  //排序数值
          link:'', //广告链接
          type: '', //广告类型
        },
        ruleValidate: {
          location: [{required: true, message: '不能为空', trigger: 'change'}],
          title: [{required: true, message: '不能为空', trigger: 'blur'}],
          image: [{validator: validateImage}],
          effectiveTime: [{required: true, message: '不能为空', trigger: 'blur'}],
          expirationTime: [{required: true, message: '不能为空', trigger: 'blur'}],
          position: [{required: true, message: '不能为空', trigger: 'blur'}],
          type: [{required: true, message: '请选择', trigger: 'blur'}]
        },
        active: 1
      }
    },
    watch: {
      dialogVisible(val) {
        if(val) {
          this.get(this.id)
        }
      }
    },
    methods: {
      handleClose() {
        this.active = 1
        this.$emit('on-dialog-close')
        this.isFinished = false
      },
      handleConfirm(name) {
        this.$refs[name].validate(valid => {
          if (!valid) return false
          let param = Object.assign({id: this.id}, this.formValidate)
          update({
            [this.model]: param,
          }, res => {
            this.$message.success('编辑更新成功')
            this.handleClose()
            this.active = 1
            this.$emit('onRefreshData')
          })
        })
      },
      handleTransportFileList(fileList) {
        if (fileList.length === 0) {
          this.formValidate.image = ''
        } else {
          let arr = []
          fileList.forEach(item => {
            arr.push(item.response.data);
          });
          this.formValidate.image = arr.join(';')
        }
      },
      pre() {
        this.active--;
      },
      next() {
        this.broadcast("SiUpload", "on-form-submit", () => {});
        this.active++;
      },
      onSelectId(id) {
        // 接收到id值
        switch (this.formValidate.type) {
          case "商品详情":
            this.formValidate.link = `Product:${id}`;
            break;
          case "图文详情":
            this.formValidate.link = `Post:${id}`;
            break;
        }
      },
      get(id) {
        get({id: id}, res => {
          this.formValidate = res
          let type = res.type
          if (type === '图文详情') {
            this.articleId = parseInt(res.link.split(':')[1])
          } else if (type === '商品详情') {
            this.productId = parseInt(res.link.split(':')[1])
          }
          this.isFinished = true
        })
      }
    }
  }
</script>

<style scoped>
  .el-steps {
    flex: 1;
    background: #fff;
    border: none;
    padding: 0;
    width: 50%;
    margin: 0 auto;
  }
</style>
