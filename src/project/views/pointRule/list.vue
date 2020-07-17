<template>
  <div>
    <el-col :span="24">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>积分规则设置</span>
          <el-dropdown @command='handleClick' style="float:right;">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="15" height="10">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="编辑">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text item">
          <span class="text_label">单次分享资讯获赠积分：10</span>
        </div>
        <div class="text item">
          <span class="text_label">资讯分享每日奖励上限：5次</span>
        </div>
        <div class="text item">
          <span class="text_label">单次分享商品获赠积分：10</span>
        </div>
        <div class="text item">
          <span class="text_label">商品分享每日奖励上限：5次</span>
        </div>
        <div class="text item">
          <span class="text_label">单次订单评价获赠积分：10</span>
        </div>
        <div class="text item">
          <span class="text_label">购物赠送积分比例：50%</span>
        </div>
      </el-card>
    </el-col>
    <i-edit
      :dialog-visible="editProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    >
    </i-edit>
  </div>
</template>

<script>
  import IEdit from './edit'
  export default {
    name: "pointRule",
    data() {
      return {
        model: 'pointRule',
        editProps: {
          visible: false
        }
      }
    },
    methods: {
      // 关闭添加 编辑弹框
      handleClose() {
        this.editProps.visible = false;
      },

      // 处理 添加
      handleSave() {
        // 关闭
        this.editProps.visible = false;
      },

      // 监听更多操作点击选择对应的操作
      handleClick(command) {
        switch (command) {
          case '编辑':
            this.editProps.visible = true;
            break;
        }
      }
    },
    components: {
      IEdit
    }
  }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .text_label {
    display: inline-block;
    text-align: right;
  }

  .clearfix {
    position: relative;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 95%;
    margin: 20px;
    display: inline-block;
  }

</style>
