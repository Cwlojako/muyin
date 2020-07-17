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
              :disabled="selectList.some(s => s.status === '启用') || selectList.length === 0"
              :style="(selectList.some(s=> s.status === '启用') || selectList.length === 0)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
              @click="batchEnable"
            >
              上架
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-circle-close"
              command="下架"
              :disabled="selectList.some(s => s.status === '禁用') || selectList.length === 0"
              :style="(selectList.some(s=> s.status === '禁用') || selectList.length === 0)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
              @click.stop="batchDisable"
            >
              下架
            </el-dropdown-item>
            <el-dropdown-item
              command="设置推荐"
              :disabled="selectList.some(s => s.recommend === '推荐') || selectList.length === 0"
              :style="(selectList.some(s=> s.recommend === '推荐') || selectList.length === 0)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
              @click="batchRecommend"
            >
              设置推荐
            </el-dropdown-item>
            <el-dropdown-item
              command="取消推荐"
              :disabled="selectList.some(s => s.recommend === '未推荐') || selectList.length === 0"
              :style="(selectList.some(s=> s.recommend === '未推荐') || selectList.length === 0)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
              @click.stop="batchDisRecommend"
            >
              取消推荐
            </el-dropdown-item>
            <el-dropdown-item
              command="设置热门"
              :disabled="selectList.some(s => s.hot === '热门') || selectList.length === 0"
              :style="(selectList.some(s=> s.hot === '热门') || selectList.length === 0)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
              @click="batchHot"
            >
              设置热门
            </el-dropdown-item>
            <el-dropdown-item
              command="取消热门"
              :disabled="selectList.some(s => s.hot === '未热门') || selectList.length === 0"
              :style="(selectList.some(s=> s.hot === '未热门') || selectList.length === 0)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
              @click.stop="batchDisHot"
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
              {{scope.row.username}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="商品分类"></el-table-column>
        <el-table-column prop="brand" label="商品品牌"></el-table-column>
        <el-table-column prop="price" label="售价(元)"  width="120" sortable></el-table-column>
        <el-table-column prop="sort" label="排序数值"  width="120" sortable></el-table-column>
        <el-table-column prop="number" label="销量" width="120" sortable></el-table-column>
        <el-table-column prop="createAt"  label="更新时间" width="160" sortable></el-table-column>
        <el-table-column prop="rStatus" label="推荐状态"></el-table-column>
        <el-table-column prop="hStatus" label="热卖状态"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column width='120' label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button @click.stop="handleStatusChange(scope.row)" type="text" size="small">{{scope.row.status.indexOf('启用') >= 0 ? '下架' : '上架'}}</el-button>
            <el-button @click.stop="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
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
  // user接口
  import {search, count, del, enable, disable} from '@/project/service/manager'

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
        menu: {
          visible: false
        },
        editId: 0,//编辑id
        data: [],
        selectList: [],
        sort: {asc: [], desc: []},
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
            type: "string"
          },
          {
            name: "商品分类",
            key: "category",
            type: "string"
          },
          {
            name: "更新时间",
            key: "updateTime",
            type: "datetimerange"
          }
        ]
      };
    },
    computed: {
      route() {
        return this.$route;
      }
    },
    components: {
      Search, ICreate
    },
    methods: {
      handleEdit(row) {
        this.$router.push(`/${this.model}/show/` + row.id)
      },
      // 控制启禁用
      handleStatusChange(row) {
        let status;
        let _t = this;
        if (row.status.indexOf('启用') >= 0) {
          status = '下架'
        } else {
          status = '上架'
        }
        this.$confirm(`确定${status}选中内容？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status === '下架') {
            disable({id: row.id}, res => {
              _t.$message({
                type: 'success',
                message: '下架成功!'
              });
              _t.search(_t.page);
            })
          } else {
            enable({id: row.id}, res => {
              _t.$message({
                type: 'success',
                message: '上架成功!'
              });
              _t.search(_t.page);
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
        let _t = this;
        _t.page = page;
        let param = {
          pageable: {
            page: page,
            size: _t.pageSize,
            sort: _t.sort
          },
          manager: _t.extraParam
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
        let param = {manager: _t.extraParam};
        count(param, res => {
          _t.total = parseInt(res);
        });
      },

      handleTransportSelectList(list) {
        this.selectList = list;
      },

      //批量上架
      batchEnable() {
        let _t = this;
        let selectList = this.selectList;
        this.$confirm('确定上架所选的商品吗?', '上架提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            enable({id: s.id}, res => {
              _t.search(_t.page);
              this.$message({
                type: 'success',
                message: '上架成功!'
              });
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      //批量下架
      batchDisable() {
        let _t = this;
        let selectList = this.selectList;
        this.$confirm('确定下架所选的商品吗?', '下架提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            disable({id: s.id}, res => {
              _t.search(_t.page);
              this.$message({
                type: 'success',
                message: '下架成功!'
              });
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      //批量设置推荐
      batchRecommend() {},

      //批量取消推荐
      batchDisRecommend() {},

      //批量设置热门
      batchHot() {},

      //批量取消热门
      batchDisHot() {},

      enable(id, url) {
        let _t = this;
        post(url, {id: id}, res => {
          _t.search(_t.page);
        });
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
          case '启用':
            this.batchEnable();
            break;
          case '禁用':
            this.batchDisable();
            break;
        }
      }
    },
    mounted() {
      this.search(1);
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
