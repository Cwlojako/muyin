<template>
  <!-- 用户详情页 -->
  <div class='user-detail'>
    <el-col :span="6" class='user-detail-left'>
      <!-- 基本信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>基本信息</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="状态"
                                :disabled="manager.status === '启用'"
                                :style="(manager.status === '启用') ? {'color':'rgba(255,255,255,0.4)'} : {'color': '#fff'}">
                启用
              </el-dropdown-item>
              <el-dropdown-item command="状态"
                                :disabled="manager.status === '禁用'"
                                :style="(manager.status === '禁用') ? {'color':'rgba(255,255,255,0.4)'} : {'color': '#fff'}">
                禁用
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">状态：</span>
          {{manager.status}}
        </div>
        <div class="text-item">
          <span class="text_label">订单号：</span>
          {{manager.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">商品ID：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">商品名称：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">商品规格：</span>
          {{manager.email}}
        </div>
      </el-card>
      <!-- 用户信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>用户信息</span>
        </div>
        <div class="text-item">
          <span class="text_label">用户昵称：</span>
          {{manager.comment}}
        </div>
        <div class="text-item">
          <span class="text_label">手机号：</span>
          {{manager.phone}}
        </div>
      </el-card>
    </el-col>
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>评价详情</span>
        </div>
        <div class="text-item">
          <span class="text_label">评论时间：</span>
          {{manager.comment}}
        </div>
        <div class="text-item">
          <span class="text_label">评论星数：</span>
          {{manager.phone}}
        </div>
        <div class="text-item">
          <span class="text_label">评论内容：</span>
          {{manager.phone}}
        </div>
        <div class="text-item evaluate-img">
          <span class="text_label">评论图片：</span>
          <el-avatar shape="square" :size="200" :fit="'fill'"
                     :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'">
          </el-avatar>
          <el-avatar shape="square" :size="200" :fit="'fill'"
                     :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'">
          </el-avatar>
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
  </div>
</template>

<script>
  import {get, enable, disable} from '@/project/service/manager'
  import search from '@/framework/components/search'
  export default {
    name: "evaluateDetail",
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
        get({id: this.id}, res => {
          console.log(res)
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
          manager: _t.extraParam
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
  .evaluate-img {
    display: flex;
    .el-avatar {
      margin: 0 5px;
    }
  }
</style>
