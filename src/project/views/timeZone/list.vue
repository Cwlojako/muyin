<template>
  <el-row class="page">
    <!--    按钮和分页-->
    <el-col :span="24">
      <div style="width: 95%;margin: 10px auto;">
        <el-button style="background: rgb(0, 161, 108);border: none" icon="el-icon-plus" type="primary" @click="toCreate">新建</el-button>
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
    <!--    表格-->
    <el-col :span="24">
      <el-table
        :data="timeZoneData"
        style="width: 95%;margin:0 auto;">
        <el-table-column prop="name" label="时区名称"></el-table-column>
        <el-table-column prop="delta" label="系统时差"></el-table-column>
      </el-table>
    </el-col>
    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @refreshData='getTimeZoneData(1)'/>
  </el-row>
</template>
<script>
  import ICreate from "./create"
  import { search, count } from '@/project/service/timezone'

  export default {
    data() {
      return {
        model: "timeZone",
        createProps: {
          visible: false
        },
        editId: 0,//编辑id
        timeZoneData: [],
        pageSize: 10,
        page: 1,
        total: 0
      };
    },
    components: {
      ICreate
    },
    methods: {
      toCreate() {
        this.createProps.visible = true;
      },

      getTimeZoneData(page) {
        search({timezone: {}, pageable: {page: page, size: this.size, desc: 'id'}}, res => {
          this.timeZoneData = res
          this.getTotal()
        })
      },

      getTotal() {
        count({timezone: {}}, res => {
          this.total = parseInt(res);
        });
      },

      handleClose() {
        this.createProps.visible = false;
      },

      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },

      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(this.page);
      },
    },
    mounted() {
      this.getTimeZoneData(1);
    }
  };
</script>
<style lang="less" scoped>
</style>
