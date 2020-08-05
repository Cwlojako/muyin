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
            <i class="el-icon-caret-bottom" ref="rotate" style="transition: all .3s;"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="el-icon-edit"
              command="删除"
              :disabled="selectList.length === 0"
              :style="(selectList.length === 0)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}"
            >
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
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="关键词"></el-table-column>
        <el-table-column prop="position" label="排序数值" sortable></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click.stop="deleteById(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @onRefreshData='search(page)'
    />
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import ICreate from "./create"
  import Emitter from '@/framework/mixins/emitter'
  import {search, count, deleteById} from '@/project/service/hotword'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "hotword",
        createProps: {
          visible: false
        },
        data: [],
        selectList: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        searchItems: [
          {
            name: "关键词",
            key: "name",
            type: "string"
          }
        ]
      };
    },
    components: {
      Search, ICreate
    },
    methods: {
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
          [this.model]: this.extraParam
        };
        search(param, res => {
          this.data = res;
          this.getTotal();
        });
      },

      getTotal() {
        let param = {[this.model]: this.extraParam};
        count(param, res => {
          this.total = parseInt(res);
        });
      },

      //批量删除
      batchDelete() {
        let selectList = this.selectList;
        this.$confirm('确定删除所选的记录吗?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectList.map(s => {
            deleteById({id: s.id}, res => {
              this.search(this.page)
            })
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },

      deleteById(row) {
        console.log(row)
        this.$confirm('确定删除该条记录吗?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteById({id: row.id}, res => {
            this.$message.success('删除成功')
            this.search(this.page)
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
      },

      handleSelectionChange(val) {
        this.selectList = val;
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
          case '删除':
            this.batchDelete()
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
</style>
