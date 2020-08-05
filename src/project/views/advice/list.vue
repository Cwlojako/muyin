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
        <el-button type="primary" @click="batchDeal" :disabled="selectList.some(item => item.status === '已处理')">标记已处理</el-button>
        <el-button icon="el-icon-delete" @click="batchDelete">删除</el-button>
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
        <el-table-column label="序号">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.id}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop='provider.phone'></el-table-column>
        <el-table-column prop="provider.nickname" label="昵称"></el-table-column>
        <el-table-column prop="createTime" label="反馈时间" sortable></el-table-column>
        <el-table-column prop="content" label="反馈内容"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="handler.username" label="处理人账号"></el-table-column>
        <el-table-column prop="closeTime" label="处理时间"></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click.stop="handleStatusChange(scope.row)" type="text" size="small" v-if="scope.row.status === '待处理'">标记已处理</el-button>
            <el-button type="text" size="small" v-else disabled>已处理</el-button>
            <el-button @click.stop="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import Emitter from '@/framework/mixins/emitter'
  import {search, count, close, batchClose, deleteById} from '@/project/service/feedback'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "feedback",
        editId: 0,
        data: [],
        selectList: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        createTimeParam: {},
        accountParam: {},
        searchItems: [
          {
            name: "手机号",
            key: "phone",
            type: "string"
          },
          {
            name: "反馈时间",
            key: "createTime",
            type: "datetimerange"
          }
        ]
      };
    },
    components: {
      Search,
    },
    methods: {
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
            this.extraParam[keys[i]] = searchItems[keys[i]]
            if (keys[i] === 'createTime') delete this.extraParam[keys[i]]
            if (keys[i] === 'phone') delete this.extraParam[keys[i]]
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        // 处理更新时间搜索参数
        if (searchItems.createTime) {
          this.createTimeParam = {
            start: searchItems.createTime[0],
            end: searchItems.createTime[1]
          }
        } else {
          delete this.createTimeParam
        }
        // 处理手机号搜索参数
        if (searchItems.phone) {
          this.accountParam = {
            phone: searchItems.phone
          }
        } else {
          delete this.accountParam
        }
        this.search(1);
      },
      search(page) {
        this.page = page;
        let param = {
          pageable: {
            page: page,
            size: this.pageSize
          },
          [this.model]: this.extraParam,
          createTime: this.createTimeParam,
          account: this.accountParam
        }
        // 如果参数不需要则清除
        if (JSON.stringify(param.createTime) === "{}") delete param.createTime
        if (JSON.stringify(param.account) === "{}") delete param.account
        search(param, res => {
          this.data = res
          this.getTotal()
        });
      },
      getTotal() {
        let param = {
          [this.model]: this.extraParam,
          createTime: this.createTimeParam,
          account: this.accountParam
        }
        // 如果参数不需要则清除
        if (JSON.stringify(param.createTime) === "{}") delete param.createTime
        if (JSON.stringify(param.account) === "{}") delete param.account
        count(param, res => {
          this.total = parseInt(res);
        });
      },
      handleTransportSelectList(list) {
        this.selectList = list;
      },
      // 单条删除
      handleDelete(row) {
        this.$confirm('确定删除该条记录吗?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteById({id: row.id},res => {
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
      //批量删除
      batchDelete() {
        let selectList = this.selectList;
        if (selectList.length === 0) {
          this.$message.warning({
            title: "至少选择一条数据"
          })
          return
        }
        this.$confirm('确定删除所选记录吗?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = selectList.map(s => {
            return s.id;
          });
          batchDelete({idList: idList},res => {
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
      // 单条处理
      handleStatusChange(row) {
        close({id: row.id},res => {
          this.$message.success('已处理');
          this.search(this.page);
        })
      },
      //批量处理
      batchDeal() {
        let selectList = this.selectList;
        this.$confirm('确定处理所选的记录吗?', '启用提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = selectList.map(s => {
            return s.id
          });
          batchClose({idList: idList},res => {
            this.$message.success('已处理');
            this.search(this.page);
          })
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
      toDetail(row) {
        this.$router.push({path: '/advice/show/' + row.id})
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(this.page);
      }
    },
    mounted() {
      this.search(1);
    }
  };
</script>
<style lang="less" scoped>
</style>
