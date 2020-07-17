<template>
  <!--  帮助中心文章详情页-->
  <div class="user-detail">
    <!--    基本信息-->
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
              <el-dropdown-item command="启用">启用</el-dropdown-item>
              <el-dropdown-item command="禁用">禁用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">状态：</span>
          {{page.status}}
        </div>
        <div class="text-item">
          <span class="text_label">更新时间：</span>
          {{page.updateAt}}
        </div>
        <div class="text-item">
          <span class="text_label">浏览数：</span>
          {{page.viewNum}}
        </div>
        <div class="text-item">
          <span class="text_label">收藏数：</span>
          {{page.collectNum}}
        </div>
        <div class="text-item">
          <span class="text_label">分享次数：</span>
          {{page.shareNum}}
        </div>
        <div class="text-item">
          <span class="text_label">评论数：</span>
          {{page.commentNum}}
        </div>
      </el-card>
    </el-col>
    <!--    图文详情-->
    <el-col :span="18" class='user-detail-right'>
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>文章内容</span>
        </div>
        <div v-html="page.content"></div>
      </el-card>
    </el-col>
    <!--    评论记录-->
    <el-col :span="24" class="detail-bottom">
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>评论记录</span>
        </div>
        <!--    分页-->
        <el-col :span="24">
          <div style="width: 95%;margin: 10px auto;">
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
          </div>
        </el-col>
        <el-col :span="24" class="detail-bottom-table">
          <el-table :data="data">
            <el-table-column prop="phone" label="评论人手机号"></el-table-column>
            <el-table-column prop="name" label="评论人姓名"></el-table-column>
            <el-table-column sortable prop="createAt" label="评论时间"></el-table-column>
            <el-table-column prop="content" label="评论内容"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click.stop="handleStatusChange(scope.row)" type="text" size="small">{{scope.row.status.indexOf('启用') >= 0 ? '禁用' : '启用'}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-col>
    <!--    编辑弹框-->
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
  import { search, count }  from '@/project/service/manager'
  import iEdit from './edit'
  export default {
    name: "show",
    data() {
      return {
        model: 'manager',
        data: [],
        extraParam: {},
        textarea:'',
        page: {},
        id: this.$route.params.id,
        editId: parseInt(this.$route.params.id),
        activeName: 'first',
        editProps:{
          visible:false
        },
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    components:{
      iEdit
    },
    created() {
      this.findById();
      this.search(1)
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
          console.log(res)
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
      search(page) {
        let _t = this;
        _t.page = page;
        let param = {
          pageable: {
            page: page,
            size: _t.pageSize,
          },
          [this.model]: _t.extraParam
        }
        // 调用接口 查询数据
        search(param, res => {
          console.log(res)
          _t.data = res;
          _t.getTotal();
        });
      },
      // 获取数据总条数
      getTotal() {
        let _t = this;
        let param = {[this.model]: _t.extraParam};
        count(param, res => {
          _t.total = parseInt(res);
        });
      },

      handleStatusChange() {},
      handleClose(){
        this.editProps.visible = false
      },
      handleSave(){
        this.findById();
        this.handleClose();
      },

      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(this.page);
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
        height: 600px;
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
      .box-card {
        height: 600px;
      }
      .tabel-data {
        margin-top: 5px;
      }
    }
    .detail-bottom {
      .detail-bottom-table {
        margin-bottom: 100px;
      }
    }
  }
  .el-card/deep/.el-card__header {
    padding: 10px 18px;
  }
</style>
