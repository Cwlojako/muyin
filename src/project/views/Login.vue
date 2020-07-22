<template>
  <div class="page">
    <div class="login-wrapper">
      <div class="login-wrapper-title">
        <h1>母婴后台管理系统</h1>
      </div>
      <div class="login">
        <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" >
          <el-form-item prop="username">
            <el-input class="has-prefix" :maxlength="50" v-model="formValidate.username" placeholder="账户">
              <i class="el-icon-user-solid" slot="prefix" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="has-prefix" :type="'password'" :minlength="6" :maxlength="20" v-model="formValidate.password" placeholder="密码">
              <i class="el-icon-lock" slot="prefix" />
            </el-input>
          </el-form-item>
          <el-form-item >
            <el-button long type="success" @click="handleSubmit('formValidate')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  const md5 = require('js-md5');
  const LOGIN_URL = "/api/manager/authenticateByUsername";
  import { getManagerWithToken } from '@/project/service/user'
  import { post } from "@/framework/http/request"
  export default {
    name: "Login",
    data() {
      return {
        formValidate: {
          username: "cwlojako",
          password: "123456"
        },
        ruleValidate: {
          username: [{required: true,message: "用户名不能为空",trigger: "blur"}],
          password: [{required: true,message: "登录密码不能为空",trigger: "blur"}]
        }
      };
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            // 如果校验成功则发送登录请求
            let param = {
              username: this.formValidate.username,
              // password:  md5(this.formValidate.password),
              password: this.formValidate.password
            };
            // 这里是用axios封装的post方法，第一个参数是路径，第二个参数是参数，第三是回调函数，数据存储在回调中
            post(LOGIN_URL, param ,(res) =>{
              localStorage.setItem('token', res)
              getManagerWithToken(res => {
                localStorage.setItem('userName', res.username)
                this.$store.commit('SAVE_USERNAME', res.username)
                this.$router.push("/index");
              })
              // let user = {
              //   token: res
              // };
              // // console.log(res);
              // // 将用户信息存储到vuex中方便共享
              // this.$store.commit('SAVE_USER', {
              //   user: user,
              // });
              // // 缓存到localstorage中
              // this.$store.dispatch("SAVE_USER_CACHE");
              // // 跳转到index页
            })
          }
        });
      },
      regainCaptcha() {
        var timestamp = (new Date()).valueOf();
        var url = this.$refs.captcha.src;
        if ((url.indexOf("?") >= 0)) {
          url = url.substring(0, url.length - 13) + timestamp;
        } else {
          url = url + "?timestamp=" + timestamp;
        }
        this.$refs.captcha.src = url;
      }
    }
  };
</script>
<style lang="less" scoped>
  .page {
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -100px;
    .login-wrapper {
      width: 100%;
      .login-wrapper-title {
        width: 100%;
        text-align: center;
        color: #ccc;
        padding-bottom: 20px;
      }
      .login {
        width: 400px;
        margin: 0 auto;
      }
    }
  }
  .el-input{
    width: 100%;
  }
  .el-button--success{
    width: 100%;
    background: #19be6b;
  }
</style>
