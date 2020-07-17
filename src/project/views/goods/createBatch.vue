<!--添加商品规格对话框-->
<template>
  <el-dialog
    title="商品批次"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <h4>商品批次管理</h4>
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="批次号" prop="batchId">
        <el-input v-model="formValidate.batchId" placeholder="请输入商品批次号"></el-input>
      </el-form-item>
      <el-form-item label="生产日期" prop="effectAt">
        <el-date-picker
          v-model="formValidate.effectAt"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="有效期至" prop="expireAt">
        <el-date-picker
          v-model="formValidate.expireAt"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="formValidate.stock" placeholder="请输入"></el-input>
        <el-button type="primary" class="quick-input-btn">一键填充</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="stockData"
      class="table-data">
      <el-table-column prop="color" label="颜色"></el-table-column>
      <el-table-column prop="size" label="尺码"></el-table-column>
      <el-table-column prop="stock" label="库存">
        <el-input v-model="formValidate.stock" placeholder="请输入" class="stock-input"></el-input>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleConfirm('formValidate')">完 成</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Editor from "@/framework/components/editor"
  import Upload from "@/framework/components/upload";
  import Search from "@/framework/components/search";
  import {save} from '@/project/service/slide';
  import {search, count} from "@/project/service/store"
  import emitter from "@/framework/mixins/emitter";

  export default {
    name: "createSpec",
    mixins:[emitter],
    components: {
      Upload, Editor, Search
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      messageType: {
        type: String,
        default: '短信推送'
      }
    },
    directives: {
      required: {
        inserted: function (el) {
          console.log(el.children)
          el.children[0].addEventListener('blur', function (event) {
            if (el.value == '' || el.value == null) {
              el.children[0].style.border = "1px solid red";
              console.log('我不能为空');
            };
          });
        }
      }
    },
    data() {
      return {
        imageUrl: '',
        // 添加编辑商品规格数据信息
        specData: [
          {
            name: '颜色',
            value: ['黑色','白色','蓝色'],
            status: '启用',
            checked: ['黑色','白色']
          },
          {
            name: '尺码',
            value: ['S','M','L','XL'],
            status: '启用',
            checked: ['S','M']
          },
          {
            name: '厚薄',
            value: ['薄','厚','适中'],
            status: '禁用',
            checked: ['薄']
          },
        ],
        // 库存加个管理数据信息
        stockData: [
          {
            color: '黑色',
            size: 'M'
          },
          {
            color: '黑色',
            size: 'S'
          },
          {
            color: '黑色',
            size: 'L'
          },
          {
            color: '黑色',
            size: 'XL'
          }
        ],
        num: 1,
        typeValue: '',
        type: [{
          value: '外部链接',
          label: '外部链接'
        }, {
          value: '商品详情',
          label: '商品详情'
        }],
        options: [
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
        value: '',
        formValidate: {
          location: '',
          title: '',
          image: '',
          effectAt: '',
          expireAt: '',
          position: 0,
          link:'',
          status:'启用'
        },
        ruleValidate: {
          location: [{required: true, message: '不能为空', trigger: 'change'}],
          title: [{required: true, message: '不能为空', trigger: 'blur'}],
          image: [{required: true, message: '不能为空'}],
          effectAt: [{required: true, message: '不能为空', trigger: 'blur'}],
          expireAt: [{required: true, message: '不能为空', trigger: 'blur'}],
          position: [{required: true, message: '不能为空', trigger: 'blur'}],
        },
        model: 'slide',
        active: 1,
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
        sort: {asc: [], desc: ['id']},
        extraParam: {},
        searchItems: [
          {
            name: "手机号",
            key: "phone",
            type: "string"
          },
          {
            name: "最近登录时间",
            key: "accessAt",
            type: "daterange",
          },
          {
            name: "状态",
            key: "status",
            type: "select",
            displayValue: ["禁用", "启用"],
            value: ["禁用", "启用"]
          }
        ],
        model:'slide'
      }
    },
    methods: {
      // 图片上传成功
      handleSuccess(res, file) {
        console.log(res,"res")
        console.log(file,"file")
        this.imageUrl = "http://47.107.184.144/attachment/" + file.response.data
      },
      change(res) {
        console.log(res)
      },
      handleClose() {
        this.$emit('on-dialog-close');
      },
      handleConfirm(name) {
        this.broadcast("SiUpload", "on-form-submit", () => {
        });
        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (valid) {
              save({
                [this.model]: this.formValidate,
              }, res => {
                this.$notify.success('添加成功');
                this.$emit('on-save-success');
              })
            }
          });
        });

      },
      handleTransportFileList(fileList) {
        if (fileList.length > 0) {
          let arr = []
          fileList.forEach(item => {
            arr.push(item.response.data);
          });
          this.formValidate.image = arr.join(';');
        } else {

        }

      },
      pre() {
        this.active--;
      },
      next() {
        this.active++;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;

        this.search(this.page);
      },
      search(page) {
        let _t = this;
        _t.page = page;
        let param = {
          pageable: {
            page: page,
            size: _t.pageSize,
            sort: _t.sort
          },
          user: _t.extraParam
        };
        if (
          param.pageable.sort.asc.length === 0 &&
          param.pageable.sort.desc.length === 0
        ) {
          delete param.pageable.sort;
        }
        search(param, res => {
          let data = res;
          _t.data = data;
          _t.getTotal();
        });
      },
      getTotal() {
        let _t = this;
        let param = {user: _t.extraParam};
        count(param, res => {
          _t.total = parseInt(res);
        });
      },
      onChangeEditor(val) {
        this.formValidate.contet = val.html;
      },
      changeType(val) {
        this.formValidate.link = '';
        if (val === '外部链接') {
          this.formValidate.type = 'http';
        } else {
          this.formValidate.type = 'object';
        }
      },
      onSelectId(id) {
        switch (this.typeValue) {
          case "商品详情":
            this.formValidate.link = `Goods:${id}`;
            break;
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .table-data {
    margin-top: 10px;
  }
  .stock-input {
    width: 120px!important;
  }
  .quick-input-btn {
    margin-left: 10px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
</style>
