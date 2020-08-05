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
        <el-table-column prop="content" label="操作内容"></el-table-column>
        <el-table-column prop="ip" label="IP地址"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" sortable></el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import Emitter from '@/framework/mixins/emitter'
  import {search, count} from '@/project/service/operation'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "operation",
        editId: 0,//编辑id
        data: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        createTimeParam: {},
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
            key: "createTime",
            type: "datetimerange"
          }
        ]
      };
    },
    components: {
      Search
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
            this.extraParam[keys[i]] = searchItems[keys[i]]
            if (keys[i] === 'createTime') delete this.extraParam[keys[i]]
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        // 处理创建时间参数
        if (searchItems.createTime) {
          this.createTimeParam = {
            'start': searchItems.createTime[0],
            'end': searchItems.createTime[1]
          }
        } else {
          delete this.createTimeParam
        }
        this.search(1);
      },

      // 查询manager列表数据
      search(page) {
        this.page = page;
        let param = {
          pageable: {
            page: page,
            size: this.pageSize
          },
          [this.model]: this.extraParam,
          createTime: this.createTimeParam
        }
        // 如果参数不需要则清除
        if (JSON.stringify(param.createTime) === "{}") delete param.createTime
        // 调用接口 查询数据
        search(param, res => {
          this.data = res;
          this.getTotal();
        });
      },

      // 获取数据总条数
      getTotal() {
        let param = {
          [this.model]: this.extraParam,
          createTime: this.createTimeParam
        }
        count(param, res => {
          this.total = parseInt(res);
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
