<template>
  <!-- 用户详情页 -->
  <div class='user-detail'>
    <el-col :span="6" class='user-detail-left'>
      <!-- 基本信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>基本信息</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="信息编辑">编辑</el-dropdown-item> -->
              <el-dropdown-item 
                command="上架"
                :disabled="product.sellable"
                :style="product.sellable ? {'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}">
                上架
              </el-dropdown-item>
              <el-dropdown-item 
                command="下架"
                :disabled="!product.sellable"
                :style="!product.sellable ? {'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}">
                下架
              </el-dropdown-item>
              <el-dropdown-item 
                command="设置推荐"
                :disabled="product.featured"
                :style="product.featured ? {'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}">
                设置推荐
              </el-dropdown-item>
              <el-dropdown-item 
                command="取消推荐"
                :disabled="!product.featured"
                :style="!product.featured ? {'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}">
                取消推荐
              </el-dropdown-item>
              <el-dropdown-item 
                command="设置热门"
                :disabled="product.salable"
                :style="product.salable ? {'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}">
                设置热门
              </el-dropdown-item>
              <el-dropdown-item 
                command="取消热门"
                :disabled="!product.salable"
                :style="!product.salable ? {'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}">
                取消热门
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">售卖状态：{{product.sellable ? '上架中' : '下架中'}}</span>
        </div>
        <div class="text-item">
          <span class="text_label">商品名称：{{product.name}}</span>
        </div>
        <div class="text-item">
          <span class="text_label" v-if='product.category'>商品分类：{{product.category.name}}</span>
        </div>
        <div class="text-item">
          <span class="text_label">喂养阶段：---</span>
        </div>
        <div class="text-item">
          <span class="text_label">排序数值：---</span>
        </div>
        <div class="text-item">
          <span class="text_label">总销量：{{product.salesQuantity ? product.salesQuantity : '---'}}</span>
        </div>
        <div class="text-item">
          <span class="text_label">总库存：{{product.stocks ? product.stocks : '---'}}</span>
        </div>
        <div class="text-item swipeImg-wrapper">
          <span class="text_label swipeImg-wrapper-text">商品缩略图：</span>
          <div class="swipeImg-wrapper-img" v-if='product.images'>
            <img class='img' v-for="(item,index) in product.images.split(';')" :src="`${$store.state.prefix}${item}`" :key='index' @click='showImg(item)'/>
          </div>
        </div>
        <div class="text-item swipeImg-wrapper">
          <span class="text_label swipeImg-wrapper-text">商品轮播图：</span>
          <div class="swipeImg-wrapper-img" v-if='product.images'>
            <img class='img' v-for="(item,index) in product.images.split(';')" :src="`${$store.state.prefix}${item}`" :key='index' @click='showImg(item)'/>
          </div>
        </div>
        <div class="text-item">
          <span class="text_label">热门状态：{{product.salable ? '是' : '否'}}</span>
        </div>
        <div class="text-item">
          <span class="text_label">推荐状态：{{product.featured ? '是' : '否'}}</span>
        </div>
      </el-card>
    </el-col>
    <!--商品规格-->
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>商品规格(销售属性)</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="添加规格">添加</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 商品规格(销售属性)数据表格 -->
        <div>
          <h4>规格设置</h4>
          <el-button type="primary" class='addSepc-btn' @click='showAddSpec'>新增</el-button>
        </div>
        <el-table
          :data="specData">
          <el-table-column prop="name" label="规格名称(销售属性)"></el-table-column>
          <el-table-column label="规格值(销售属性)">
            <template slot-scope='scope'>
              {{scope.row.value.join(';')}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click='editSpec(scope.row)'>编辑</el-button>
              <el-button type="text" size="small" @click='deleteSpec(scope.row)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <h4>库存价格管理</h4>
        </div>
        <el-table
          :data="stockData">
          <el-table-column :prop='item.name' :label="item.name" v-for='(item, index) in specData' :key='index'></el-table-column>
          <el-table-column prop="sellPrice" label="销售价(元)"></el-table-column>
          <el-table-column prop="origPrice" label="原价(元)"></el-table-column>
          <el-table-column prop="stock" label="库存"></el-table-column>
          <el-table-column prop="img" label="图片"></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <!--商品批次-->
    <el-col :span="18" class='user-detail-right' style='float: right;'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>商品批次</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="添加批次">添加</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
<!--        刷新按钮-->
        <el-button icon="el-icon-refresh" type="primary">刷新</el-button>
        <!-- 分页组件 -->
        <div class="pager-group">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, jumper, prev, next"
            :total="total">
          </el-pagination>
        </div>
        <!-- 商品批次数据表格 -->
        <el-col :span="24" class='table-data'>
          <el-table
            :data="batchData">
            <el-table-column label="批次号">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="toDetail(scope.row)"
                  type="text"
                  size="small">
                  {{scope.row.id}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="生产日期" width='120' sortable></el-table-column>
            <el-table-column prop="endTime" label="保质期至" width='120' sortable></el-table-column>
            <el-table-column prop="number" label="总量" sortable></el-table-column>
            <el-table-column prop="stock" label="剩余" sortable></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column width='180' label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small">{{scope.row.enabled ? '禁用' : '启用'}}</el-button>
                <el-button  type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-col>
    <!--图文详情-->
    <el-col :span="18" class='user-detail-right' style='float: right;'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>图文详情</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="图文编辑">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="good-text">图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情
          图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情
          图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情
          图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情
          图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情
          图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情图文详情</div>
        <div class="good-img">
          <!-- <img :src="avatar" ref="goodsImg"> -->
        </div>
      </el-card>
    </el-col>
    <!--    基本信息编辑弹框-->
    <!-- <i-edit
      :dialog-visible="editProps.visible"
      :brand-options="brandOptions"
      :category-options="categoryOptions"
      :stage-options="stageOptions"
      :edit-id='editId'
      @on-dialog-close="handleClose"
      @onRefreshData='search(page)'
    /> -->
    <!--商品批次详情弹框-->
    <el-dialog
      title="商品批次详情"
      :visible.sync="batchProps.visible"
      :modal-append-to-body='false'
      width="40%"
      :before-close="handleClose">
      <el-row>
        <el-col :span="8">批次号</el-col>
        <el-col :span="8">生产日期</el-col>
        <el-col :span="8">保质期至</el-col>
      </el-row>
      <!--商品批次详情数据表格-->
      <el-col :span="24" class='table-data' stripe>
        <el-table
          :data="batchDetailData">
          <el-table-column prop="color" label="颜色"></el-table-column>
          <el-table-column prop="size" label="尺码"></el-table-column>
          <el-table-column prop="number" label="总量"></el-table-column>
          <el-table-column prop="stock" label="剩余"></el-table-column>
        </el-table>
      </el-col>
    </el-dialog>
    <!--图文详情编辑弹框-->
    <text-edit
      :dialog-visible="textEditProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
      :id="id"
    />
    <!--添加商品规格弹框-->
    <i-create-spec
      :dialog-visible="createSpecProps.visible"
      @on-dialog-close="handleClose"
      :active='1'
      :editId='id'
      @on-save-success="handleSave"
      @handleShowSpec='handleShowSpec'>
    </i-create-spec>
    <!--添加商品批次弹框-->
    <i-create-batch
      :dialog-visible="createBatchProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave">
    </i-create-batch>
    <!-- 查看图片对话框 -->
    <el-dialog
      title="查看图片"
      :visible.sync="imgVisible"
      :modal-append-to-body='false'
      width="50%"
      :before-close="handleClose">
      <img :src="`${$store.state.prefix}${showImgSrc}`" alt="" width="100%">
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
            :key="index"
            v-for="(tag, index) in dynamicTags"
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
  import { findById, enableSellable, disableSellable, enableFeatured, disableFeatured, enableSalable, disableSalable } from '@/project/service/product'
  import { searchAttribute, save, deleteById, update } from '@/project/service/attribute'
  import { saveValue, deleteValueById } from '@/project/service/value'
  import textEdit from './textEdit'
  import IEdit from './edit'
  import ICreateSpec from './createSpec' // 添加商品规格弹框组件
  import ICreateBatch from './createBatch' // 添加商品批次弹框组件
  import search from '@/framework/components/search'
  export default {
    components: {
      IEdit, ICreateSpec, ICreateBatch, textEdit, search
    },
    data() {
      return {  
        product: {},
        id: this.$route.params.id,
        textEditId: 0,
        // 商品基本信息弹框显示隐藏
        editProps: {
          visible: false
        },
        // 商品批次详情弹框显示隐藏
        batchProps: {
          visible: false
        },
        // 图文详情编辑弹框显示隐藏
        textEditProps: {
          visible: false
        },
        // 添加商品规格弹框显示隐藏
        createSpecProps: {
          visible: false
        },
        // 添加商品批次弹框显示隐藏
        createBatchProps: {
          visible: false
        },
        // 新增商品规格弹框显示隐藏
        addSpecItemVisible: false,
        imgVisible: false,
        inputVisible: false,
        inputValue: '',
        showImgSrc: '',
        dynamicTags: [],
        specFormValidate: {
          name: '',
          goodsList: []
        },
        specRuleValidate: {
          name: [{required: true, message: '规格名称不能为空', trigger: 'blur'}]
        },
        // 添加或者编辑规格（“添加”，“编辑”）
        type: '添加',
        // 当前编辑规格的id
        attributeId: null,
        // 所有规格条目数据
        attributeData: [],
        // 分页组件参数
        pageSize: 10,
        page: 1,
        total: 0, 
        // 商品规格数据列表
        specData: [],
        // 库存数据列表
        stockData: [],
        // 批次数据列表
        batchData: [
          {
            id: '2020020212',
            startTime: '2020-02-02',
            endTime: '2023-02-02',
            number: 300,
            stock: 250,
            status: '启用'
          }
        ],
        // 批次详情数据列表
        batchDetailData: [
          {
            color: '黑色',
            size: 'L',
            number: 50,
            stock: 50
          }
        ],
        data: []
      }
    },
    created() {
      // 获取商品详细信息
      this.findById()
      // 获取商品规格
      this.getSpec()
      // let copyArr = []
      // for (let i = 0; i < this.specData.length; i++) {
      //   console.log(this.specData[i])
      // }
      // console.log(valueArr)
      
      // let resultList = []                         //结果数组      [[],[],[],[列1的值，列2的值]]
      // let child = []                              //放进结果的数组元素
      // let len = this.specData.length;

      // function brotherback(list, level) {
      //   list.forEach(value => {
      //     if(level = len) {     //如果爸数组的循环到了最后一层
      //       child[level] = value
      //       resultList.push(child)
      //       child = []
      //     } else {
      //       child[level] = value
      //       return brotherback(this.specData[i++] ,i++)
      //     }
      //   })
      // }
      // console.log(this.specData[0])
      // // brotherback(this.specData[0], 0)
      // console.log('child',child)
      // console.log('result是什么',resultList)

    },
    methods: {
      // 确认添加或编辑规格
      handleAddSpec(type) {
        let param = {
          name: this.specFormValidate.name,
          value: this.dynamicTags,
          id: this.attributeId
        }
        this.$refs.specFormValidate.validate(valid => {
          if (type === '添加') {
            if (valid) {
              let valueList = []
              this.dynamicTags.map(item => {
                valueList.push({name: item, text: item})
              })
              let addParam = {
                name: this.specFormValidate.name,
                type: 'product',
                ordinary: false,
                product: {
                  id: this.id
                },
                valueList
              }
              // 发送添加规格属性请求
              save({attribute: addParam}, res => {
                this.$message.success('添加规格成功')
                this.addSpecItemVisible = false
                this.specData.push({name: this.specFormValidate.name, value: [...this.dynamicTags]})
                this.dynamicTags = []
                this.specFormValidate.name = ''
              })
            } 
          } else {
            this.$refs.specFormValidate.validate(valid => {
              if (valid) {
                this.addSpecItemVisible = false
                this.specData.splice(this.updateIndex, 1)
                this.specData.splice(this.updateIndex, 0, param)
                console.log(this.attributeId)
                // 发送更新编辑规格请求
                update({attribute: {id: this.attributeId, name: this.specFormValidate.name}}, res => {
                  this.$message.success('编辑规格成功')
                })
              }
            })
          }
        })
      },
      // 删除规格值
      handleDelete(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
        let valueList = this.attributeData.find(item => item.id === this.attributeId).valueList
        let filterValueList = valueList.filter(item => item.text === tag)
        // 默认删除最后添加并且重复的一个
        let valueId = filterValueList[filterValueList.length - 1].id
        // 发送删除规格值请求
        deleteValueById({id: valueId}, res => {
          this.$message.success('删除规格值成功')
        })
      },
      // 显示输入框
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      // 确认添加规格值
      handleInputConfirm() {
        let inputValue = this.inputValue
        if (inputValue) {
          // 添加规格值
          if (this.type === '添加') {
            this.dynamicTags.push(inputValue)
            this.inputVisible = false
            this.inputValue = ''
          } else {
            this.dynamicTags.push(inputValue)
            // 发送添加规格值请求
            let param = {
              attribute: {id: this.attributeId},
              text: this.inputValue,
              name: this.inputValue
            }
            saveValue({value: param}, res => {
              this.$message.success('添加规格值成功')
              this.inputVisible = false
              this.inputValue = ''
            })
          }
        }
      },
      // 显示新增规格弹框
      showAddSpec() {
        this.addSpecItemVisible = true
        this.type = '添加'
        this.dynamicTags = []
        this.specFormValidate.name = ''
      },
      // 显示编辑规格弹框
      editSpec(row) {
        this.addSpecItemVisible = true
        this.type = '编辑'
        this.specFormValidate.name = row.name
        this.dynamicTags = row.value
        // 记录当前修改行的index
        this.updateIndex = this.specData.findIndex(item => item.name === row.name)
        this.attributeId = row.id
      },
      // 删除规格
      deleteSpec(row) {
        this.$confirm(`确定删除该条规格属性吗？`, '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.specData.splice(this.specData.findIndex(item => item.id === row.id), 1)
          // 删除规格请求
          deleteById({id: row.id}, res => {
            this.$message.success('删除规格成功')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 关闭新增规格弹框
      handleCloseAddSpec() {
        this.addSpecItemVisible = false
        this.dynamicTags = []
        this.$refs.specFormValidate.resetFields()
        this.inputVisible = false
      },
      // 图片预览
      showImg(src) {
        this.imgVisible = true
        this.showImgSrc = src
      },
      getSpec() {
        searchAttribute({product: {id: this.id}}, res => {
          this.attributeData = res
          res.forEach(item => {
            let param = {}
            param.name = item.name
            param.id = item.id
            let value = []
            item.valueList.forEach(item1 => {
              value.push(item1.text)
            })
            param.value = value
            this.specData.push(param)
          })
        })
      },
      // 显示勾选的规格值
      handleShowSpec(checkList) {
        this.specData = []
        let specNameArr = Object.keys(checkList)
        specNameArr.forEach(item => {
          let param = {}
          param.name = item
          param.valueList = checkList[item]
          this.specData.push(param)
        })
      },
      // 根据商品id获取商品详细信息
      findById() {
        findById({id: this.id}, res => {
          this.product = res
        })
      },
      handleClick(command){
        switch (command) {
          case '信息编辑':
            this.editProps.visible = true
            break
          case '图文编辑':
            this.textEditProps.visible = true
            break;
          case '添加规格':
            this.createSpecProps.visible = true            
            break;
          case '添加批次':
            this.createBatchProps.visible = true
            break;
          case '上架':
            enableSellable({id: this.id}, res => {
              this.$message({
                type: 'success',
                message: '上架成功!'
              });
              this.findById();
            })
            break;
          case '下架':
            disableSellable({id: this.id}, res => {
              this.$message({
                type: 'success',
                message: '下架成功!'
              });
              this.findById();
            })
            break;
          case '设置推荐':
            enableFeatured({id: this.id}, res => {
              this.$message({
                type: 'success',
                message: '设置推荐成功!'
              });
              this.findById();
            })
            break;
          case '取消推荐':
            disableFeatured({id: this.id}, res => {
              this.$message({
                type: 'success',
                message: '取消推荐成功!'
              });
              this.findById();
            })
            break
          case '设置热门':
            enableSalable({id: this.id}, res => {
              this.$message({
                type: 'success',
                message: '设置热门成功!'
              });
              this.findById();
            })
            break;
          case '取消热门':
            disableSalable({id: this.id}, res => {
              this.$message({
                type: 'success',
                message: '取消热门成功!'
              });
              this.findById();
            })
            break
        }
      },
      searchBySearchItem(searchItems) {
        let keys = [];
        for (
          let i = 0,
            searchItemList = this.searchItems,
            len = searchItemList.length;
          i < len;
          i++
        ) {
          keys.push(searchItemList[i].key);
        }
        for (let i in keys) {
          if (searchItems[keys[i]]) {
            this.extraParam[keys[i]] = searchItems[keys[i]];
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        this.search(1);
      },

      // 用户详情列表查询交易记录
      search(page) {
        let _t = this;
        _t.page = page;
        let param = {
          pageable: {
            page: page,
            size: _t.pageSize,
            sort: _t.sort
          },
          [this.model]: _t.extraParam
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

      // 分页组件监听函数
      // 监听当前页数变换
      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },
      // 监听当前页条目数变换
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(this.page);
      },

      // 商品批次详情弹框
      toDetail(id) {
        this.batchProps.visible = true
      },

      // 关闭详情弹框
      handleClose() {
        this.editProps.visible = false
        this.batchProps.visible = false
        this.textEditProps.visible = false
        this.createSpecProps.visible = false
        this.createBatchProps.visible = false
        this.imgVisible = false
      },
      handleSave() {},
    },
    filters: {
      updateList(val) {
        let str = []
        val.forEach(item => {
          str.push(item)
        })
        return str.join(';')
      }
    }
  }
</script>

<style lang='less' scoped>
  .text-item-avatar {
    display: flex;
    align-items: center;
  }
  .swipeImg-wrapper {
    display: flex;
    .swipeImg-wrapper-text {
      flex: 100px 0 0;
    }
    .swipeImg-wrapper-img {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .img {
        flex: 0 0 50%;
        width: 50%;
        box-sizing: border-box;
        padding: 2px;
      }
    }
  }
  .addSepc-btn {
    margin: 5px 0;
    background-color: #00a16c;
    border: none;
    &:hover {
      background: #66b1ff;
    }
  }
  .el-tag {
    margin: 0 5px;
    &:first-child {
      margin-left: 0;
    }
  }
</style>
