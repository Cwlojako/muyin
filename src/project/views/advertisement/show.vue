<template>
  <div class="user-detail">
    <el-col :span="6" class="user-detail-left">
      <el-card class="box-card">
        <div slot="header" class="box-card-header">
          <span class='box-card-header-left'>基本信息</span>
          <el-dropdown class='box-card-header-right'  @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="编辑">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">广告位：</span>
          {{slide.location}}
        </div>
        <div class="text-item">
          <span class="text_label">广告标题：</span>
          {{slide.title}}
        </div>
        <div class="text-item">
          <span class="text_label">开始时间：</span>
          {{slide.effectiveTime}}
        </div>
        <div class="text-item">
          <span class="text_label">结束时间：</span>
          {{slide.expirationTime}}
        </div>
        <div class="text-item">
          <span class="text_label">排序数字：</span>
          {{slide.position}}
        </div>
        <div class="text-item">
          <span class="text_label">广告图片：</span>
          <img
            v-if='slide.image'
            :src='`${$store.state.prefix}${slide.image}`'
            @click="imgVisible = true"
            class='ad-image'/>
        </div>
      </el-card>
    </el-col >
    <el-col :span="18" class="user-detail-right">
      <el-card class="box-card-large">
        <el-tabs v-model="activeName">
          <el-tab-pane label="广告内容" name="first">
            <div class="text item">
              <span class="text_label">广告类型：</span>
              {{slide.type}}
            </div>
            <div class="text item">
              <span class="text_label">链接：</span>
              {{slide.link}}
            </div>
            <div class="text item" v-if='type === "商品详情"'>
              <span class="text_label">商品名称：</span>
              {{product.name}}
            </div>
            <div class="text item" v-if='type === "图文详情"'>
              <span class="text_label">图文详情：</span>
              <div class='content-wrapper'>
                <h4>{{post.content}}</h4>
                <div class='content-img-wrapper' v-if='post.images'>
                  <el-image
                    v-for='(item, index) in post.images.split(";")'
                    :key='index'
                    :src="$store.state.prefix + item"
                    :fit="'fit'">
                  </el-image>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
    <i-edit
      :dialog-visible="editProps.visible"
      :id="id"
      @on-dialog-close="handleClose"
      @onRefreshData="get"
    ></i-edit>
    <!-- 查看图片 -->
    <el-dialog
      title="查看图片"
      :visible.sync="imgVisible"
      :modal-append-to-body='false'
      width="50%"
      :before-close="handleClose">
      <img :src="$store.state.prefix+slide.image" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
  import { get } from '@/project/service/slide'
  import { findById } from '@/project/service/product'
  import { getPost } from '@/project/service/post'
  import previewImg from '@/framework/components/previewImg/previewImg.vue'
  import IEdit from './edit'

  export default {
    components: {
      IEdit, previewImg
    },
    data() {
      return {
        activeName: 'first',
        slide: {},
        product: {},
        post: {},
        editProps: {
          visible: false
        },
        imgVisible: false,
        id: this.$route.params.id,
        model: 'slide',
        type: ''
      }
    },
    created() {
      this.get();
    },
    methods: {
      get() {
        get({id: this.id}, res => {
          this.slide = res
          this.type = res.type
          if (this.type === '商品详情') {
            let productId = res.link.split(':')[1]
            findById({id: productId}, res => {
              this.product = res
            })
          }
          if (this.type === '图文详情') {
            let postId = res.link.split(':')[1]
            getPost({id: postId}, res => {
              this.post = res
            })
          }
        })
      },
      handleClose() {
        this.editProps.visible = false
        this.imgVisible = false
      },
      handleClick(command){
        switch (command) {
          case '编辑':
            this.editProps.visible = true
            break
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .ad-image {
    margin: 5px 0;
    width: 150px;
    vertical-align: top;
  }
  .content-img-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    .el-image {
      flex: 0 0 33.33%;
      box-sizing: border-box;
      padding: 5px;
      width: 33.33%
    }
  }
</style>
