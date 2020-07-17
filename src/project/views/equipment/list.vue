<template>
  <el-row>
    <el-col style="margin:10px 1%;width: 98%;">
      <el-tabs type="border-card" @tab-click="handleTabClick">
        <el-tab-pane v-for="(item,index) in labelItem" :key="index" :label='item'>
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
                <el-button style="background: rgb(0, 161, 108);border: none" icon="el-icon-plus"  type="primary" @click="toCreate">导入</el-button>
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
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="设备编号"
                >
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toDetail(scope.row)"
                      type="text"
                      size="small">
                      {{scope.row.number}}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="mac"
                  label="MAC地址"
                >
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="添加时间"
                  sortable>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>

</template>
<script>
  import Search from "@/framework/components/search";
  import Emitter from '@/framework/mixins/emitter'
  import {findByType, countByType, search, count} from '@/project/service/device'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "device",
        // 搜索参数
        extraParam: {},
        editProps: {
          visible: false
        },
        labelItem: ['底座', '平板', '手环', '尿湿感应器', '体温贴片'],
        //设备编辑id
        editId: 0,
        data: [],
        selectList: [],
        pageSize: 10,
        page: 1,
        total: 0,
        messageType: '底座',
        // 时间范围搜索条件
        createAtParam: {},
        searchItems: [
          {
            name: "设备编号",
            key: "number",
            type: "string"
          },
          {
            name: "Mac地址",
            key: "mac",
            type: "string"
          },
          {
            name: "添加时间",
            key: "createAt",
            type: "datetimerange"
          }
        ]
      };
    },
    components: {
      Search
    },
    methods: {
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
            message: '已取消'
          });
        });
      },

      searchBySearchItem(searchItems) {
        let keys = [];
        for (
          let i = 0,searchItemList = this.searchItems,len = searchItemList.length;
          i < len;
          i++
        ) {
          keys.push(searchItemList[i].key);
        }

        for (let i in keys) {
          if (searchItems[keys[i]]) {
            this.extraParam[keys[i]] = searchItems[keys[i]];
            if (keys[i] === 'createAt') delete this.extraParam[keys[i]]
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        // 处理创建时间参数
        if (searchItems.createAt) {
          this.createAtParam = {
            'start': searchItems.createAt[0],
            'end': searchItems.createAt[1]
          }
        } else {
          delete this.createAtParam
        }
        this.search(1);
      },

      toCreate() {
        this.createProps.visible = true;
      },

      search(page) {
        this.page = page;
        this.extraParam.type = this.messageType;
        let param = {
          pageable: {
            page: page,
            size: this.pageSize
          },
          [this.model]: this.extraParam,
          createTime: this.createAtParam
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
          createTime: this.createAtParam
        };
        // 如果参数不需要则清除
        if (JSON.stringify(param.createTime) === "{}") delete param.createTime
        count(param, res => {
          this.total = parseInt(res);
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
              // this.$message({
              //   type: 'success',
              //   message: '删除成功!'
              // });
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
        this.$confirm('确定启用所选的记录吗?', '启用提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            disable({id: s.id}, res => {
              _t.search(_t.page);
              // this.$message({
              //   type: 'success',
              //   message: '删除成功!'
              // });
            })
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      handleClose() {
        this.editProps.visible = false;
      },

      handleSelectionChange(val) {
        this.selectList = val;
      },

      handleRowClick(row) {
        // this.editId = row.id;
        // this.createProps.visible = true;
      },

      toDetail(row) {
        this.$router.push({path: '/equipment/show/' + row.id})
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
            console.log('编辑');
            this.editId = this.selectList[0].id;
            this.editProps.visible = true;
            break;
          case '启用':
            console.log('启用');
            this.batchEnable();
            break;
          case '禁用':
            console.log('禁用')
            this.batchDisable();
            break;
        }
      },

      handleTabClick(val){
        this.createAtParam = {}
        this.extraParam = {}
        if (val.label === '底座') {
          this.messageType = '底座'
        } else if (val.label === '平板') {
          this.messageType = '平板'
        } else if (val.label === '手环') {
          this.messageType = '手环'
        } else if (val.label === '尿湿感应器') {
          this.messageType = '尿湿感应器'
        } else {
          this.messageType = '体温贴片'
        }
        this.search(this.page);
      },
    },
    created() {
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
</style>
