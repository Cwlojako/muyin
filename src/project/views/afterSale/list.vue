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
    <!--    分页-->
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
        :data="testData"
        style="width: 95%;margin:0 auto;"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowClick"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="售后单号">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.username}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="原订单号"></el-table-column>
        <el-table-column prop="nickname" label="用户昵称"></el-table-column>
        <el-table-column prop="phone" label="用户手机"></el-table-column>
        <el-table-column prop="goods" label="售后商品"></el-table-column>
        <el-table-column prop="num" label="售后数量" sortable width="100"></el-table-column>
        <el-table-column prop="price" label="退款金额" sortable width="100"></el-table-column>
        <el-table-column prop="type" label="售后类型"></el-table-column>
        <el-table-column prop="reason" label="售后原因"></el-table-column>
        <el-table-column prop="createAt" label="申请时间" sortable width="160"></el-table-column>
        <el-table-column prop="updateAt" label="更新时间" sortable width="160"></el-table-column>
        <el-table-column prop="status" label="售后状态" sortable width="160"></el-table-column>
        <el-table-column label="售后单号" fixed="right">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import {post} from "@/framework/http/request";
  import Emitter from '@/framework/mixins/emitter'
  import {search, count} from '@/project/service/issue'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "issue",
        createProps: {
          visible: false
        },
        editProps: {
          visible: false
        },
        editId: 0,//编辑id
        // 售后单列表测试数据
        testData: [
          {
            orderId: '',
            nickname: '',
            phone: '',
            goods:'',
            num: '',
            price: '',
            type: '',
            reason: '',
            createAt: '',
            updateAt: '',
            status: '待审核'
          },
          {
            orderId: '',
            nickname: '',
            phone: '',
            goods:'',
            num: '',
            price: '',
            type: '',
            reason: '',
            createAt: '',
            updateAt: '',
            status: '处理中'
          },
          {
            orderId: '',
            nickname: '',
            phone: '',
            goods:'',
            num: '',
            price: '',
            type: '',
            reason: '',
            createAt: '',
            updateAt: '',
            status: '售后成功'
          },
          {
            orderId: '',
            nickname: '',
            phone: '',
            goods:'',
            num: '',
            price: '',
            type: '',
            reason: '',
            createAt: '',
            updateAt: '',
            status: '售后失败'
          }
        ],
        // 售后单列表数据
        data: [],
        selectList: [],
        sort: {asc: [], desc: []},
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        searchItems: [
          {
            name: "售后单号",
            key: "id",
            type: "string"
          },
          {
            name: "用户昵称",
            key: "nickname",
            type: "string"
          },
          {
            name: "用户手机号",
            key: "phone",
            type: "string"
          },
          {
            name: "原订单号",
            key: "orderId",
            type: "string"
          },
          {
            name: "售后类型",
            key: "type",
            type: "select",
            displayValue: ['仅退款','退货退款'],
            value: ['仅退款','退货退款']
          },
          {
            name: "售后状态",
            key: "status",
            type: "select",
            displayValue: ['待审核','处理中','售后成功','售后失败'],
            value: ['待审核','处理中','售后成功','售后失败']
          },
          {
            name: "申请时间",
            key: "createAt",
            type: "datetimerange"
          },
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
        }
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

      handleTransportSelectList(list) {
        this.selectList = list;
      },

      handleClose() {
        this.createProps.visible = false;
        this.editProps.visible = false;
      },

      handleSelectionChange(val) {
        this.selectList = val;
      },

      handleRowClick(row) {
        console.log(row);
        this.editId = row.id;
        this.editProps.visible = true;
      },

      toDetail(row){
        switch (row.status) {
          case '待审核':
            console.log('待审核')
            this.$router.push({path: `/afterSale/show/uncheck`})
            break
          case '处理中':
            console.log('处理中')
            this.$router.push({path: `/afterSale/show/checking`})
            break
          case '售后成功':
            console.log('售后成功')
            this.$router.push({path: `/afterSale/show/success`})
            break
          case '售后失败':
            console.log('售后失败')
            this.$router.push({path: `/afterSale/show/fail`})
            break
        }
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
  .el-icon-caret-bottom {
    transition: all .3s ease;
  }
</style>
