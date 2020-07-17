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
        :data="managerList"
        style="width: 95%;margin:0 auto;"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowClick"
      >
        <el-table-column prop="realname" label="流水号"></el-table-column>
        <el-table-column prop="behavior" label="关联订单号"></el-table-column>
        <el-table-column prop="ip" label="手机号"></el-table-column>
        <el-table-column prop="time" label="昵称"></el-table-column>
        <el-table-column prop="time" label="类型"></el-table-column>
        <el-table-column prop="time" label="流水金额" sortable></el-table-column>
        <el-table-column prop="time" label="昵称"></el-table-column>
        <el-table-column prop="time" label="支付方式"></el-table-column>
        <el-table-column prop="time" label="下单时间" sortable></el-table-column>
      </el-table>
    </el-col>


  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import {post} from "@/framework/http/request";
  import Emitter from '@/framework/mixins/emitter'
  import {search, count, del, enable, disable} from '@/project/service/manager'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "log",
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
        managerList: [],
        selectList: [],
        sort: {asc: [], desc: []},
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        searchItems: [
          {
            name: "订单号",
            key: "username",
            type: "string"
          },
          {
            name: "类型",
            key: "realname",
            type: "string"
          },
          {
            name: "下单时间",
            key: "createAt",
            type: "datetimerange"
          }
        ]
      };
    },
    computed: {
      route() {
        return this.$route;
      }
    },
    components: {
      Search
    },
    methods: {
      handleEdit() {
        this.editId = this.selectList[0].id
        this.editProps.visible = true;
      },

      // 控制启用禁用
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
          // 点击确定走这里
          if (status === '禁用') {
            // 发送禁用请求，参数为该行数据的id
            disable({id: row.id}, res => {
              _t.$message({
                type: 'success',
                message: '已禁用!'
              });
              // 重新渲染数据
              _t.search(_t.page);
            })
          } else {
            // 发送启用用请求，参数为该行数据的id
            enable({id: row.id}, res => {
              _t.$message({
                type: 'success',
                message: '已启用!'
              });
              _t.search(_t.page);
            })
          }
        }).catch(() => {
          // 点击取消走这里
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
          // keys: [username,realname,roleId,status]
        }
        for (let i in keys) {
          // keys: [username,realname,roleId,status]
          if (searchItems[keys[i]]) {
            // 如果该单元表单中有输入查询条件,则加入到extraParams中作为请求参数
            this.extraParam[keys[i]] = searchItems[keys[i]];
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        this.search(1);
      },

      // 显示添加框
      toCreate() {
        this.createProps.visible = true;
      },

      // 查询manager列表数据
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
        console.log(param)
        if (_t.extraParam.roleId) {
          param.roleId = _t.extraParam.roleId;
          delete param[this.model].roleId;
        }
        if (
          param.pageable.sort.asc.length === 0 &&
          param.pageable.sort.desc.length === 0
        ) {
          delete param.pageable.sort;
        }
        // 调用接口 查询数据
        search(param, res => {
          _t.managerList = res;
          _t.getTotal();
        });
      },

      // 获取数据总条数
      getTotal() {
        let _t = this;
        let param = {[this.model]: _t.extraParam};
        console.log(param)
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
        this.editProps.visible = true;
      },

      // 跳转到详情
      toDetail(row) {
        this.$router.push({path: '/manager/show/' + row.id})
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

      // 更多操作的下拉是否显示
      onMenuChange(val) {
        if (val) {
          this.$refs.rotate.style.transform = 'rotate(180deg)'
        } else {
          this.$refs.rotate.style.transform = 'rotate(0deg)'
        }
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

      // 获取顶部搜索条件的角色栏目列表
      roleSearch() {
        post(`api/role/search`,
          {
            role:{}
          },
          res => {
            res.forEach(item => {
              this.searchItems[2].displayValue.push(item.name);
              this.searchItems[2].value.push(item.id);
            });
            // console.log(this.searchItems);
          }
        )
      },

      // =======
      delete(id) {
        let _t = this;
        del({id: id}, res => {
          _t.search(_t.page);
        });
      },
      enable(id, url) {
        let _t = this;
        post(url, {id: id}, res => {
          _t.search(_t.page);
        });
      },
      //批量删除
      batchDelete() {
        this.broadcast("SiTable", "on-get-selectList");
        this.$nextTick(() => {
          let selectList = this.selectList;
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
            selectList.forEach((item,index) => {
              del({id:item.id},res => {
                if (selectList.length - 1 === index) {
                  this.$message.success(('删除成功'));
                  this.search(this.page);
                }
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        });
      },
      handleSortChange(sort) {
        let key = sort.key;
        let order = sort.order;
        let asc = this.sort.asc;
        let desc = this.sort.desc;
        if (asc.indexOf(key) > -1) {
          let idx = asc.indexOf(key);
          asc.splice(idx, 1);
        }
        if (desc.indexOf(key) > -1) {
          let idx = desc.indexOf(key);
          desc.splice(idx, 1);
        }
        if (order !== "normal") {
          this.sort[order].push(key);
        }
        this.search(1);
      },
    },
    mounted() {
      this.search(1);
      this.roleSearch();
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
