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
      <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px" v-if="active === 1">
        <el-form-item label="广告位" prop="title">
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
        <el-form-item label="广告图片" prop="title">
          <upload
            @on-transport-file-list="handleTransportFileList"
            :file-list="formValidate.image ? formValidate.image.split(';') :[]"
            :max-size="5120"
            :limit="1"
          >
          </upload>
        </el-form-item>
        <el-form-item label="开始时间" prop="subTitle">
          <el-date-picker
            v-model="formValidate.effectAt"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="subTitle">
          <el-date-picker
            v-model="formValidate.expireAt"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序数字">
          <el-input-number size="small" v-model="formValidate.position" style="width: 200px"></el-input-number>
        </el-form-item>
      </el-form>
      <el-form :model="formValidate" v-if="active === 2">
        <el-form-item label="广告类型" prop="title">
          <el-select v-model="typeValue" placeholder="请选择" @change="changeType">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外部链接" prop="title" v-if="formValidate.type === 'http' && typeValue === '外部链接'">
          <el-input v-model="formValidate.link" placeholder="输入链接"></el-input>
        </el-form-item>
        <goods @on-select-id="onSelectId" v-if="formValidate.type === 'object' && typeValue === '商品详情'"></goods>
        <articles @on-select-id="onSelectId" v-if="formValidate.type === 'object' && typeValue === '图文详情'"></articles>
      </el-form>

    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="pre" v-if="active === 2">上一步</el-button>
      <el-button type="info" @click="next" v-if="active === 1">下一步</el-button>
      <el-button type="primary" @click="handleConfirm" v-if="active === 2">确 定</el-button>
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
    name: "advertisementEdit",
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
      return {
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
        ruleValidate: {
          location: [{required: true, message: '不能为空', trigger: 'change'}],
          title: [{required: true, message: '不能为空', trigger: 'blur'}],
          image: [{required: true, message: '不能为空'}],
          effectAt: [{required: true, message: '不能为空', trigger: 'blur'}],
          expireAt: [{required: true, message: '不能为空', trigger: 'blur'}],
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
        this.$emit('on-dialog-close');
      },
      handleConfirm() {
        update({
          [this.model]: this.formValidate,
        }, res => {
          this.$notify.success('添加成功');
          this.active = 1
          this.$emit('on-save-success');
        })
      },
      handleTransportFileList(fileList) {
        if (fileList.length > 0) {
          let arr = []
          fileList.forEach(item => {
            arr.push(item.response.data);
          });
          this.formValidate.image = arr.join(';');
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
        switch (this.typeValue) {
          case "商品详情":
            this.formValidate.link = `Goods:${id}`;
            break;
          case "图文详情":
            this.formValidate.link = `Articles:${id}`;
            break;
        }
      },
      changeType(val) {
        if (val === '外部链接') {
          this.formValidate.type = 'http';
        } else {
          this.formValidate.type = 'object';
        }
      },
      get(id) {
        get({id: id}, res => {
          this.formValidate = res;
          if (this.formValidate.type === 'http') {
            this.typeValue = '外部链接';
          } else {
            let arr = this.formValidate.link.split(':');
            switch (arr[0]) {
              case 'Goods' :
                this.typeValue = '商品详情'
                break
              case 'Articles':
                this.typeValue = '图文详情'
                break
            }
          }
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
