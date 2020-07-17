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
      :platform="messageType"
      @on-dialog-close="handleClose"
      @on-save-success="onSaveSuccess"
    />
  </el-row>
</template>

<script>
  import ICreate from "../create"
  import Emitter from '@/framework/mixins/emitter'
  import {search, count} from '@/project/service/version'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "version",
        createProps: {
          visible: false
        },
        data: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        messageType:'android',
      };
    },
    components: {
      ICreate
    },
    methods: {
      toCreate() {
        this.createProps.visible = true;
      },
      search(page) {
        let _t = this;
        _t.page = page;
        _t.extraParam = {
          platform: this.messageType
        };
        let param = {
          pageable: {
            page: page,
            size: _t.pageSize,
            sort: _t.sort
          },
          [this.model]: _t.extraParam
        };
        search(param, res => {
          let data = res.map (s => {
            s.isOptional  = s.isOptional ? '是' : '否';
            return s;
          });
          _t.data = data;
          _t.getTotal();
        });
      },
      getTotal() {
        let _t = this;
        let param = {[this.model]: _t.extraParam};
        count(param, res => {
          _t.total = parseInt(res);
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

      onSaveSuccess(){
        this.search(this.page);
        this.handleClose();
      }
    },
    mounted() {
      this.search(1);
    }
  };
</script>

<style scoped>

</style>
