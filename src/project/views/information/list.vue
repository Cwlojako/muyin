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
        <el-button style="background: rgb(0, 161, 108);border: none" icon="el-icon-plus" type="primary" @click="toCreate">新建
        </el-button>
        <el-dropdown :trigger="'click'" @command="handleClick" size="medium" @visible-change="onMenuChange">
          <el-button icon="el-icon-menu" style="background:#3e5265;color: white">
            更多操作<i class="el-icon-caret-bottom" ref="rotate" style="transition: all .3s;"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="el-icon-edit"
              command="编辑"
              :disabled="selectList.length !== 1"
              :style="(selectList.length !== 1)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}">
              编辑
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-circle-check"
              command="启用"
              :disabled="selectList.some(item => item.enabled)"
              :style="selectList.some(item => item.enabled)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}">
              启用
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-circle-close"
              command="禁用"
              :disabled="selectList.some(item => !item.enabled)"
              :style="selectList.some(item => !item.enabled)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}">
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
        @row-dblclick="handleRowClick">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="文章标题">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.title}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="handleStatusChange(scope.row)"
              type="text"
              size="small">
              {{scope.row.enabled ? '禁用' : '启用'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    />

    <!--    编辑-->
    <i-edit
      :dialog-visible="editProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
      :editId="editId"
    />
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import IEdit from "./edit"
  import ICreate from "./create"
  import Emitter from '@/framework/mixins/emitter'
  import {search, count, updateEnable, batchUpdateEnable} from '@/project/service/article'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "article",
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
            name: "文章标题",
            key: "title",
            type: "string",
          },
          {
            name: "关键字",
            key: "keyword",
            type: "string",
          },
          {
            name: "创建时间",
            key: "createTime",
            type: "datetimerange"
          },
          {
            name: "状态",
            key: "enabled",
            type: "select",
            displayValue: ["禁用", "启用"],
            value: ["禁用", "启用"]
          }
        ],
        // 时间范围搜索条件
        createTimeParam: {},
      };
    },
    components: {
      Search, IEdit, ICreate
    },
    methods: {
      handleStatusChange(row) {
        let status = row.enabled ? '禁用' : '启用'
        this.$confirm(`确定${status}选中内容？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status === '禁用') {
            updateEnable({id: row.id, enable: false}, res => {
              this.$message({
                type: 'success',
                message: '已禁用!'
              });
              this.search(this.page);
            })
          } else {
            updateEnable({id: row.id, enable: true}, res => {
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
            if (keys[i] === 'createTime') delete this.extraParam[keys[i]]
            // 处理状态参数
            if (keys[i] === 'enabled') {
              this.extraParam[keys[i]] = searchItems[keys[i]] === '启用'
            }
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        // 处理创建时间参数
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
            asc: 'id'
          },
          [this.model]: this.extraParam,
          createTime: this.createTimeParam
        };
        // 如果参数不需要则清除
        if (JSON.stringify(param.createTime) === "{}") delete param.createTime
        search(param, res => {
          this.data = res;
          this.getTotal();
        });
      },
      getTotal() {
        let param = {
          [this.model]: this.extraParam,
          createTime: this.createTimeParam
        }
        // 如果参数不需要则清除
        if (JSON.stringify(param.createTime) === "{}") delete param.createTime
        count(param, res => {
          this.total = parseInt(res);
        });
      },
      //批量启用
      batchEnable() {
        let selectList = this.selectList;
        let idList = []
        this.selectList.forEach(item => {
          idList.push(item.id)
        })
        this.$confirm('确定启用所选的记录吗?', '启用提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchUpdateEnable({idList, enable: true}, res => {
            this.search(1)
            this.$message({
              type: 'success',
              message: '启用成功!'
            });
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
        let selectList = this.selectList;
        let idList = []
        this.selectList.forEach(item => {
          idList.push(item.id)
        })
        this.$confirm('确定禁用所选的记录吗?', '禁用提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchUpdateEnable({idList, enable: false}, res => {
            this.search(1)
            this.$message({
              type: 'success',
              message: '禁用成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      handleClose() {
        this.createProps.visible = false;
        this.editProps.visible = false;
      },
      handleSave() {
        this.createProps.visible = false;
        // 重新获取数据
        this.search(this.page);
      },
      handleSelectionChange(val) {
        this.selectList = val;
      },
      handleRowClick(row) {
        this.editId = row.id;
        this.createProps.visible = true;
      },
      toDetail(row){
        this.$router.push({path: `show/` + row.id})
      },
      toCreate() {
        console.log('create')
        this.createProps.visible = true;
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
            this.batchEnable()
            break;
          case '禁用':
            this.batchDisable()
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
</style>
