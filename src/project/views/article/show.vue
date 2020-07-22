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
              :disabled="postData.enabled"
              :style="postData.enabled ? {'color':'rgba(255,255,255,0.4)'} : {'color':'#fff'}">
                启用
              </el-dropdown-item>
              <el-dropdown-item command="禁用" 
              :disabled="!postData.enabled"
              :style="!postData.enabled ? {'color':'rgba(255,255,255,0.4)'} : {'color':'#fff'}">
                禁用
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">状态：</span>
          {{postData.enabled ? '启用' : '禁用'}}
        </div>
        <div class="text-item">
          <span class="text_label">更新时间：</span>
          {{postData.createTime}}
        </div>
        <div class="text-item">
          <span class="text_label">评论数：{{commentData.length}}</span>
        </div>
      </el-card>
    </el-col>
    <!--    图文详情-->
    <el-col :span="18" class='user-detail-right' ref='detailRight'>
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>文章内容</span>
        </div>
        <div class='detail-title'>
          <span class='title'>文章标题：</span>
          <span class='content'>{{postData.title}}</span>
        </div>
        <div class='detail-title'>
          <span class='title'>文章内容：</span>
          <span class='content'>{{postData.content}}</span>
        </div>
        <div class='image-wrapper'>
          <el-image
            v-for='(item, index) in images'
            :key='index'
            :src="$store.state.prefix + item"
            :fit="'fit'">
          </el-image>
        </div>
      </el-card>
    </el-col>
    <!--    评论记录-->
    <el-col :span="24" class="detail-bottom">
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>评论记录</span>
        </div>
        <!--    按钮与分页-->
        <el-col :span="24">
          <div style="width: 95%;margin: 10px auto;">
            <el-button style="background: rgb(0, 161, 108);border: none" icon="el-icon-plus"  type="primary" @click="toCreate">添加评论</el-button>
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
          <el-table :data="commentData" style="width: 95%;margin: 10px auto;">
            <el-table-column prop="type" label="评论类型"></el-table-column>
            <el-table-column prop="user.phone" label="评论人手机号"></el-table-column>
            <el-table-column prop="user.nickname" label="评论人姓名"></el-table-column>
            <el-table-column label="回复对象手机号">
              <template slot-scope="scope">
                {{scope.row.parent ? scope.row.parent.user.phone : '-'}}
              </template>
            </el-table-column>
            <el-table-column label="回复对象姓名">
              <template slot-scope="scope">
                {{scope.row.parent ? scope.row.parent.user.nickname : '-'}}
              </template>
            </el-table-column>
            <el-table-column sortable prop="createTime" label="评论时间" width='180'></el-table-column>
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
      :editId='id'
    />

    <!--    添加评论弹框-->
    <i-create-comment
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    />
  </div>
</template>

<script>
  import { get, updateEnable } from '@/project/service/post'
  import { findByPostAndArticle, countByPostAndArticle } from '@/project/service/comment'
  import IEdit from './edit'
  import ICreateComment from './createComment'
  export default {
    data() {
      return {
        model: 'post',
        data: [],
        extraParam: {},
        postData: {},
        id: this.$route.params.id,
        pageSize: 10,
        page: 1,
        total: 0,
        editProps:{
          visible:false
        },
        createProps: {
          visible: false
        },
        // 评论表格数组
        commentData: []
      }
    },
    components:{
      IEdit, ICreateComment
    },
    created() {
      // 获取文章详情
      this.getById()
      // 根据文章id获取评论
      this.getCommentById(1)
    },
    computed: {
      images() {
        if (this.postData.images) {
          return this.postData.images.split(';')
        }
        return []
      }
    },
    methods: {
      getById() {
        get({id: this.id}, res => {
          this.postData = res;
        })
      },
      getCommentById(page) {
        let param = {
          post: {
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
          post: {
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
        this.createProps.visible = false
      },
      handleSave(){
        this.findById();
        this.handleClose();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getCommentById(this.page)
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.getCommentById(this.page);
      },
      // 添加评论弹框
      toCreate() {
        this.createProps.visible = true
      }
    }
  }
</script>
<style lang="less" scoped>
.detail-title {
  margin: 5px 0;
}
.image-wrapper {
  display: flex;
  flex-wrap: wrap;
  .el-image {
    box-sizing: border-box;
    padding: 5px;
    flex: 0 0 33.33%;
    width: 33.33%;
  }
}

</style>
