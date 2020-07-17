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
        <div class="text-item" style="display: flex;align-items: center">
          <span class="text_label">广告标签：</span>
          {{page.label}}
        </div>
        <div class="text-item">
          <span class="text_label">排列数字：</span>
          {{page.position}}
        </div>
        <div class="text-item">
          <span class="text_label">创建时间：</span>
          {{page.createAt}}
        </div>
        <div class="text-item">
          <span class="text_label">更新时间：</span>
          {{page.updateAt}}
        </div>
      </el-card>
    </el-col>
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>文章内容</span>
        </div>
        <div v-html="page.content"></div>
      </el-card>
    </el-col>
    <i-edit
      :dialog-visible="editProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
      :editId="editId"
    />
  </div>
</template>

<script>
  import {get} from '@/project/service/page'
  import iEdit from './edit'
  export default {
    name: "show",
    data() {
      return {
        textarea:'',
        page: {
          content: '\u003cb\u003eb\u003c/b\u003e'
        },
        id: this.$route.params.id,
        activeName: 'first',
        editProps:{
          visible:false
        },
        editId:this.$route.params.id,
      }
    },
    components:{
      iEdit
    },
    created() {
      this.findById();
    },

    methods: {
      send() {
        updateComment({storeId: this.id,comment:this.textarea}, res => {
          this.$message({
            type: 'success',
            message: '已提交!'
          });
          this.findById();
        });
      },
      findById() {
        get({id: this.id}, res => {
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
      },
      handleSave(){
        this.findById();
        this.handleClose();
      }
    }
  }
</script>
<style lang="less" scoped>
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
      .tabel-data {
        margin-top: 5px;
      }
    }
  }
  .el-card/deep/.el-card__header {
    padding: 10px 18px;
  }
</style>
