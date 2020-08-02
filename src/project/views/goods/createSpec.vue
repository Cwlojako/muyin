<!--添加商品规格对话框-->
<template>
  <div>
    <el-dialog
      title="商品规格"
      :visible.sync="dialogVisible"
      :modal-append-to-body='false'
      width="60%"
      :before-close="handleClose">
      <div style="overflow: auto;height:30vh;padding: 10px 0 40px;" v-if="currentActive === 1">
        <el-button type="primary" @click='addSpecItem'>添加规格</el-button>
        <el-col :span="24" class='table-data'>
          <el-table
            :data="specData">
            <el-table-column prop="name" label="规格名称"></el-table-column>
            <el-table-column prop="value" label="规格值" width="250">
              <template slot-scope="scope">
                <el-checkbox-group v-model="checkList[scope.row.name]" @change='change'>
                  <el-checkbox v-for="(item, index) in scope.row.value" :label="item" :key='index'></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column width='180' label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click='updateSpec(scope.row)'>编辑</el-button>
                <el-button type="text" size="small" @click='deleteSpec(scope.row.name)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </div>
      <div v-if="currentActive === 2">
        <h4>库存价格管理</h4>
        <el-form inline>
          <el-form-item label="销售价" prop="sellPrice">
            <el-input v-model="formValidate.sellPrice" placeholder="请输入销售价"></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input v-model="formValidate.stock" placeholder="请输入库存"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary">一键填充</el-button>
        <el-table
          :data="stockData"
          class="table-data">
          <el-table-column prop="color" label="颜色"></el-table-column>
          <el-table-column prop="size" label="尺码"></el-table-column>
          <el-table-column prop="sellPrice" label="销售价">
            <el-input v-model="sellPrice" placeholder="请输入" class="stock-input"></el-input>
          </el-table-column>
          <el-table-column prop="origPrice" label="库存">
            <el-input v-model="origPrice" placeholder="请输入" class="stock-input"></el-input>
          </el-table-column>
          <el-table-column prop="img" label="图片">
            <template slot-scope="scope">
              <el-upload
                class="avatar-uploader"
                action="/api/attachment/upload"
                :show-file-list="false"
                :on-success="handleSuccess">
                <img :src="imageUrl" v-if="imageUrl"/>
                <el-link v-else type="primary">请选择</el-link>
              </el-upload>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="currentActive = 1" v-if="currentActive === 2">上一步</el-button>
        <el-button type="info" @click="next" v-if="currentActive === 1">下一步</el-button>
        <el-button type="primary" @click="handleConfirm('formValidate')" v-if="currentActive === 2">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加规格条目弹框 -->
    <el-dialog
    :title='type === "编辑" ? "编辑规格" : "添加规格"'
    :visible.sync="addSpecItemVisible"
    :modal-append-to-body='false'
    width="40%"
    top='25vh'
    :before-close="handleCloseAddSpec">
    <el-form ref='specFormValidate' :model="specFormValidate" :rules="specRuleValidate" label-width="80px">
      <el-form-item label="规格名称" prop="name">
        <el-input v-model="specFormValidate.name" placeholder="请输入规格名称"></el-input>
      </el-form-item>
      <el-form-item label="规格值" prop="goodsList">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleDelete(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">添加规格值 (输入后请按回车键)</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="handleCloseAddSpec">取消</el-button>
      <el-button type="primary" @click="handleAddSpec(type)">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
  import Upload from "@/framework/components/upload";
  import {save} from '@/project/service/slide';
  import {search, count} from "@/project/service/store"
  import { searchAttribute } from '@/project/service/attribute'
 
  export default {
    name: 'createSpec',
    components: {
      Upload
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      active: {
        type: Number,
        default: 1
      },
      editId: {
        type: [Number, String]
      }
    },
    watch: {
      dialogVisible(val) {
        if (val) {
          // 重置数据
          this.specData = []
          this.currentActive = this.active
          // 获取商品规格值
          searchAttribute({product: {id: this.editId}}, res => {
            res.forEach(item => {
              let param = {}
              param.name = item.name
              let value = []
              item.valueList.forEach(item1 => {
                value.push(item1.text)
              })
              param.value = value
              this.specData.push(param)
            })
            let arr = []
            res.forEach(item => {
              arr.push(item.name)
            })
            // 初始化checkbox组绑定数组
            arr.forEach(item => {
              this.$set(this.checkList, item, [])
            })
            // 打开时勾选父组件已显示的规格值
            let defaultCheckList = JSON.parse(localStorage.getItem(`Good${this.editId}`))
            if (defaultCheckList) {
              defaultCheckList.forEach(item => {
                if (item.valueList.length > 0) {
                  this.checkList[item.name].push(...item.valueList)
                }
              })
              console.log(this.checkList)
            }
          })
        }
      }
    },
    data() {
      return {
        currentActive: null,
        // 规格数据列表
        specData: [],
        // 库存管理列表
        stockData: [],
        // 销售价
        sellPrice: null,
        // 原价
        origPrice: null,
        formValidate: {
          sellPrice: null,
          stock: null,
          origPrice: null,
        },
        specFormValidate: {
          name: '',
          goodsList: []
        },
        // 各checkbox组绑定的数据
        checkList: {},
        specRuleValidate: {
          name: [{required: true, message: '规格名称不能为空', trigger: 'blur'}]
        },
        addSpecItemVisible: false,
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        // 添加或者编辑规格（“添加”，“编辑”）
        type: '添加'
      }
    },
    methods: {
      next() {
        this.currentActive = 2
        // 发送保存规格请求
        // this.$emit('handleShowSpec', this.checkList)
      },
      change(val) {
        console.log(this.checkList)
      },
      addSpecItem() {
        this.addSpecItemVisible = true
        this.type = '添加'
        this.specFormValidate.name = ''
      },
      // 本地删除当前规格
      deleteSpec(name) {
        this.specData.splice(this.specData.findIndex(item => item.name === name), 1)
      },
      // 本地编辑当前规格
      updateSpec(row) {
        this.type = '编辑'
        this.addSpecItemVisible = true
        this.specFormValidate.name = row.name
        this.dynamicTags = row.value
        // 记录当前修改行的index
        this.updateIndex = this.specData.findIndex(item => item.name === row.name)
      },
      handleClose() {
        this.$emit('on-dialog-close')
      },
      handleCloseAddSpec() {
        this.addSpecItemVisible = false
        this.dynamicTags = []
        this.$refs.specFormValidate.resetFields()
      },
      // 确认添加规格条目
      handleAddSpec(type) {
        let param = {
          name: this.specFormValidate.name,
          value: this.dynamicTags
        }
        if (type === '添加') {
          this.addSpecItemVisible = false
          this.specData.push(param)
          this.$set(this.checkList, this.specFormValidate.name, [])
        } else {
          this.specData.splice(this.updateIndex, 1)
          this.specData.splice(this.updateIndex, 0, param)
        }
        this.addSpecItemVisible = false
        this.dynamicTags = []
        this.specFormValidate.name = ''
      },

      handleDelete(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
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
  .el-tag {
    margin: 0 5px;
    &:first-child {
      margin-left: 0;
    }
  }
</style>
