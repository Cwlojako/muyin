<template>
  <!-- 用户详情页 -->
  <div class='user-detail'>
    <el-col :span="6" class='user-detail-left'>
      <!-- 账号信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>账号信息</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="状态">启用</el-dropdown-item>
              <el-dropdown-item command="状态">禁用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">启用状态：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">注册时间：</span>
          {{user.createAt}}
        </div>
        <div class="text-item">
          <span class="text_label">最近登录时间：</span>
          {{user.accessAt}}
        </div>
        <div class="text-item">
          <span class="text_label">累计消费金额：</span>
          {{user.comment}}
        </div>
        <div class="text-item">
          <span class="text_label">积分：</span>
          {{user.comment}}
        </div>
      </el-card>
      <!-- 基本信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>基本信息</span>
        </div>
        <div class="text-item text-item-avatar">
          <span class="text_label">头像：</span>
          <el-avatar shape="circle" :size="45" :fit="'fill'"
            :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'"
            class="head-setting-right-avatar">
          </el-avatar>
        </div>
        <div class="text-item">
          <span class="text_label">手机号：</span>
          {{user.status}}
        </div>
        <div class="text-item">
          <span class="text_label">昵称：</span>
          {{user.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">性别：</span>
          {{user.email}}
        </div>
      </el-card>
      <!-- 备注信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>备注信息</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
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
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>交易记录</span>
        </div>
        <!--搜索框栏目-->
        <el-row>
          <el-col :span="24">
            <search
              style="width: 95%;margin: 10px auto"
              :search-items="searchItems"
              @on-search="searchBySearchItem"
            ></search>
          </el-col>
        </el-row>
        <!-- 分页组件 -->
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
        <!-- 数据表格 -->
        <el-col :span="24" class='table-data'>
          <el-table :data="data">
            <el-table-column prop="id" label="订单号"></el-table-column>
            <el-table-column prop="number" label="商品数量" width='100' sortable></el-table-column>
            <el-table-column prop="orderPrice" label="订单金额" width='100' sortable></el-table-column>
            <el-table-column prop="price" label="实付金额" width='100' sortable></el-table-column>
            <el-table-column prop="name" label="收货人姓名"></el-table-column>
            <el-table-column prop="phone" label="收货人手机"></el-table-column>
            <el-table-column prop="status" label="订单状态"></el-table-column>
            <el-table-column prop="createTime" label="下单时间" sortable></el-table-column>
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
    <el-dialog
      title="备注编辑"
      :visible.sync="tipEditProps.visible"
      :modal-append-to-body='false'
      width="50%"
      :before-close="handleClose">
      <el-form ref="formValidate" :model="formValidate" label-width="150px">
        <el-form-item label="备注" prop="tip">
          <el-input type='textarea' v-model="formValidate.tip" placeholder="请输入备注"></el-input>
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
        // 备注编辑弹框绑定数据对象
        formValidate: {
          tip: ''
        },
        // 备注编辑弹框
        tipEditProps: {
          visible: false
        },
        // 用户详情数据
        data: [],
        id: this.$route.params.id,
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
        total: 0
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
          case '状态':
            let status = this.user.status;
            if (status === '禁用') {
              enable({id: this.id}, res => {
                this.$message({
                  type: 'success',
                  message: '已启用!'
                });
                this.findById();
              })
            } else {
              disable({id: this.id}, res => {
                this.$message({
                  type: 'success',
                  message: '已禁用!'
                });
                this.findById();
              })
            }
            break;
          case '编辑':
            this.tipEditProps.visible = true
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
        this.tipEditProps.visible = false
      }
    }
  }
</script>

<style lang='less' scoped>

</style>
