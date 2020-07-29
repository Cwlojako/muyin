<template>
  <el-row class="page">
    <!--    搜索-->
    <el-col :span="24">
      <search
        style="width: 95%;margin: 10px auto"
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
    </el-col>
    <!--    按钮和分页-->
    <el-col :span="24">
      <div style="width: 95%;margin: 10px auto;">
        <el-button style="background: rgb(0, 161, 108);border: none" icon="el-icon-plus" type="primary" @click="toCreate">新建</el-button>
        <el-dropdown :trigger="'click'" @command="handleClick" size="medium" @visible-change="onMenuChange">
          <el-button icon="el-icon-menu" style="background:#3e5265;color: white;">
            更多操作
            <i class="el-icon-caret-bottom" ref="rotate"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="el-icon-circle-check"
              command="上架"
              :disabled="selectList.some(item => item.sellable)"
              :style="selectList.some(item => item.sellable) ? {'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
            >
              上架
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-circle-close"
              command="下架"
              :disabled="selectList.some(item => !item.sellable)"
              :style="selectList.some(item => !item.sellable)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
            >
              下架
            </el-dropdown-item>
            <el-dropdown-item
              command="设置推荐"
              :disabled="selectList.some(item => item.featured)"
              :style="selectList.some(item => item.featured)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
            >
              设置推荐
            </el-dropdown-item>
            <el-dropdown-item
              command="取消推荐"
              :disabled="selectList.some(item => !item.featured)"
              :style="selectList.some(item => !item.featured)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
            >
              取消推荐
            </el-dropdown-item>
            <el-dropdown-item
              command="设置热门"
              :disabled="selectList.some(item => item.salable)"
              :style="selectList.some(item => item.salable)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
            >
              设置热门
            </el-dropdown-item>
            <el-dropdown-item
              command="取消热门"
              :disabled="selectList.some(item => !item.salable)"
              :style="selectList.some(item => !item.salable)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
            >
              取消热门
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
      </div>
    </el-col>
    <!--    表格-->
    <el-col :span="24">
      <el-table
        :data="data"
        style="width: 95%;margin:0 auto;"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowClick"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.name}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="商品分类"></el-table-column>
        <el-table-column prop="brand" label="商品品牌"></el-table-column>
        <el-table-column prop="salePrice" label="售价(元)"  width="120" sortable></el-table-column>
        <el-table-column prop="position" label="排序数值"  width="120" sortable></el-table-column>
        <el-table-column prop="sales" label="销量" width="120" sortable></el-table-column>
        <el-table-column prop="updateTime"  label="更新时间" width="160" sortable></el-table-column>
        <el-table-column label="推荐状态">
          <template slot-scope="scope">
            {{scope.row.featured ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column label="热卖状态">
          <template slot-scope="scope">
            {{scope.row.salable ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
           {{scope.row.sellable ? '上架中' : '下架中'}}
          </template>
        </el-table-column>
        <el-table-column width='120' label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button @click.stop="handleSellable(scope.row)" type="text" size="small">{{scope.row.sellable ? '下架' : '上架'}}</el-button>
            <el-button @click.stop="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      :brand-options="brandOptions"
      :category-options="categoryOptions"
      :stage-options="stageOptions"
      @on-dialog-close="handleClose"
      @onRefreshData='search(page)'
    />

<!--    &lt;!&ndash;    编辑&ndash;&gt;-->
<!--    <i-edit-->
<!--      :dialog-visible="editProps.visible"-->
<!--      :edit-id="editId"-->
<!--      @on-dialog-close="handleClose"-->
<!--    />-->


  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import ICreate from "./create"
  // import IEdit from "./edit"
  import {post} from "@/framework/http/request";
  import Emitter from '@/framework/mixins/emitter'
  import {search, count, enableSellable, disableSellable, enableSalable, disableSalable, enableFeatured, disableFeatured} from '@/project/service/product'
  import { searchBrand } from '@/project/service/brand'
  import { searchCategory } from '@/project/service/category'
  import { searchStage } from '@/project/service/stage'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "goods",
        createProps: {
          visible: false
        },
        editProps: {
          visible: false
        },
        editId: 0,//编辑id
        data: [],
        selectList: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        searchItems: [
          {
            name: "商品名称",
            key: "name",
            type: "string"
          },
          {
            name: "商品品牌",
            key: "brand",
            type: "select",
            displayValue: [],
            value: []
          },
          {
            name: "商品分类",
            key: "category",
            type: "select",
            displayValue: [],
            value: []
          },
          {
            name: "更新时间",
            key: "updateTime",
            type: "datetimerange"
          }
        ],
        brandOptions: [],
        categoryOptions: [],
        stageOptions: []
      }
    },
    components: {
      Search, ICreate
    },
    methods: {
      handleEdit(row) {
        this.$router.push(`/${this.model}/show/` + row.id)
      },
      // 控制上下架
      handleSellable(row) {
        let status = row.sellable ? '下架' : '上架'
        this.$confirm(`确定${status}选中商品？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status === '下架') {
            disableSellable({id: row.id}, res => {
              this.$message({
                type: 'success',
                message: '下架成功!'
              });
              this.search(this.page);
            })
          } else {
            enableSellable({id: row.id}, res => {
              this.$message({
                type: 'success',
                message: '上架成功!'
              });
              this.search(this.page);
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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

      toCreate() {
        this.createProps.visible = true;
      },

      search(page) {
        this.page = page;
        let param = {
          pageable: {
            page: page,
            size: this.pageSize
          },
          product: this.extraParam
        };
        search(param, res => {
          this.data = res;
          this.getTotal();
        });
      },

      getTotal() {
        let param = {product: this.extraParam};
        count(param, res => {
          this.total = parseInt(res);
        });
      },

      handleTransportSelectList(list) {
        this.selectList = list;
      },

      //批量上架
      batchEnableSellable() {
        let selectList = this.selectList;
        this.$confirm('确定上架所选的商品吗?', '上架提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            enableSellable({id: s.id}, res => {})
          })
          this.search(this.page)
          this.$message({
            type: 'success',
            message: '上架成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },

      //批量下架
      batchDisableSellable() {
        let selectList = this.selectList;
        this.$confirm('确定下架所选的商品吗?', '下架提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            disableSellable({id: s.id}, res => {})
          })
          this.search(this.page)
          this.$message({
            type: 'success',
            message: '下架成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },

      //批量设置推荐
      batchEnableFeatured() {
        let selectList = this.selectList;
        this.$confirm('确定设置所选商品为推荐商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            enableFeatured({id: s.id}, res => {})
          })
          this.search(this.page)
          this.$message({
            type: 'success',
            message: '设置成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },

      //批量取消推荐
      batchDisableFeatured() {
        let selectList = this.selectList;
        this.$confirm('确定取消所选商品为推荐商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            disableFeatured({id: s.id}, res => {})
          })
          this.search(this.page)
          this.$message({
            type: 'success',
            message: '取消成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },

      //批量设置热门
      batchEnableSalable() {
        let selectList = this.selectList;
        this.$confirm('确定设置所选商品为推荐商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            enableSalable({id: s.id}, res => {})
          })
          this.search(this.page)
          this.$message({
            type: 'success',
            message: '设置成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },

      //批量取消热门
      batchDisableSalable() {
        let selectList = this.selectList;
        this.$confirm('确定取消所选商品为推荐商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            disableSalable({id: s.id}, res => {})
          })
          this.search(this.page)
          this.$message({
            type: 'success',
            message: '取消成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },

      handleClose() {
        this.createProps.visible = false;
        this.editProps.visible = false;
      },

      handleSelectionChange(val) {
        this.selectList = val;
      },

      handleRowClick(row) {
        this.editId = row.id;
        this.editProps.visible = true;
      },

      toDetail(row){
        this.$router.push({path: `/${this.model}/show/`+ row.id})
      },

      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },

      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(this.page);
      },

      handleClick(command) {
        switch (command) {
          case '编辑':
            this.editId = this.selectList[0].id;
            this.editProps.visible = true;
            break;
          case '上架':
            this.batchEnableSellable()
            break;
          case '下架':
            this.batchDisableSellable()
            break;
          case '设置推荐':
            this.batchEnableFeatured()
            break;
          case '取消推荐':
            this.batchDisableFeatured()
            break
          case '设置热门':
            this.batchEnableSalable()
            break;
          case '取消热门':
            this.batchDisableSalable()
            break
        }
      },
      
      // 获取商品品牌可选项
      getBrandOption() {
        searchBrand({brand: {}}, res => {
          this.brandOptions = res
          let value = []
          res.forEach(item => {
            value.push(item.name)
          })
          this.searchItems.find(item => item.key === 'brand').displayValue = value
          this.searchItems.find(item => item.key === 'brand').value = value
        })
      },
      // 获取商品一级分类可选项
      getCategoryOption() {
        searchCategory({child: {}}, res => {
          this.categoryOptions = res
          let value = []
          res.forEach(item => {
            value.push(item.name)
          })
          this.searchItems.find(item => item.key === 'category').displayValue = value
          this.searchItems.find(item => item.key === 'category').value = value
        })
      },
      // 获取喂养阶段可选项
      getFeedLevelOption() {
        searchStage({stage: {}}, res => {
          this.stageOptions = res
        })
      }
    },
    mounted() {
      this.search(1);
      // 获取商品品牌可选项
      this.getBrandOption()
      // 获取商品一级分类可选项
      this.getCategoryOption()
      // 获取喂养阶段可选项
      this.getFeedLevelOption()
    }
  };
</script>
<style lang="less" scoped>
  .page {
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-button+.el-button{
    margin-left: 2px;
  }
  .el-button--default:hover{
    color: #00a16c;
    border: 1px solid#00a16c;
    background: white;
  }
  .footor{
    margin:10px 30px;
    width: 90%;
    text-align: right;
  }
  .el-icon-caret-bottom {
    transition: all .3s ease;
  }
</style>
