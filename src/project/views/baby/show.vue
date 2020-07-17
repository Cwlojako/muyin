<template>
  <!-- 用户详情页 -->
  <div class='user-detail'>
    <el-col :span="6" class='user-detail-left'>
      <!-- 宝宝信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>宝宝信息</span>
        </div>
        <div class="text-item">
          <span class="text_label">宝宝姓名：</span>
          {{baby.name}}
        </div>
        <div class="text-item" v-if="baby.user">
          <span class="text_label">创建者手机：</span>
          {{baby.user.phone}}
        </div>
        <div class="text-item" v-if="baby.user">
          <span class="text_label">创建者昵称：</span>
          {{baby.user.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">出生时间：</span>
          {{baby.birthtime}}
        </div>
        <div class="text-item" v-if="baby.timezone">
          <span class="text_label">时区：</span>
          {{baby.timezone.name}}
        </div>
        <div class="text-item">
          <span class="text_label">指纹录入日期：</span>
          xxx
        </div>
      </el-card>
    </el-col>
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>亲友信息</span>
        </div>
        <!-- 刷新按钮 -->
        <el-row class='table-data-refresh'>
          <el-button type='primary' icon="el-icon-refresh" @click="refreshData"></el-button>
        </el-row>
        <!-- 数据表格 -->
        <el-col :span="24" class='table-data'>
          <el-table :data="baby.friendList">
            <el-table-column prop="username" label="昵称">xxx</el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="name" label="关系称呼"></el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-col>
  </div>
</template>

<script>
  import { getById } from '@/project/service/baby'
  import search from '@/framework/components/search'
  export default {
    name: "babyDetail",
    components: {
      search
    },
    data() {
      return {
        baby: {},
        // 宝宝id
        id: 0,
      }
    },
    created() {
      this.id = this.$route.params.id
      this.getBabyDetailById(this.id);
    },
    methods: {
      getBabyDetailById(id) {
        getById({id: id}, res => {
          this.baby = res;
        });
      },
      refreshData() {
        this.getBabyDetailById(this.id)
      }
    }
  }
</script>

<style lang='less' scoped>
</style>
