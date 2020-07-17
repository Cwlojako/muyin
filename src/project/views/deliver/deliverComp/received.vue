<template>
  <!--  已发货组件，正在派送-->
  <div>
    <el-col :span="24">
      <search
        style="width: 95%;margin: 10px auto"
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
    </el-col>
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
    <!--    数据表格-->
    <el-col :span="24">
      <el-table :data="data" style="width: 95%;margin:0 auto;">
        <el-table-column prop="orderId" label="订单号">
          <template slot-scope="scope">
            <el-button @click.native.stop="toDetail(scope.row)" size="small" type="text">{{scope.row.username}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称"></el-table-column>
        <el-table-column prop="phone" label="用户手机号"></el-table-column>
        <el-table-column prop="receiveName" label="收件人"></el-table-column>
        <el-table-column prop="receivePhone" label="收件人手机号"></el-table-column>
        <el-table-column prop="creatAt" label="下单时间" sortable></el-table-column>
        <el-table-column prop="deliverAt" label="发货时间" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click.native.stop='handleCheck(scope.row)' size="small" type="text">查看物流</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--    查看物流对话框-->
    <el-dialog
      title="物流信息"
      :visible.sync="deliverProps.visible"
      :modal-append-to-body='false'
      :append-to-body="true"
      width="40%"
      :before-close="handleClose">
      <!--      物流文本信息-->
      <div class="deliver-wrapper">
        <div class="deliver-left">
          <div class="order-text">
            <h4>订单信息</h4>
            <p>订单号：<strong style="color:dodgerblue;">157823348612</strong></p>
            <p>订单状态：已发货</p>
            <p>用户昵称：路飞</p>
            <p>用户手机号：111110000</p>
          </div>
          <div class="deliver-text">
            <h4>配送信息</h4>
            <p>收货人姓名：xxx</p>
            <p>手机号：12648331</p>
            <p>收货地区：棠下</p>
            <p>详细地址：棠安路188号</p>
          </div>
        </div>
        <div class="deliver-right">
          <div class="logistics-text">
            <h4>物流信息</h4>
            <p>物流公司：顺丰快递</p>
            <p>物流单号：12648331</p>
            <p>物流信息</p>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Search from '@/framework/components/search'
  import {search, count} from '@/project/service/manager'
  export default {
    name: "recevieList",
    components: {
      Search
    },
    data() {
      return {
        model: 'deliver',
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
            name: "收货人姓名",
            key: "receiveName",
            type: "string"
          },
          {
            name: "收货人手机号",
            key: "receivePhone",
            type: "string"
          },
          {
            name: "下单时间",
            key: "creatAt",
            type: "datetimerange"
          },
          {
            name: "发货时间",
            key: "deliverAt",
            type: "datetimerange"
          }
        ],
        // 顶部搜索框额外查询参数
        extraParam: {},
        // 待发货数据信息
        data: [],
        deliverProps: {
          visible: false
        },
        // 表单验证规则
        rules: {},
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    created() {
      this.search(1)
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
      // 调用接口查询数据
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
      handleCheck() {
        this.deliverProps.visible = true
      },
      handleClose() {
        this.deliverProps.visible = false
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
      // 跳转到已发货详情页
      toDetail(row) {
        this.$router.push({path: `/${this.model}/show/receive/` + row.id})
      }
    }
  }
</script>

<style lang="less" scoped>
  .deliver-wrapper {
    display: flex;
    p {
      color: #ccc;
      font-size: 14px;
      padding: 2px;
    }
    .deliver-left {
      flex: 1;
      .deliver-text {
        margin-top: 20px;
      }
    }
    .deliver-right {
      flex: 1;
    }
  }
</style>
