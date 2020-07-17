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
              <el-dropdown-item command="信息编辑">编辑</el-dropdown-item>
              <el-dropdown-item command="上架">上架</el-dropdown-item>
              <el-dropdown-item command="下架">下架</el-dropdown-item>
              <el-dropdown-item command="设置推荐">设置推荐</el-dropdown-item>
              <el-dropdown-item command="取消推荐">取消推荐</el-dropdown-item>
              <el-dropdown-item command="设置热门">设置热门</el-dropdown-item>
              <el-dropdown-item command="取消热门">取消热门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">售卖状态：</span>
        </div>
        <div class="text-item">
          <span class="text_label">商品名称：</span>
        </div>
        <div class="text-item">
          <span class="text_label">商品分类：</span>
        </div>
        <div class="text-item">
          <span class="text_label">喂养阶段：</span>
        </div>
        <div class="text-item">
          <span class="text_label">单笔订单运费：</span>
        </div>
        <div class="text-item">
          <span class="text_label">排序数值：</span>
        </div>
        <div class="text-item">
          <span class="text_label">总销量：</span>
        </div>
        <div class="text-item">
          <span class="text_label">总库存：</span>
        </div>
        <div class="text-item swipeImg-wrapper">
          <span class="text_label swipeImg-wrapper-text">商品缩略图：</span>
          <img class='swipeImg-wrapper-img' :src="'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'"></img>
        </div>
        <div class="text-item swipeImg-wrapper">
          <span class="text_label swipeImg-wrapper-text">商品轮播图：</span>
          <div class="swipeImg-wrapper-img">
            <img class='img' v-for="item in imgSrc":src="item"></img>
          </div>
        </div>
        <div class="text-item">
          <span class="text_label">热门状态：</span>
        </div>
        <div class="text-item">
          <span class="text_label">推荐状态：</span>
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
        <h4>规格设置</h4>
        <el-col :span="24" class='table-data' stripe>
          <el-table
            :data="specData">
            <el-table-column prop="name" label="规格名称(销售属性)"></el-table-column>
            <el-table-column prop="value" label="规格值(销售属性)"></el-table-column>
          </el-table>
        </el-col>
        <h4>库存价格管理</h4>
        <el-col :span="24" class='table-data' stripe>
          <el-table
            :data="stockData">
            <el-table-column prop="color" label="颜色"></el-table-column>
            <el-table-column prop="value" label="尺码"></el-table-column>
            <el-table-column prop="sellPrice" label="销售价(元)"></el-table-column>
            <el-table-column prop="origPrice" label="原价(元)"></el-table-column>
            <el-table-column prop="stock" label="库存"></el-table-column>
            <el-table-column prop="img" label="图片"></el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-col>
    <!--商品批次-->
    <el-col :span="18" class='user-detail-right'>
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
                <el-button type="text" size="small">{{scope.row.status.indexOf('启用') >= 0 ? '禁用' : '启用'}}</el-button>
                <el-button  type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-col>
    <!--图文详情-->
    <el-col :span="18" class='user-detail-right'>
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
          <img :src="avatar" ref="goodsImg">
        </div>
      </el-card>
    </el-col>
    <!--    基本信息编辑弹框-->
    <i-edit
      :dialog-visible="editProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    />
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
      @on-save-success="handleSave">
    </i-create-spec>
    <!--    添加商品批次弹框-->
    <i-create-batch
      :dialog-visible="createBatchProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave">
    </i-create-batch>
    <!--      <el-dialog-->
    <!--        title="查看图片"-->
    <!--        :visible.sync="imgVisible"-->
    <!--        :modal-append-to-body='false'-->
    <!--        width="50%"-->
    <!--        :before-close="handleClose">-->
    <!--        <img :src="'https://www.gunghobox.com/images/'+manager.avatar" alt="" width="100%">-->
    <!--      </el-dialog>-->
  </div>
</template>

<script>
  // import {get, enable, disable, findById} from '@/project/service/user'
  import { get } from '@/project/service/manager'
  import textEdit from './textEdit'
  import IEdit from './edit'
  import ICreateSpec from './createSpec' // 添加商品规格弹框组件
  import ICreateBatch from './createBatch' // 添加商品批次弹框组件
  import search from '@/framework/components/search'
  export default {
    name: "goodsDetail",
    components: {
      IEdit, ICreateSpec, ICreateBatch, textEdit, search
    },
    data() {
      return {
        manager: {},
        id: this.$route.params.id,
        textEditId: 0,
        activeName: 'first',
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
        // 分页组件参数
        pageSize: 10,
        page: 1,
        total: 0,
        imgSrc: [
          'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
          'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
          'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
          'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
          'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
        ],
        // 商品规格数据列表
        specData: [
          {
            name: '颜色',
            value: '黑色;白色'
          },
          {
            name: '尺码',
            value: 'S;M;L;XL'
          }
        ],
        // 库存数据列表
        stockData: [
          {
            color: '黑色',
            size: 'M',
            sellPrice: 10.00,
            origPrice: 20.00,
            stock: 999,
            img: ''
          }
        ],
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
        avatar: '',
        data: []
      }
    },
    created() {
      this.get();
    },
    methods: {
      get() {
        get({id: this.id}, res => {
          this.avatar = `${this.$store.state.prefix}${res.avatar}`
        });
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
      },
      handleSave() {}
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
      .img {
        margin-right:5px;
        width: 50px;
        height: auto;
      }
    }
  }
</style>
