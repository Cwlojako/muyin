<template>
  <el-row class="page">
    <!--    按钮和分页-->
    <el-col :span="24">
      <div style="width: 95%;margin: 10px auto;">
        <el-button style="background: rgb(0, 161, 108);border: none" icon="el-icon-plus"  type="primary" @click="toCreate">新建</el-button>
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
        :data="data"
        style="width: 95%;margin:0 auto;"
      >
        <el-table-column
          prop="number"
          label="版本号"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="版本描述"
        >
        </el-table-column>
        <el-table-column
          prop="isOptional"
          label="强制更新"
        >
        </el-table-column>
        <el-table-column
          prop="updateAt"
          label="更新时间"
        >
        </el-table-column>
      </el-table>
    </el-col>
    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      :platform="platform"
      @on-dialog-close="handleClose"
      @onRefreshData="search(page)"
    />
  </el-row>
</template>

<script>
  import ICreate from "../create"
  import Emitter from '@/framework/mixins/emitter'
  import {search, count} from '@/project/service/application'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "application",
        createProps: {
          visible: false
        },
        data: [],
        selectList: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        platform:'androidPanel',
      };
    },
    components: {
      ICreate
    },
    methods: {
      toCreate() {
        this.createProps.visible = true
      },
      search(page) {
        this.page = page
        this.extraParam = {
          platform: this.platform
        };
        let param = {
          pageable: {
            page: page,
            size: this.pageSize
          },
          [this.model]: this.extraParam
        }
        search(param, res => {
          this.data = data
          this.getTotal()
        });
      },
      getTotal() {
        let param = {
          [this.model]: this.extraParam
        }
        count(param, res => {
          this.total = parseInt(res)
        })
      },

      handleClose() {
        this.createProps.visible = false;
      },

      handleCurrentChange(val) {
        this.page = val
        this.search(this.page)
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.search(this.page)
      }
    },
    mounted() {
      this.search(1)
    }
  };
</script>

<style scoped>

</style>
