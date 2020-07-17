<template>
  <!-- 售后单待审核详情页 -->
  <div class='user-detail'>
    <el-col :span="6" class='user-detail-left'>
      <!-- 售后详情 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>售后详情</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="10" height="8">
            </el-button>
            <el-dropdown-menu slot="dropdown" style="width: 120px;">
              <el-dropdown-item command="确认退款">确认退款</el-dropdown-item>
              <el-dropdown-item command="拒绝退款">拒绝退款</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">售后单号：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">原订单号：</span>
          {{user.createAt}}
        </div>
        <div class="text-item">
          <span class="text_label">申请时间：</span>
          {{user.accessAt}}
        </div>
        <div class="text-item">
          <span class="text_label">售后状态：</span>
          处理中
        </div>
        <div class="text-item">
          <span class="text_label">售后类型：</span>
          {{user.comment}}
        </div>
        <div class="text-item">
          <span class="text_label">售后原因：</span>
          {{user.comment}}
        </div>
        <div class="text-item after-sale-img">
          <span class="text_label">售后图片：</span>
          <el-avatar shape="square" :size="50" :fit="'fill'"
                     :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'">
          </el-avatar>
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
      <!-- 转账信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>转账信息</span>
        </div>
        <div class="text-item">
          <span class="text_label">银行卡号：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">开户人姓名：</span>
          {{user.nickname}}
        </div>
      </el-card>
    </el-col>
    <!--    售后商品信息-->
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>售后商品信息</span>
        </div>
        <!-- 售后商品信息数据表格 -->
        <el-col :span="24" class='table-data'>
          <el-table :data="data">
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="spec" label="商品规格"></el-table-column>
            <el-table-column prop="number" label="数量"></el-table-column>
            <el-table-column prop="price" label="单价(元)"></el-table-column>
            <el-table-column prop="totalPrice" label="退款总额(元)">
              <template slot-scope="scope">
                {{scope.row.number * scope.row.price}}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-col>
    <!--    售后进度-->
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>售后进度</span>
        </div>
        <!-- 售后进度信息数据表格 -->
        <el-col :span="24" class='table-data'>
          <el-table :data="processData">
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="reason" label="备注"></el-table-column>
            <el-table-column prop="createAt" label="操作时间" sortable></el-table-column>
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

    <!--    确认退款-->
    <el-dialog
      title="确认退款"
      :visible.sync="agreeProps.visible"
      :modal-append-to-body='false'
      :append-to-body="true"
      width="50%"
      :before-close="handleClose">
      <el-form :model="formValidate" status-icon  label-width="150px">
        <el-form-item label="凭证" prop="img">
          <upload
            @on-transport-file-list="handleTransportFileList"
            :max-size="5120"
            :limit="1">
          </upload>
        </el-form-item>
        <el-form-item label="备注" prop="tip">
          <el-input v-model="formValidate.tip"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handlePass('formValidate')">确 定</el-button>
      </div>
    </el-dialog>
    <!--    拒绝退款-->
    <el-dialog
      title="拒绝退款"
      :visible.sync="disagreeProps.visible"
      :modal-append-to-body='false'
      :append-to-body="true"
      width="50%"
      :before-close="handleClose">
      <el-form :model="formValidate" status-icon  label-width="150px">
        <el-form-item label="请说明原因" prop="tip">
          <el-input v-model="formValidate.tip"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleDispass('formValidate')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {get, enable, disable, findById} from '@/project/service/user'
  import search from '@/framework/components/search'
  import Upload from '@/framework/components/upload'
  export default {
    name: "showUncheck",
    components: {
      search, Upload
    },
    data() {
      return {
        user: {},
        formValidate: {},
        agreeProps: {
          visible: false
        },
        disagreeProps: {
          visible: false
        },
        orderId: this.$route.params.id,
        activeName: 'first',

        // 分页组件参数
        pageSize: 10,
        page: 1,
        total: 0,
        // 售后商品数据
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
        ],
        // 售后进度数据
        processData: [
          {
            status: '审核通过',
            tip: '同意退款',
            createAt: '2020-05-06'
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
          case '确认退款':
            this.agreeProps.visible = true
            break
          case '拒绝退款':
            this.disagreeProps.visible = true
            break
        }
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
        this.agreeProps.visible = false;
        this.disagreeProps.visible = false
      },
      handleSave() {
        this.agreeProps.visible = false;
        this.disagreeProps.visible = false
        // 重新获取数据
      },

      handleTransportFileList(fileList) {
        console.log(fileList)
        this.formValidate.img = fileList[0].response.data;
      }
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
        .after-sale-img {
          display: flex;
        }
      }
    }
    .user-detail-right {
      margin-bottom: 10px;
      .table-data {
        margin-bottom: 100px;
      }
    }
  }
  .el-card/deep/.el-card__header {
    padding: 10px 18px;
  }
</style>
