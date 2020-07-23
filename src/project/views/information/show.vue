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
              <el-dropdown-item command="启用"
                :disabled="articleData.enabled"
                :style="articleData.enabled ? {'color':'rgba(255,255,255,0.4)'} : {'color':'#fff'}">
                  启用
              </el-dropdown-item>
              <el-dropdown-item command="禁用" 
                :disabled="!articleData.enabled"
                :style="!articleData.enabled ? {'color':'rgba(255,255,255,0.4)'} : {'color':'#fff'}">
                  禁用
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">状态：</span>
          {{articleData.enabled ? '启用' : '禁用'}}
        </div>
        <div class="text-item">
          <span class="text_label">更新时间：</span>
          {{articleData.createTime}}
        </div>
        <div class="text-item">
          <span class="text_label">浏览数：</span>
          {{articleData.viewQuantity}}
        </div>
        <div class="text-item">
          <span class="text_label">收藏数：</span>
          {{articleData.favoriteQuantity}}
        </div>
        <div class="text-item">
          <span class="text_label">分享次数：</span>
          {{articleData.shareQuantity}}
        </div>
        <div class="text-item">
          <span class="text_label">评论数：</span>
          {{commentData.length}}
        </div>
      </el-card>
    </el-col>
    <!--    图文详情-->
    <el-col :span="18" class='user-detail-right'>
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>文章内容</span>
        </div>
        <div class='detail-title'>
          <span class='title'>文章标题：</span>
          <span class='content'>{{articleData.title}}</span>
        </div>
        <div class='detail-title'>
          <span class='title'>文章内容：</span>
          <div class='content-wrapper'>
            <div v-html='articleData.content'></div>
          </div>
        </div>
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
          <el-table :data="commentData">
            <el-table-column prop="phone" label="评论人手机号"></el-table-column>
            <el-table-column prop="name" label="评论人姓名"></el-table-column>
            <el-table-column sortable prop="createTime" label="评论时间"></el-table-column>
            <el-table-column prop="content" label="评论内容"></el-table-column>
            <el-table-column prop="enabled" label="状态">
              <template slot-scope="scope">
                {{scope.row.enabled ? '启用' : '禁用'}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click.stop="handleStatusChange(scope.row)" type="text" size="small">{{scope.row.enabled ? '禁用' : '启用'}}</el-button>
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
      @onRefreshData="getById"
      :editId="id"
    />
  </div>
</template>

<script>
  import { get, updateEnable }  from '@/project/service/article'
  import { findByPostAndArticle, countByPostAndArticle, updateCommentEnable } from '@/project/service/comment'
  import iEdit from './edit'
  export default {
    data() {
      return {
        model: 'article',
        textarea:'',
        commentData: [],
        articleData: {},
        id: this.$route.params.id,
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
      this.getById();
      this.getCommentById(1)
    },
    methods: {
      handleStatusChange(row) {
        let status = row.enabled ? '禁用' : '启用'
        this.$confirm(`确定${status}选中内容？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status === '禁用') {
            updateCommentEnable({id: row.id, enable: false}, res => {
              this.$message({
                type: 'success',
                message: '已禁用!'
              });
              this.getCommentById(this.page);
            })
          } else {
            updateCommentEnable({id: row.id, enable: true}, res => {
              this.$message({
                type: 'success',
                message: '已启用!'
              });
              this.getCommentById(this.page);
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getById() {
        get({id: this.id}, res => {
          this.articleData = res;
        });
      },
      getCommentById(page) {
        let param = {
          article: {
            id: this.id
          },
          pageable: {
            page: page,
            size: this.pageSize
          }
        }
        findByPostAndArticle(param, res => {
          this.commentData = res
          this.getTotal()
        })
      },
      // 获取数据总条数
      getTotal() {
        let param = {
          article: {
            id: this.id
          }
        }
        countByPostAndArticle(param, res => {
          this.total = res
        })
      },
      handleClick(command){
        switch (command) {
          case '编辑':
            this.editProps.visible = true;
            break;
          case '启用':
            this.updateEnable()
            break;
          case '禁用':
            this.updateDisable()
            break;
        }
      },
      // 启用文章
      updateEnable() {
        updateEnable({id: this.id, enable: true}, res => {
          this.$message({
            type: 'success',
            message: '已启用!'
          });
          this.getById();
        })
      },
      // 禁用文章
      updateDisable() {
        updateEnable({id: this.id, enable: false}, res => {
          this.$message({
            type: 'success',
            message: '已禁用!'
          });
          this.getById();
        })
      },
      handleClose(){
        this.editProps.visible = false
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
.detail-title {
  margin: 5px 0;
  .content-wrapper {
    padding: 10px;
    /deep/img {
      display: block;
      margin: 5px 0;
    }
  }
}
</style>
