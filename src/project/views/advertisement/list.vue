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
        <el-button style="background: rgb(0, 161, 108);border: none" icon="el-icon-plus"  type="primary" @click="toCreate">新建</el-button>
        <el-dropdown :trigger="'click'" @command="handleClick" size="medium" @visible-change="onMenuChange">
          <el-button icon="el-icon-menu" style="background:#3e5265;color: white;">
            更多操作
            <i class="el-icon-caret-bottom" ref="rotate"></i>
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
              icon="el-icon-delete"
              command="删除"
              :disabled="selectList.length === 0"
              :style="(selectList.length === 0)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}">
              删除
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
        <el-table-column label="广告标题">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.title}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="广告位"></el-table-column>
        <el-table-column prop="position" label="排列数字"></el-table-column>
        <el-table-column sortable prop="effectiveTime" label="开始时间"></el-table-column>
        <el-table-column sortable prop="expirationTime" label="结束时间"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
              {{scope.row.enabled ? '启用' : '禁用'}}
          </template>
        </el-table-column>
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
      @onRefreshData="search(page)"
    />
    <i-edit
      :dialog-visible="editProps.visible"
      :id="editId"
      @on-dialog-close="handleClose"
      @onRefreshData="search(page)"
    />
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import IEdit from "./edit"
  import ICreate from "./create"
  import Emitter from '@/framework/mixins/emitter'
  import {search, count, deleteById, enable, disable} from '@/project/service/slide'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "slide",
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
            name: "广告标题",
            key: "title",
            type: "string"
          },
          {
            name: "广告位",
            key: "location",
            type: "select",
            displayValue: ['首页banner图','商城banner图','直播banner图'],
            value: ['首页banner图','商城banner图','直播banner图']
          },
          {
            name:'状态',
            key:'enabled',
            type: "select",
            displayValue: ['启用','禁用'],
            value: ['启用','禁用']
          }
        ]
      };
    },
    created() {
      this.search(1);
    },
    components: {
      Search,
      ICreate,
      IEdit
    },
    methods: {
      //批量删除
      batchDelete() {
        this.$nextTick(() => {
          let selectList = this.selectList;
          if (selectList.length === 0) {
            this.$message.warning({
              title: "至少选择一条数据"
            });
            return;
          }
          this.$confirm('确定删除所选记录吗?', '删除提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            selectList.forEach(item => {
              deleteById({id: item.id}, res => {
                this.search(this.page);
              })
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        });
      },

      handleEdit() {
        this.editId = this.selectList[0].id
        this.editProps.visible = true;
      },

      // 控制启禁用
      handleStatusChange(row) {
        let status = row.enabled ? '禁用' : '启用'
        this.$confirm(`确定${status}选中内容？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status === '禁用') {
            disable({id: row.id}, res => {
              this.$message({
                type: 'success',
                message: '禁用成功!'
              })
              this.search(this.page)
            })
          } else {
            enable({id: row.id}, res => {
              this.$message({
                type: 'success',
                message: '启用成功!'
              })
              this.search(this.page)
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
            this.extraParam[keys[i]] = searchItems[keys[i]]
            // 处理状态参数
            if (keys[i] === 'enabled') {
              this.extraParam[keys[i]] = searchItems[keys[i]] === '启用'
            }
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        this.search(1);
      },
      toCreate() {
        this.editId = 0;
        this.createProps.visible = true;
      },

      // 通过接口获取数据
      search(page) {
        this.page = page
        let param = {
          pageable: {
            page: page,
            size: this.pageSize
          },
          [this.model]: this.extraParam
        }
        search(param, res => {
          this.data = res
          this.getTotal()
        });
      },

      // 通过接口获取数据总条数
      getTotal() {
        let param = {
          [this.model] : this.extraParam
        }
        count(param, res => {
          this.total = parseInt(res);
        });
      },

      handleTransportSelectList(list) {
        this.selectList = list;
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
            enable({id: s.id}, res => {
              this.search(this.page)
            })
          })
          this.$message({
            type: 'success',
            message: '启用成功!'
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
        this.$confirm('确定禁用所选的记录吗?', '启用提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            disable({id: s.id}, res => {
              this.search(this.page)
            })
          })
          this.$message({
            type: 'success',
            message: '禁用成功!'
          })
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

      // 选中行
      handleSelectionChange(val) {
        this.selectList = val;
      },

      // 双击行
      handleRowClick(row) {
        this.editId = row.id;
        this.editProps.visible = true;
      },

      // 去往详情页
      toDetail(row) {
        this.$router.push({path: `show/` + row.id})
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
            console.log(this.editId)
            this.editProps.visible = true
            break;
          case '删除':
            this.batchDelete()
            break;
        }
      }
    }
  };
</script>
<style lang="less" scoped>
</style>
