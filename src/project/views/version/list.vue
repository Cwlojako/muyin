<template>
  <el-row>
    <el-col style="margin:10px 1%;width: 98%;">
      <el-tabs type="border-card">
        <el-tab-pane label="iPhone">
          <iphone></iphone>
        </el-tab-pane>
        <el-tab-pane label="Android_手机端">
          <android></android>
        </el-tab-pane>
        <el-tab-pane label="Android_平板终端">
          <android-panel></android-panel>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>

</template>
<script>
  import iphone from './versionComp/iphone'
  import android from "./versionComp/android"
  import androidPanel from "./versionComp/androidPanel"
  export default {
    components: {
      iphone, android, androidPanel
    }
  }
</script>
<style lang="less" scoped>
</style>
