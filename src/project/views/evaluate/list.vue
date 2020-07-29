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
              :disabled="selectList.some(item => item.enabled)"
              :style="selectList.some(item => item.enabled)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
              @click="batchEnable"
            >
              启用
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-circle-close"
              command="禁用"
              :disabled="selectList.some(item => !item.enabled)"
              :style="selectList.some(item => !item.enabled)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}"
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
              {{scope.row.account.nickname}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="order" label="订单号"></el-table-column>
        <el-table-column prop="product" label="商品名称"></el-table-column>
        <el-table-column prop="scores" label="评价星级" width="120" align='center'>
          <template slot-scope="scope">
            <i class="el-icon-star-on" v-for='item in scope.row.scores'></i>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容"></el-table-column>
        <el-table-column prop="createTime" label="评价时间" sortable width="180"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.enabled ? '启用' : '禁用'}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click.stop="handleStatusChange(scope.row)" type="text" size="small">{{scope.row.enabled ? '禁用' : '启用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import { post } from "@/framework/http/request";
  import Emitter from '@/framework/mixins/emitter'
  import { search, count, disable, enabled } from '@/project/service/evaluation'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "evaluate",
        data: [],
        selectList: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        searchItems: [
          {
            name: "商品名称",
            key: "product",
            type: "string"
          },
          {
            name: "状态",
            key: "enabled",
            type: "select",
            displayValue: ["禁用", "启用"],
            value: ["禁用", "启用"]
          },
          {
            name: "评论时间",
            key: "createTime",
            type: "datetimerange"
          },
          {
            name: "评价星级",
            key: "scores",
            type: "select",
            displayValue: ["1星", "2星", "3星", "4星", "5星"],
            value: ["1", "2", "3", "4", "5"]
          }
        ],
        createTimeParam: {}
      };
    },
    components: {
      Search
    },
    methods: {
      // 控制启禁用
      handleStatusChange(row) {
        let status = row.enabled ? '禁用' : '启用';
        this.$confirm(`确定${status}选中内容？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status === '禁用') {
            disable({id: row.id}, res => {
              this.$message({
                type: 'success',
                message: '已禁用!'
              });
              this.search(this.page);
            })
          } else {
            enabled({id: row.id}, res => {
              this.$message({
                type: 'success',
                message: '已启用!'
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
            // 处理状态参数
            if (keys[i] === 'enabled') {
              this.extraParam[keys[i]] = searchItems[keys[i]] === '启用'
            }
            // 分数
            if (keys[i] === 'scores') {
              this.extraParam[keys[i]] = parseInt(searchItems[keys[i]])
            }
            if (keys[i] === 'createTime') delete this.extraParam[keys[i]]
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        // 处理评论时间参数
        if (searchItems.createTime) {
          this.createTimeParam = {
            'start': searchItems.createTime[0],
            'end': searchItems.createTime[1]
          }
        } else {
          delete this.createTimeParam
        }
        this.search(1);
      },

      search(page) {
        this.page = page;
        let param = {
          pageable: {
            page: page,
            size: this.pageSize,
            desc: 'id'
          },
          evaluation: this.extraParam,
          createTime: this.createTimeParam
        };
        if (JSON.stringify(param.createTime) === "{}") delete param.createTime
        search(param, res => {
          this.data = res;
          this.getTotal();
        });
      },

      getTotal() {
        let param = {
          evaluation: this.extraParam,
          createTime: this.createTimeParam
        }
        if (JSON.stringify(param.createTime) === "{}") delete param.createTime
        count(param, res => {
          this.total = parseInt(res);
        });
      },

      toCreate() {
        this.createProps.visible = true;
      },

      //批量启用
      batchEnable() {
        let selectList = this.selectList;
        this.$confirm('确定启用所选的记录吗?', '启用提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            enabled({id: s.id}, res => {
              this.search(this.page);
            })
          })
          this.$message({
            type: 'success',
            message: '启用成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      //批量禁用
      batchDisable() {
        let selectList = this.selectList;
        this.$confirm('确定禁用所选的记录吗?', '禁用提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            disable({id: s.id}, res => {
              this.search(this.page);
            })
          })
          this.$message({
            type: 'success',
            message: '禁用成功!'
          });
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
