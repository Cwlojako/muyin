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
      <el-table :data="data" style="width: 95%;margin:0 auto;">
        <el-table-column prop='username' label="账号"></el-table-column>
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column prop="behavior" label="行为"></el-table-column>
        <el-table-column prop="ip" label="IP地址"></el-table-column>
        <el-table-column prop="time" label="操作时间" sortable></el-table-column>
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
        editId: 0,//编辑id
        data: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        searchItems: [
          {
            name: "账号",
            key: "username",
            type: "string"
          },
          {
            name: "姓名",
            key: "realname",
            type: "string"
          },
          {
            name: "操作时间",
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
          manager: _t.extraParam
        };
        // 调用接口 查询数据
        search(param, res => {
          _t.data = res;
          _t.getTotal();
        });
      },

      // 获取数据总条数
      getTotal() {
        let _t = this;
        let param = {manager: _t.extraParam};
        count(param, res => {
          _t.total = parseInt(res);
        });
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
    },
    created() {
      this.search(1);
    }
  }
</script>
<style lang="less" scoped>
</style>
