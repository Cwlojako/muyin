<template>
  <el-row class="page">
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
              command="编辑"
              :disabled="selectList.length !== 1"
              :style="(selectList.length !== 1)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}"
            >
              编辑
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-delete"
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
        <el-table-column label="阶段名称">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.name}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="days" label="初始年龄">
          <template slot-scope="scope">
            {{scope.row.days}}天
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @refreshData='search(1)'
    />

    <!--    编辑-->
    <i-edit
      :dialog-visible="editProps.visible"
      :id="editId"
      @on-dialog-close="handleClose"
      @refreshData='search(page)'
    />
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import ICreate from "./create"
  import IEdit from "./edit"
  import Emitter from '@/framework/mixins/emitter'
  import { search, deleteById, count, del } from '@/project/service/stage'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "stage",
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
      };
    },
    components: {
      Search, ICreate, IEdit
    },
    methods: {
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
          [this.model]: {}
        };
        search(param, res => {
          this.data = res;
          this.getTotal();
        });
      },
      getTotal() {
        let param = {[this.model]: {}};
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
            del({id: s.id}, res => {
              this.search(this.page);
            })
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      handleDelete(id) {
        this.$confirm('确定删除该阶段吗?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteById({id: id}, res => {
            this.search(this.page);
            this.$message({
              type: 'success',
              message: '删除成功!'
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

      handleSelectionChange(val) {
        this.selectList = val;
      },

      toDetail(row){
        this.editId = row.id
        this.editProps.visible = true
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
          case '删除':
            this.batchDelete();
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
