<template>
  <el-dialog
    title="广告管理"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="60%"
    :before-close="handleClose">
    <div class="step-wrapper">
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
          <upload
            @on-transport-file-list="handleTransportFileList()"
            :max-size="5120"
            :limit="1"
          >
          </upload>
        </el-form-item>
        <el-form-item label="开始时间" prop="effectAt">
          <el-date-picker
            v-model="formValidate.effectAt"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="expireAt">
          <el-date-picker
            v-model="formValidate.expireAt"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序数字" prop="position">
          <el-input-number size="small" v-model="formValidate.position"></el-input-number>
        </el-form-item>
      </el-form>
      <el-form ref="formValidate1" :model="formValidate" v-show="active === 2">
          <el-form-item label="广告类型" prop="type">
            <el-select v-model="formValidate.type"  placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="外部链接" prop="link" v-if="formValidate.type === '外部链接'">
            <el-input v-model="formValidate.link" placeholder="输入链接"></el-input>
          </el-form-item>
          <goods @on-select-id="onSelectId" v-if="formValidate.type === '商品详情'"></goods>
          <articles @on-select-id="onSelectId" v-if="formValidate.type === '图文详情'"></articles>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="pre" v-if="active === 2">上一步</el-button>
      <el-button type="info" @click="next" v-if="active === 1">下一步</el-button>
      <el-button type="primary" @click="handleConfirm('formValidate', 'formValidate1')" v-if="active === 2">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Editor from "@/framework/components/editor"
  import Upload from "@/framework/components/upload"
  import Search from "@/framework/components/search"
  import Goods from './goods'
  import Articles from './articles'
  import {save} from '@/project/service/slide'
  import {search, count} from "@/project/service/store"
  import emitter from "@/framework/mixins/emitter"

  export default {
    name: "advertisementAdd",
    mixins:[emitter],
    components: {
      Upload, Editor, Search, Goods, Articles
    },

    // 父组件传递过来的值
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      }
    },

    data() {
      return {
        // model层
        model: 'slide',
        typeValue: '',
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
          effectAt: '', //开始时间
          expireAt: '', //结束时间
          position: 0,  //排序数值
          link:'', //广告链接
          type: '', //广告类型
          status:'启用' //广告状态
        },

        // 表单验证规则对象
        ruleValidate: {
          location: [{required: true, message: '不能为空', trigger: 'change'}],
          title: [{required: true, message: '不能为空', trigger: 'blur'}],
          effectAt: [{required: true, message: '不能为空', trigger: 'blur'}],
          expireAt: [{required: true, message: '不能为空', trigger: 'blur'}],
          position: [{required: true, message: '不能为空', trigger: 'blur'}],
          type: [{required: true, message: '请选择', trigger: 'blur'}],
        },

        active: 1,
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
      }
    },
    created() {
      this.$store.dispatch('GET_USER_CACHE')
    },
    methods: {
      // 关闭
      handleClose() {
        this.$refs.formValidate.resetFields()
        this.$refs.formValidate1.resetFields()
        this.active = 1
        this.$emit('on-dialog-close')
      },

      // 确定
      handleConfirm(name, name1) {
        // 通知上传子组件将上传的图片地址返回给当前组件
        this.broadcast("SiUpload", "on-form-submit", () => {})
        this.$refs[name].resetFields()
        this.$refs[name1].resetFields()
        this.active = 1
        // 调用新增广告接口
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (valid) {
              save({
                [this.model]: this.formValidate,
              }, res => {
                this.$notify.success('添加成功')
                this.$emit('on-save-success')
              })
            }
          })
        })
      },

      // 将上传子组件传递回来的图书地址保存到
      handleTransportFileList(fileList) {
        console.log(fileList)
        if (fileList.length > 0) {
          let arr = []
          fileList.forEach(item => {
            arr.push(item.response.data)
          })
          this.formValidate.image = arr.join(' ')
        }
      },
      pre() {
        this.active--
      },
      next() {
        this.active++
      },

      onSelectId(id) {
        switch (this.typeValue) {
          case "商品详情":
            this.formValidate.link = `Goods:${id}`
            break
          case "图文详情":
            this.formValidate.link = `Articles:${id}`
            break
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .el-steps {
    flex: 1;
    background: #fff;
    border: none;
    padding: 0;
    width: 50%;
    margin: 0 auto;
  }
</style>
