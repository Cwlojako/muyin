<template>
  <el-tabs type="border-card">
    <el-tab-pane label="待发货">
      <deliver></deliver>
    </el-tab-pane>
    <el-tab-pane label="已发货">
      <delivering></delivering>
    </el-tab-pane>
    <el-tab-pane label="已收货">
      <received></received>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import deliver from "./deliverComp/deliver"
  import delivering from "./deliverComp/delivering"
  import received from "./deliverComp/received"
    export default {
      components: {
        deliver,
        delivering,
        received
      }
    }
</script>

<style scoped>

</style>
