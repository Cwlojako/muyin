<template>
<!--  帮助中心文章详情页-->
  <div class="user-detail">
    <el-col :span="6" class="user-detail-left">
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>基本信息</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="@/project/assets/more.png" alt="" width="10" height="8">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="编辑">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">广告标题：</span>
          {{page.title}}
        </div>
        <div class="text-item">
          <span class="text_label">排列数字：</span>
          {{page.position}}
        </div>
        <div class="text-item">
          <span class="text_label">创建时间：</span>
          {{page.createTime}}
        </div>
        <div class="text-item">
          <span class="text_label">更新时间：</span>
          {{page.updateTime}}
        </div>
      </el-card>
    </el-col>
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>文章内容</span>
        </div>
        <div v-html="page.content" class='box-card-content-left'></div>
      </el-card>
    </el-col>
    <i-edit
      :dialog-visible="editProps.visible"
      @on-dialog-close="handleClose"
      @onRefreshData="findById"
      :editId="editId"
    />
  </div>
</template>

<script>
  import { get } from '@/project/service/page'
  import iEdit from './edit'
  export default {
    data() {
      return {
        editProps:{
          visible: false
        },
        editId: this.$route.params.id,
        page: {}
      }
    },
    components:{
      iEdit
    },
    created() {
      this.findById();
    },
    methods: {
      findById() {
        get({id: this.editId}, res => {
          this.page = res;
        });
      },
      handleClick(command){
        switch (command) {
          case '编辑':
            this.editProps.visible = true;
            break;
        }
      },
      handleClose(){
        this.editProps.visible = false
      }
    }
  }
</script>
<style lang="less" scoped>
  .box-card-content-left/deep/img {
    display: block;
    margin: 5px 0;
  }
</style>
