<template>
  <!-- 用户详情页 -->
  <div class='user-detail'>
    <!-- 基本信息 -->
    <el-col :span="6" class='user-detail-left'>
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>基本信息</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="编辑">编辑</el-dropdown-item>
              <el-dropdown-item command="状态"
                                :disabled="manager.status === '启用'"
                                :style="(manager.status === '启用') ? {'color': 'rgba(255,255,255,0.4)'} : {'color': '#fff'}">启用
              </el-dropdown-item>
              <el-dropdown-item command="状态" :disabled="manager.status === '禁用'"
                                :style="(manager.status === '禁用') ? {'color': 'rgba(255,255,255,0.4)'} : {'color': '#fff'}">禁用
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">名称：</span>
          {{manager.status}}
        </div>
        <div class="text-item">
          <span class="text_label">类型：</span>
          {{manager.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">面额：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">起用条件：</span>
          {{manager.status}}
        </div>
        <div class="text-item">
          <span class="text_label">兑换积分：</span>
          {{manager.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">有效时长：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">结束兑换日期：</span>
          {{manager.status}}
        </div>
        <div class="text-item">
          <span class="text_label">总量：</span>
          {{manager.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">已兑换：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">状态：</span>
          {{manager.email}}
        </div>
      </el-card>
    </el-col>
    <!--    领取记录-->
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>领取记录</span>
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
            <el-table-column prop="phone" label="领取人手机号"></el-table-column>
            <el-table-column prop="time" label="领取时间" width='160' sortable></el-table-column>
            <el-table-column prop="deadline" label="有效期至"></el-table-column>
            <el-table-column prop="status" label="使用状态"></el-table-column>
            <el-table-column prop="orderId" label="关联订单号"></el-table-column>
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
  </div>
</template>

<script>
  import {get, enable, disable} from '@/project/service/manager'
  import search from '@/framework/components/search'
  export default {
    name: "userDetail",
    components: {
      search
    },
    data() {
      return {
        manager: {},
        id: this.$route.params.id,
        activeName: 'first',
        // 搜索框搜索栏目
        searchItems: [
          {
            name: "手机号",
            key: "phone",
            type: "string"
          },
          {
            name: "领取时间",
            key: "time",
            type: "datetimerange"
          },
          {
            name: "关联订单号",
            key: "orderId",
            type: "string"
          }
        ],
        // 额外搜索条件参数
        extraParam: {},

        // 分页组件参数
        pageSize: 10,
        page: 1,
        total: 0,

        // 领取记录数据
        data: [
          {
            phone: '13202547840',
            time: '2020-10-22',
            deadline: '2040-06-06',
            status: '已使用',
            orderId: '5608609420'
          }
        ]
      }
    },
    created() {
      this.findById();
    },
    methods: {
      findById() {
        get({id: this.id}, res => {
          this.manager = res;
        });
      },
      handleClick(command){
        switch (command) {
          case '状态':
            let status = this.manager.status;
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
        margin-top: 5px;
      }
    }
  }
  .el-card/deep/.el-card__header {
    padding: 10px 18px;
  }
</style>
