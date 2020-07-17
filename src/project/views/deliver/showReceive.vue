<template>
  <!-- 已发货详情页 -->
  <div class='user-detail'>
    <el-col :span="6" class='user-detail-left'>
      <!-- 基本信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>基本信息</span>
        </div>
        <div class="text-item">
          <span class="text_label">订单号：</span>
          {{manager.status}}
        </div>
        <div class="text-item">
          <span class="text_label">订单状态：</span>
          已收货
        </div>
        <div class="text-item">
          <span class="text_label">用户昵称：</span>
          {{manager.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">用户手机号：</span>
          {{manager.phone}}
        </div>
        <div class="text-item">
          <span class="text_label">收件人：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">手机号码：</span>
          {{manager.phone}}
        </div>
        <div class="text-item">
          <span class="text_label">所在地区：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">详细地址：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">下单时间：</span>
          {{manager.createAt}}
        </div>
        <div class="text-item">
          <span class="text_label">发货时间：</span>
          {{manager.createAt}}
        </div>
      </el-card>
    </el-col>
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>商品清单信息</span>
        </div>
        <!-- 数据表格 -->
        <el-col :span="24" class='table-data'>
          <el-table :data="data">
            <el-table-column prop="username" label="商品名称"></el-table-column>
            <el-table-column prop="spec" label="商品规格"></el-table-column>
            <el-table-column prop="num" label="数量"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.stop="checkBatch(scope.row)">查看批次</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-col>
    <el-col :span="18" :offset="6" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>物流信息</span>
        </div>
        <div class="text-item">
          <span class="text_label">物流公司：</span>
          顺丰快递
        </div>
        <div class="text-item">
          <span class="text_label">物流单号：</span>
          54354343435135428998
        </div>
        <div class="text-item">
          <span class="text_label">物流信息：</span>
          <el-timeline>
            <el-timeline-item timestamp="2018/4/12" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/12 20:46</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/3" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/3 20:46</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/2" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/2 20:46</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
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
    <el-dialog title="货品批次"
               :visible.sync="checkBatchProps.visible"
               :modal-append-to-body="false"
               width="50%"
               :before-close="handleClose">
      <div class="set-batch-top">
        <div class="item">
          <span>商品名称：</span>
          <span>雅培二段婴幼儿奶粉</span>
        </div>
        <div class="item">
          <span>规格：</span>
          <span>1.5kg</span>
        </div>
        <div class="item">
          <span>数量：</span>
          <span>3</span>
        </div>
      </div>
      <el-col :span="24">
        <el-table :data="batchData">
          <el-table-column prop="batchId" label="批次号"></el-table-column>
          <el-table-column prop="createAt" label="生产日期"></el-table-column>
          <el-table-column prop="endAt" label="保质期至"></el-table-column>
          <el-table-column prop="receiveName" label="数量"></el-table-column>
        </el-table>
      </el-col>
      <div slot="footer">
        <el-button type="primary" @click="handleClose">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {get, enable, disable, search} from '@/project/service/manager'
  import Search from '@/framework/components/search'
  export default {
    name: "showRecevie",
    components: {
      Search
    },
    data() {
      return {
        manager: {},
        model: 'deliver',
        data: [],
        // 批次数据信息
        batchData: [],
        id: this.$route.params.id,
        checkBatchProps: {
          visible: false
        },
        // 额外搜索条件参数
        extraParam: {},

        // 分页组件参数
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    created() {
      this.$store.dispatch('GET_USER_CACHE')
      this.get();
      this.search(1)
    },
    methods: {
      get() {
        get({id: this.id}, res => {
          this.manager = res;
        });
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
          manager: _t.extraParam
        };
        search(param, res => {
          let data = res;
          _t.data = data;
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

      checkBatch(row) {
        this.checkBatchProps.visible = true
      },
      handleClose() {
        this.checkBatchProps.visible = false
      }
    }
  }
</script>

<style lang='less' scoped>
  .user-detail {
    width:100%;
    height:100%;
    padding: 20px;
    font-size: 14px;
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
      margin-bottom: 10px;
      .table-data {
        margin-top: 5px;
      }
    }
  }
  .el-card/deep/.el-card__header {
    padding: 10px 18px;
    font-weight: bolder;
  }
  .set-batch-top {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    .add-batch-btn {
      margin-left: 10px;
    }
    .item {
      flex: 1;
    }
  }
</style>
