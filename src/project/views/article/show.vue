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
          <span class="text_label">评论数：</span>
          
        </div>
      </el-card>
    </el-col>
    <!--    图文详情-->
    <el-col :span="18" class='user-detail-right'>
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>文章内容</span>
        </div>
        <p class='detail-title'>文章标题：{{postData.title}}</p>
        <p class='detail-title'>文章内容：{{postData.content}}</p>
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
          <el-table :data="data" style="width: 95%;margin: 10px auto;">
            <el-table-column prop="type" label="评论类型"></el-table-column>
            <el-table-column prop="phone" label="评论人手机号"></el-table-column>
            <el-table-column prop="name" label="评论人姓名"></el-table-column>
            <el-table-column prop="name" label="回复对象手机号"></el-table-column>
            <el-table-column prop="name" label="回复对象姓名"></el-table-column>
            <el-table-column sortable prop="createAt" label="评论时间"></el-table-column>
            <el-table-column prop="content" label="评论内容"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
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
      @on-save-success="handleSave"
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
        commentArr: []
      }
    },
    components:{
      IEdit, ICreateComment
    },
    created() {
      this.getById();
    },
    methods: {
      send() {
        updateComment({storeId: this.id,comment:this.textarea}, res => {
          this.$message({
            type: 'success',
            message: '已提交!'
          });
          this.getById();
        });
      },
      getById() {
        get({id: this.id}, res => {
          this.postData = res;
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
        this.search(this.page);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(this.page);
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
</style>
