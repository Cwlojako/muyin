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
          <el-button icon="el-icon-menu" style="background:#3e5265;color: white ">
            更多操作
            <i class="el-icon-caret-bottom" ref="rotate" :style="{transition: 'all .3s ease'}"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="el-icon-circle-check"
              command="启用"
              :disabled="selectList.some(item => item.enabled)"
              :style="selectList.some(item => item.enabled)?{'color':'rgba(255,255,255,0.4)','cursor': 'not-allowed'}:{'color':'#fff'}"
            >
              启用
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-circle-close"
              command="禁用"
              :disabled="selectList.some(item => !item.enabled)"
              :style="selectList.some(item => !item.enabled)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}"
            >
              禁用
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-edit"
              command="编辑"
              :disabled="selectList.length !== 1"
              :style="(selectList.length !== 1)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}"
            >
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
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="疫苗名称">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.name}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="free" label="是否收费">
          <template slot-scope='scope'>
            {{scope.row.free ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="操作时间" sortable></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope='scope'>
            {{scope.row.enabled ? '启用' : '禁用'}}
          </template>
        </el-table-column>
        <!--        操作-->
        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click.stop="updateEnable(scope.row)" type="text" size="small">{{scope.row.enabled ? '禁用' : '启用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
      @refreshData='search(1)'
    />

    <!--    编辑-->
    <i-edit
      :dialog-visible="editProps.visible"
      :id="editId"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
      @refreshData='search(1)'
    />
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import ICreate from "./create"
  import IEdit from "./edit"
  import Emitter from '@/framework/mixins/emitter'
  import { search, count, batchUpdateEnable } from '@/project/service/vaccine'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "vaccine",
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
            name: "疫苗名称",
            key: "name",
            type: "string"
          },
          {
            name: "状态",
            key: "enabled",
            type: "select",
            displayValue: ["禁用", "启用"],
            value: ["禁用", "启用"]
          }
        ]
      };
    },
    components: {
      Search, ICreate, IEdit
    },
    methods: {
      searchBySearchItem(searchItems) {
        console.log(searchItems)
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
            // 如果该单元表单中有输入查询条件,则加入到extraParams中作为请求参数
            this.extraParam[keys[i]] = searchItems[keys[i]];
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
        this.createProps.visible = true;
      },

      search(page) {
        this.page = page;
        let param = {
          pageable: {
            page: page,
            size: this.pageSize,
            asc: 'id'
          },
          [this.model]: this.extraParam
        };
        // 调用接口 查询数据
        search(param, res => {
          this.data = res;
          this.getTotal();
        });
      },

      // 获取数据总条数
      getTotal() {
        let param = {vaccine: this.extraParam};
        count(param, res => {
          this.total = parseInt(res);
        });
      },

      //批量启禁用
      batchUpdateEnable() {
        let idArr = []
        this.selectList.map(item => {
          idArr.push(item.id)
        })
        let status = this.selectList[0].enabled ? '禁用' : '启用'
        this.$confirm(`确定${status}所选的记录吗?`, `${status}提示`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchUpdateEnable({idList: idArr, enable: !this.selectList[0].enabled}, res => {
            this.search(1)
            this.$message({
              type: 'success',
              message: `${status}成功`
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        });
      },

      // 启禁用
      updateEnable(row) {
        console.log(row)
        let status = row.enabled ? '禁用' : '启用'
        this.$confirm(`确定${status}该疫苗吗?`, `${status}提示`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchUpdateEnable({idList: [row.id], enable: !row.enabled}, res => {
            this.search(1)
            this.$message({
              type: 'success',
              message: `${status}成功`
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },

      // 关闭添加 编辑弹框
      handleClose() {
        this.createProps.visible = false;
        this.editProps.visible = false;
      },

      // 处理 添加
      handleSave() {
        // 关闭
        this.createProps.visible = false;
        this.editProps.visible = false;
        // 重新获取数据
        this.search(this.page);
      },

      // 返回表格所选行
      handleSelectionChange(val) {
        this.selectList = val;
        console.log(this.selectList)
      },

      // 监听双击当前行
      handleRowClick(row) {
        this.editId = row.id;
        console.log(row.id)
        this.editProps.visible = true;
      },

      // 跳转到详情
      toDetail(row) {
        this.$router.push({path: `/vaccin/show/` + row.id})
      },

      // 监听当前页码的变化
      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },

      // 监听每页显示条目数的变化
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(this.page);
      },

      // 监听更多操作点击选择对应的操作
      handleClick(command) {
        switch (command) {
          case '编辑':
            this.editId = this.selectList[0].id;
            this.editProps.visible = true;
            break;
          case '启用':
            this.batchUpdateEnable();
            break;
          case '禁用':
            this.batchUpdateEnable();
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
