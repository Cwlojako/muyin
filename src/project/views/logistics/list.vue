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
            <el-dropdown-item
              icon="el-icon-edit"
              command="编辑"
              :disabled="selectList.length !== 1"
              :style="(selectList.length !== 1)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}"
              @click.stop="handleEdit"
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
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="物流公司">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.name}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="character" label="首字母"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.enabled ? '启用' : '禁用'}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click.stop="handleStatusChange(scope.row)" type="text" size="small">{{scope.row.enabled ? '禁用' : '启用'}}</el-button>
            <el-button @click.stop="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-dialog
      :title="type === '添加' ? '添加物流公司' : '物流公司信息'"
      :visible.sync="addOrEditDialog"
      :modal-append-to-body='false'
      :append-to-body="true"
      width="40%"
      :before-close="handleClose">
      <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
        <el-form-item label="物流公司" prop="name">
          <el-input v-model="formValidate.name" placeholder="输入物流公司名称"></el-input>
        </el-form-item>
        <el-form-item label="首字母" prop="character">
          <el-select v-model="formValidate.character" placeholder="请选择首字母">
            <el-option :label='String.fromCharCode(item + 64)' :value='String.fromCharCode(item + 64)' v-for='(item, index) in 26' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司网址" prop="url">
          <el-input v-model="formValidate.url" placeholder="输入物流公司网址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type='primary' @click="handleConfirm(type)">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import Emitter from '@/framework/mixins/emitter'
  import {search, count, save, get, update,	deleteById} from '@/project/service/courier'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "courier",
        addOrEditDialog: false,
        editId: 0,
        data: [],
        selectList: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        searchItems: [
          {
            name: "物流公司",
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
        ],
        type: '添加',
        formValidate: {
          name: '',
          character: '',
          url: ''
        },
        ruleValidate: {
          name: [{required: true, message: "请输入物流公司名称", trigger: "blur"}],
          character: [{required: true, message: "请选择物流公司的首字母", trigger: "change"}]
        },
      }
    },
    components: {
      Search
    },
    methods: {
      handleConfirm(type) {
        if (type === '添加') {
          this.$refs.formValidate.validate(valid => {
            if (!valid) return false
            save({courier: this.formValidate}, res => {
              this.$message.success('添加成功')
              this.handleClose()
              this.search(this.page)
            })
          })
        } else {
          this.$refs.formValidate.validate(valid => {
            if (!valid) return false
            let param = Object.assign({id: this.editId}, this.formValidate)
            update({courier: param}, res => {
              this.$message.success('更新修改成功')
              this.handleClose()
              this.search(this.page)
            })
          })
        }
      },
      handleClose() {
        this.addOrEditDialog = false
        this.$refs.formValidate.resetFields()
      },
      handleDelete(row) {
        this.$confirm(`确定删除该物流公司吗？`, '删除提示', {
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
            message: '已取消删除'
          })
        })
      },
      toCreate() {
        this.type = '添加'
        this.addOrEditDialog = true
      },
      toDetail(row) {
        this.type = '编辑'
        this.editId = row.id
        this.addOrEditDialog = true
        get({id: this.editId}, res => {
          this.formValidate = res
        })
      },
      handleEdit() {
        this.editId = this.selectList[0].id
        this.editProps.visible = true;
      },

      // 控制启用禁用
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
              });
              this.search(this.page);
            })
          } else {
            enable({id: row.id}, res => {
              this.$message({
                type: 'success',
                message: '启用成功!'
              });
              this.search(this.page);
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },

      // 顶部搜索栏目是否有输入条件，有则把条件值都传递给extraParams,用作参数发送search请求
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
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        this.search(1);
      },

      search(page) {
        let param = {
          pageable: {
            page: page,
            size: this.pageSize
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
        let param = {[this.model]: this.extraParam};
        count(param, res => {
          this.total = parseInt(res);
        })
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
              this.search(this.page);
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
          })
        })
      },

      //批量禁用
      batchDisable() {
        let selectList = this.selectList;
        this.$confirm('确定启用所选的记录吗?', '启用提示', {
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
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },

      // 返回表格所选行
      handleSelectionChange(val) {
        this.selectList = val;
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
            this.batchEnable();
            break;
          case '禁用':
            this.batchDisable();
            break;
        }
      },
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
    border: 1px solid #00a16c;
    background: white;
  }
</style>
