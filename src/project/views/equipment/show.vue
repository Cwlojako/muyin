<template>
  <div>
    <el-col :span="24">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>设备详情</span>
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
          <span class="text_label">设备类型：{{device.type}}</span>
        </div>
        <div class="text item">
          <span class="text_label">设备编号：{{device.number}}</span>
        </div>
        <div class="text item">
          <span class="text_label">Mac地址：{{device.mac}}</span>
        </div>
        <div class="text item">
          <span class="text_label">创建时间：{{device.createTime}}</span>
        </div>
        <div class="text item">
          <span class="text_label">备注：{{device.comment}}</span>
        </div>
      </el-card>
    </el-col>
    <!-- 编辑弹框-->
    <el-dialog
      title="基本信息"
      :visible.sync="dialogVisible"
      :modal-append-to-body='false'
      width="50%"
      :before-close="handleClose">
      <el-form ref="formValidate" :model="formValidate" :rules='ruleValidate' label-width="160px">
        <el-form-item label="设备编号" prop="number">
          <el-input v-model="formValidate.number" placeholder="输入编号"></el-input>
        </el-form-item>
        <el-form-item label="Mac地址" prop="mac">
          <el-input v-model="formValidate.mac" placeholder="输入Mac地址"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="formValidate.comment" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button type="info" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getById, update } from "../../service/device";

  export default {
    data() {
      return {
        // 设备id
        id: 0,
        device: {},
        // 控制编辑框的显示与隐藏
        dialogVisible: false,
        // 编辑表单对象
        formValidate: {},
        // 验证表单对象
        ruleValidate: {
          number: [{required: true, message: '请输入设备编号', trigger: 'blur'}],
          mac: [{required: true, message: '请输入物理地址', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.id = this.$route.params.id
      this.getDeviceData(this.id)
    },
    methods: {
      // 获取设备详情
      getDeviceData(id) {
        getById({id}, res => {
          this.device = res
        })
      },

      // 关闭添加 编辑弹框
      handleClose() {
        this.dialogVisible = false;
      },

      // 处理编辑
      handleConfirm() {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            let obj = Object.assign({id: this.id}, this.formValidate)
            update({
              device: obj
            }, res => {
              this.dialogVisible = false
              this.getDeviceData(this.id)
              this.$message({
                type: 'success',
                message: '更新设备信息成功'
              })
            })
          } else {
            return false
          }
        })
      },

      // 监听更多操作点击选择对应的操作
      handleClick(command) {
        switch (command) {
          case '编辑':
            this.dialogVisible = true;
            this.formValidate = this.device
            break;
        }
      }
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
