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
        <el-button :type="selectList.length === 0 ? 'info' : 'primary'"
                   @click="exportExcel"
                   :disabled="selectList.length === 0"
                   icon="el-icon-s-order">
          导出Excel
        </el-button >
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
        <el-table-column label="订单号">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.username}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户昵称"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="number" label="商品数量" sortable width="100"></el-table-column>
        <el-table-column prop="orderPrice" label="订单金额" sortable width="100"></el-table-column>
        <el-table-column prop="realPrice" label="实付金额" sortable width="100"></el-table-column>
        <el-table-column prop="receiveName" label="收货人姓名"></el-table-column>
        <el-table-column prop="receivePhone" label="收货人手机号"></el-table-column>
        <el-table-column prop="status" label="订单状态"></el-table-column>
        <el-table-column prop="createAt" label="下单时间" sortable width="160"></el-table-column>
        <el-table-column prop="updateAt" label="更新时间" sortable width="160"></el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import {post} from "@/framework/http/request";
  import Emitter from '@/framework/mixins/emitter'
  import {search, count} from '@/project/service/order'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "order",
        editId: 0,//编辑id
        data: [],
        selectList: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        searchItems: [
          {
            name: "订单号",
            key: "id",
            type: "string"
          },
          {
            name: "用户手机号",
            key: "phone",
            type: "string"
          },
          {
            name: "订单状态",
            key: "roleId",
            type: "select",
            displayValue: ['待付款','待发货','待收货','待评价','已完成','已取消'],
            value: ['待付款','待发货','待收货','待评价','已完成','已取消']
          },
          {
            name: "收货人姓名",
            key: "name",
            type: "string"
          },
          {
            name: "收货人手机号",
            key: "receivePhone",
            type: "string"
          },
          {
            name: "订单类型",
            key: "orderType",
            type: "select",
            displayValue: ['普通','撤销'],
            value: ['普通','撤销']
          },
          {
            name: "下单时间",
            key: "createAt",
            type: "datetimerange"
          },
        ]
      };
    },
    components: {
      Search
    },
    methods: {
      // 控制启禁用
      exportExcel () {},

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
          order: this.extraParam
        };
        search(param, res => {
          this.data = res;
          this.getTotal();
        });
      },

      getTotal() {
        let param = {manager: this.extraParam};
        count(param, res => {
          this.total = parseInt(res);
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
        this.$router.push({path: `/${this.model}/show/`+ row.id})
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
