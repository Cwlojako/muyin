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
        <el-button icon="el-icon-delete" @click="batchDelete">删除</el-button>
        <el-dropdown :trigger="'click'" @command="handleClick" size="medium" @visible-change="onMenuChange">
          <el-button icon="el-icon-menu" style="background:#3e5265;color: white ">更多操作<i :class="menu.visible?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="el-icon-edit"
              command="编辑"
              :disabled="selectList.length !== 1"
              :style="(selectList.length !== 1)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}"
              @click="handleEdit">
              编辑
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
        <el-table-column sortable="custom" prop="effectAt" label="开始时间"></el-table-column>
        <el-table-column sortable="custom" prop="expireAt" label="结束时间"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="changeStatus(scope.row)"
              type="text"
              size="small">
              {{scope.row.status.indexOf('启用') >= 0 ? '禁用' : '启用'}}
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
    <i-edit
      :dialog-visible="editProps.visible"
      :id="editId"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    />
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import IEdit from "./edit"
  import ICreate from "./create"
  import Emitter from '@/framework/mixins/emitter'
  import {search, count, del, enable, disable,getCategory} from '@/project/service/slide' //接口

  export default {
    name:'advertisement',
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
            key:'status',
            type: "select",
            displayValue: ['启用','禁用'],
            value: ['启用','禁用']
          }
        ]
      };
    },
    created() {
      this.$store.dispatch('GET_USER_CACHE')
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
          let _t = this;
          if (selectList.length === 0) {
            this.$notify.warning({
              title: "至少选择一条数据"
            });
            return;
          }
          this.$confirm('确定删除所选记录吗?', '删除提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            selectList.forEach((item,index)=>{
              del({id: item.id}, res => {
                if(index === selectList.length-1){
                  _t.search(_t.page);
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }
              });
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
        this.editId=0;
        this.createProps.visible = true;
      },

      // 通过接口获取数据
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

        search(param, res => {
          let data = res;
          _t.data = data;
          _t.getTotal();
        });
      },

      // 通过接口获取数据总条数
      getTotal() {
        let _t = this;
        let param = {
          [this.model] : this.extraParam
        }

        count(param, res => {
          _t.total = parseInt(res);
        });
      },

      handleTransportSelectList(list) {
        this.selectList = list;
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
        this.$confirm('确定禁用所选的记录吗?', '启用提示', {
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

      // 删除广告
      delete(id) {
        let _t = this;
        del({id: id}, res => {
          _t.search(_t.page);
        });
      },

      // 单独启用
      enable(id) {
        let _t = this;
        enable({id: id}, res => {
          _t.search(_t.page);
        });
      },
      // 单独禁用
      disable(id) {
        let _t = this;
        disable({id: id}, res => {
          _t.search(_t.page);
        });
      },

      handleClose() {
        this.createProps.visible = false;
        this.editProps.visible = false;
      },

      handleSave() {
        this.createProps.visible = false;
        this.search(this.page);
      },

      // 选中行
      handleSelectionChange(val) {
        this.selectList = val;
      },

      // 双击行
      handleRowClick(row) {
        // print(this.id);
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

      onMenuChange(val) {
        console.log(val);
      },
      handleClick(command) {
        switch (command) {
          case '编辑':
            this.editId = this.selectList[0].id;
            this.createProps.visible = true;
            break;
        }
      },
      changeStatus(row) {
        switch (row.status) {
          case '启用' :
            this.disable(row.id)
            break
          case '禁用' :
            this.enable(row.id)
            break
        }
      }
    }
  };
</script>
<style lang="less" scoped>
</style>
