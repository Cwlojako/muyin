<template>
  <!-- 用户详情页 -->
  <div class='user-detail'>
    <el-col :span="6" class='user-detail-left'>
      <!-- 订单信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>订单信息</span>
        </div>
        <div class="text-item">
          <span class="text_label">订单号：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">订单状态：</span>
          {{user.createAt}}
        </div>
        <div class="text-item">
          <span class="text_label">优惠券名称：</span>
          {{user.accessAt}}
        </div>
        <div class="text-item">
          <span class="text_label">订单金额：</span>
          {{user.comment}}
        </div>
        <div class="text-item">
          <span class="text_label">优惠金额：</span>
          {{user.comment}}
        </div>
        <div class="text-item">
          <span class="text_label">需付金额：</span>
          {{user.comment}}
        </div>
        <div class="text-item">
          <span class="text_label">实付金额：</span>
          {{user.comment}}
        </div>
      </el-card>
      <!-- 用户信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>用户信息</span>
        </div>
        <div class="text-item">
          <span class="text_label">用户昵称：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">手机号：</span>
          {{user.nickname}}
        </div>
      </el-card>
      <!-- 订单进度 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>订单进度</span>
        </div>
        <div class="text-item">
          <span class="text_label">下单时间：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">支付时间：</span>
          {{user.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">发货时间：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">收货时间：</span>
          {{user.nickname}}
        </div>
      </el-card>
      <!-- 支付信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>支付信息</span>
        </div>
        <div class="text-item">
          <span class="text_label">支付流水号：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">支付方式：</span>
          {{user.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">支付金额(元)：</span>
          {{user.status}}
        </div>
      </el-card>
      <!-- 配送信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>配送信息</span>
        </div>
        <div class="text-item">
          <span class="text_label">收货人：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">手机号码：</span>
          {{user.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">收货地区：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">详细地址：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">买家备注：</span>
          {{user.status}}
        </div>
      </el-card>
      <!-- 卖家备注信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>卖家备注信息</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="10" height="8">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="编辑">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text item">
          <span class="text_label">备注：</span>
          {{user.comment}}
        </div>
      </el-card>
    </el-col>
    <!--    商品清单信息-->
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>商品清单信息</span>
        </div>
        <!-- 商品清单信息数据表格 -->
        <el-col :span="24" class='table-data'>
          <el-table :data="data">
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="spec" label="商品规格"></el-table-column>
            <el-table-column prop="number" label="数量"></el-table-column>
            <el-table-column prop="price" label="单价(元)"></el-table-column>
            <el-table-column prop="totalPrice" label="小计(元)">
              <template slot-scope="scope">
                {{scope.row.number * scope.row.price}}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-col>
    <!--      <el-dialog-->
    <!--        title="查看图片"-->
    <!--        :visible.sync="imgVisible"-->
    <!--        :modal-append-to-body='false'-->
    <!--        width="50%"-->
    <!--        :before-close="handleClose">-->
    <!--        <img :src="'https://www.gunghobox.com/images/'+manager.avatar" alt="" width="100%">-->
    <!--      </el-dialog>-->
    <!--    编辑卖家备注信息弹框-->
    <el-dialog
      title="编辑卖家备注信息"
      :visible.sync="editProps.visible"
      :modal-append-to-body='false'
      :append-to-body="true"
      width="50%"
      :before-close="handleClose">
      <el-form :model="formValidate" status-icon  label-width="150px">
        <el-form-item label="备注信息" prop="tip">
          <el-input type="textarea" v-model="formValidate.tip" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {get, enable, disable, findById} from '@/project/service/user'
  import search from '@/framework/components/search'
  export default {
    name: "userDetail",
    components: {
      search
    },
    data() {
      return {
        user: {},
        formValidate: {},
        editProps: {
          visible: false
        },
        orderId: this.$route.params.id,
        activeName: 'first',
        // 搜索框搜索栏目
        searchItems: [
          {
            name: "订单号",
            key: "id",
            type: "string"
          },
          {
            name: "收货人",
            key: "reciveName",
            type: "string"
          },
          {
            name: "手机号",
            key: "phone",
            type: "string"
          },
          {
            name: "下单时间",
            key: "createTime",
            type: "datetimerange"
          }
        ],
        // 额外搜索条件参数
        extraParam: {},

        // 分页组件参数
        pageSize: 10,
        page: 1,
        total: 0,
        // 商品清单数据
        data: [
          {
            name: 'Github',
            spec: '黑色;256G;',
            number: 2,
            price: 199,
            totalPrice: 0
          },
          {
            name: 'Linux',
            spec: '白色256G;',
            number: 5,
            price: 199,
            totalPrice: 0
          }
        ]
      }
    },
    created() {
      this.findById();
    },
    methods: {
      findById() {
        findById({id: this.id}, res => {
          this.user = res;
        });
      },
      handleClick(command){
        switch (command) {
          case '编辑':
            this.editProps.visible = true
        }
      },
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

      // 用户详情列表查询交易记录
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
        if (
          param.pageable.sort.asc.length === 0 &&
          param.pageable.sort.desc.length === 0
        ) {
          delete param.pageable.sort;
        }
        search(param, res => {
          let data = res;
          _t.data = data;
          _t.getTotal();
        });
      },

      // 分页组件监听函数
      // 监听当前页数变换
      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },
      // 监听当前页条目数变换
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(this.page);
      },

      handleClose() {
        this.editProps.visible = false;
      },
      handleSave() {
        this.editProps.visible = false;
        // 重新获取数据
      },
    }
  }
</script>

<style lang='less' scoped>
  .user-detail {
    width:100%;
    height:100%;
    padding: 20px;
    box-sizing: border-box;
    .user-detail-left {
      padding-right: 10px;
      box-sizing: border-box;
      .box-card {
        margin-bottom: 10px;
        .box-card-header-right {
          float: right;
        }
        .text-item {
          padding: 5px 0;
        }
        .text-item-avatar {
          display: flex;
          align-items: center;
        }
      }
    }
    .user-detail-right {
      .table-data {
        margin-bottom: 100px;
      }
    }
  }
  .el-card/deep/.el-card__header {
    padding: 10px 18px;
  }
</style>
