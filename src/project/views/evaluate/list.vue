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
        <el-dropdown :trigger="'click'" @command="handleClick" size="medium" @visible-change="onMenuChange">
          <el-button icon="el-icon-menu" style="background:#3e5265;color: white;">
            更多操作
            <i class="el-icon-caret-bottom" ref="rotate" style="transition: all .3s;"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="el-icon-circle-check"
              command="启用"
              :disabled="selectList.findIndex(s=>{return s.status === '启用'}) >=0 || selectList.length === 0"
              :style="(selectList.findIndex(s=>{return s.status === '启用'}) >=0 || selectList.length === 0)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
              @click="batchEnable"
            >
              启用
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-circle-close"
              command="禁用"
              :disabled="selectList.findIndex(s=>{return s.status === '禁用'}) >=0 || selectList.length === 0"
              :style="(selectList.findIndex(s=>{return s.status === '禁用'}) >=0 || selectList.length === 0)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}"
              @click.stop="batchDisable"
            >
              禁用
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
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户昵称">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.username}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="order" label="订单号"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="star" label="评价星级">
          <template slot-scope="scope">
            <i class="el-icon-star-on"></i>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容"></el-table-column>
        <el-table-column prop="createAt" label="评价时间" sortable width="180"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click.stop="handleStatusChange(scope.row)" type="text" size="small">{{scope.row.status.indexOf('启用') >= 0 ? '禁用' : '启用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import {post} from "@/framework/http/request";
  import Emitter from '@/framework/mixins/emitter'
  // user接口
  import {search, count, del, enable, disable} from '@/project/service/manager'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "evaluate",
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
            key: "username",
            type: "string"
          },
          {
            name: "状态",
            key: "status",
            type: "select",
            displayValue: ["禁用", "启用"],
            value: ["禁用", "启用"]
          },
          {
            name: "评论时间",
            key: "time",
            type: "datetimerange"
          },
          {
            name: "评价星级",
            key: "star",
            type: "select",
            displayValue: ["1星", "2星", "3星", "4星", "5星"],
            value: ["1", "2", "3", "4", "5"]
          }
        ]
      };
    },
    components: {
      Search
    },
    methods: {
      // 控制启禁用
      handleStatusChange(row) {
        let status;
        let _t = this;
        if (row.status.indexOf('启用') >= 0) {
          status = '禁用'
        } else {
          status = '启用'
        }
        this.$confirm(`确定${status}选中内容？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status === '禁用') {
            disable({id: row.id}, res => {
              _t.$message({
                type: 'success',
                message: '已禁用!'
              });
              _t.search(_t.page);
            })
          } else {
            enable({id: row.id}, res => {
              _t.$message({
                type: 'success',
                message: '已启用!'
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

      //批量启用
      batchEnable() {
        let _t = this;
        let selectList = this.selectList;
        this.$confirm('确定启用所选的记录吗?', '启用提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            enable({id: s.id}, res => {
              _t.search(_t.page);
              this.$message({
                type: 'success',
                message: '启用成功!'
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

      //批量禁用
      batchDisable() {
        let _t = this;
        let selectList = this.selectList;
        this.$confirm('确定禁用所选的记录吗?', '禁用提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            disable({id: s.id}, res => {
              _t.search(_t.page);
              this.$message({
                type: 'success',
                message: '禁用成功!'
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

      handleSelectionChange(val) {
        this.selectList = val;
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
          case '启用':
            this.batchEnable();
            break;
          case '禁用':
            this.batchDisable();
            break;
        }
      }
    },
    created() {
      this.search(1);
    }
  };
</script>
<style lang="less" scoped>
  .el-icon-star-on {
    color: orange;
    font-size: 18px;
  }
</style>