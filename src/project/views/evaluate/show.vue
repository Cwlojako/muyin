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
                                :disabled="evaluation.enabled"
                                :style="evaluation.enabled ? {'color':'rgba(255,255,255,0.4)'} : {'color': '#fff'}">
                启用
              </el-dropdown-item>
              <el-dropdown-item command="状态"
                                :disabled="!evaluation.enabled"
                                :style="!evaluation.enabled ? {'color':'rgba(255,255,255,0.4)'} : {'color': '#fff'}">
                禁用
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">状态：</span>
          {{evaluation.enabled ? '启用' : '禁用'}}
        </div>
        <div class="text-item">
          <span class="text_label">订单号：</span>
          ---
        </div>
        <div class="text-item">
          <span class="text_label">商品ID：</span>
          ---
        </div>
        <div class="text-item">
          <span class="text_label">商品名称：</span>
          ---
        </div>
        <div class="text-item">
          <span class="text_label">商品规格：</span>
          ---
        </div>
      </el-card>
      <!-- 用户信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>用户信息</span>
        </div>
        <div class="text-item" v-if='evaluation.account'>
          <span class="text_label">用户昵称：</span>
          {{evaluation.account.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">手机号：</span>
          ---
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
          {{evaluation.createTime}}
        </div>
        <div class="text-item">
          <span class="text_label">评论星数：</span>
          <i class="el-icon-star-on" v-for='item in evaluation.scores'></i>
        </div>
        <div class="text-item">
          <span class="text_label">评论内容：</span>
          {{evaluation.content}}
        </div>
        <div class="text-item evaluate-img">
          <span class="text_label">评论图片：</span>
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
  import { get, disabled, enable} from '@/project/service/evaluation'
  export default {
    data() {
      return {
        evaluation: {},
        id: this.$route.params.id,
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
          this.evaluation = res;
        });
      },
      handleClick(command){
        switch (command) {
          case '状态':
            let status = evaluation.enabled ? '禁用' : '启用';
            if (status === '启用') {
              enabled({id: this.id}, res => {
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
      }
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
