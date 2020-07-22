<template>
  <el-header style="z-index:999;position:fixed;top: 0;width:100%;display: flex;padding: 0;height: 48px">
    <div class="sider-logo">母婴后台</div>
    <div class="head-setting">
<!--      头部右侧logo文字-->
      <div class="head-setting-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbList"
            :to="{ path: item.path }">
            {{item.name}}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
<!--      头部左侧用户头像-->
      <div class="head-setting-right">
        <el-avatar shape="circle" :size="30" :fit="'fill'"
           :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'"
           class="head-setting-right-avatar">
        </el-avatar>
        <el-dropdown @command="handleClick" v-if="$route.path !== '/login'">
           <span class="el-dropdown-link" style="font-size: 12px">
             {{$store.state.userName}}
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-edit" command="editPsd">修改密码</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dialog
          title="修改密码"
          :visible.sync="dialogVisible"
          :modal-append-to-body='false'
          :append-to-body="true"
          width="50%"
          :before-close="handleClose">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleConfirm('ruleForm')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </el-header>
</template>

<script>
export default {
  name: "layout-header",
  data(){
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
   return{
     projectName: '母婴后台',
     selectValue:'',
     language:'中文',
     options:[
       {
         value: 'zh',
         label: '中文'
       }, {
         value: 'en',
         label: 'English'
       }
     ],
     dialogVisible:false,
     rules: {
       pass: [
         { validator: validatePass, trigger: 'blur' }
       ],
       checkPass: [
         { validator: validatePass2, trigger: 'blur' }
       ],
     },
     ruleForm: {
       pass: '',
       checkPass: '',
     },
   }
  },
  computed:{
    breadcrumbList(){
      return this.$route.meta.breadcrumb;
    },
    store(){
      return this.$store.state;
    }
  },
  methods:{
    handleClick(val) {
      switch (val) {
        case 'editPsd':
          this.dialogVisible = true;
          break;
        case 'logout':
          this.$post('api/user/logout',{},res => {
            this.$message({
              message: '退出成功',
              type: 'success'
            });
            this.$store.commit('SAVE_ITEM',{
              user:''
            });
            this.$router.replace({path:'/login'});
          });
          break;
      }
    },
    handleClose(){
      this.dialogVisible = false;
    },
    handleConfirm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  created() {
    // this.breadcrumbList = this.$route.meta.breadcrumb;
    this.selectValue = localStorage.getItem('name_language') || 'zh'
  }

}
</script>

<style lang="less" scoped>
  .sider-logo {
    color: #57b382;
    background: rgb(20, 31, 41);
    width: 200px;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    letter-spacing: 5px;
  }
  .head-setting{
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    box-shadow: 0 1px 2px 0 rgba(9,18,26,0.06), 0 4px 8px 0 rgba(39,56,73,0.08);
    padding: 0 20px;
    background: #fff;
    >span{
      font-size: 12px;
    }
    /deep/.el-input__inner{
      border: none;
      text-align: right;
    }
    /deep/.el-input{
      width: 100px;
    }
    .head-setting-right {
      height: 100%;
      display: flex;
      align-items: center;
      .head-setting-right-avatar {
        margin-right: 10px;
      }
    }
  }
  .el-dropdown-menu{
    background: #ffffff;
    width: 123px;
    padding: 6px 0;
    font-size: 14px;
    margin: 0;
    border-radius:0;
    .el-dropdown-menu__item{
      color: #606266;
      &:hover{
        background: #f5f7fa;
        color: #606266;
      }
    }
    .popper__arrow{
      opacity: 1;
    }
  }
  .head-setting/deep/.el-select__caret{
    opacity: 0!important;
  }
</style>
