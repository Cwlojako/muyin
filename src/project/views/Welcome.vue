<template>
  <el-row class="page">
    <el-col class="welcome" :span="8" :offset="8">欢迎&nbsp;{{$store.state.userName}}</el-col>
  </el-row>
</template>

<script>
    export default {
        name: "Welcome"
    }
</script>

<style lang="less" scoped>
  .page {
    .welcome {
      margin-top: 200px;
      font-size: 30px;
      color: #333333;
      text-align: center;
    }
  }
</style>
