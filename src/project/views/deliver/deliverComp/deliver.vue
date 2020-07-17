<template>
  <!--  未发货组件-->
  <div>
    <el-col :span="24">
      <search
        style="width: 95%;margin: 10px auto"
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
    </el-col>
    <el-col :span="24">
      <div style="width: 95%;margin: 10px auto;">
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
    <!--    数据表格-->
    <el-col :span="24">
      <el-table :data="data" style="width: 95%;margin:0 auto;">
        <el-table-column prop="orderId" label="订单号">
          <template slot-scope="scope">
            <el-button @click.native.stop="toDetail(scope.row)" size="small" type="text">{{scope.row.username}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称"></el-table-column>
        <el-table-column prop="phone" label="用户手机号"></el-table-column>
        <el-table-column prop="receiveName" label="收件人"></el-table-column>
        <el-table-column prop="receivePhone" label="收件人手机号"></el-table-column>
        <el-table-column prop="orderType" label="订单类型"></el-table-column>
        <el-table-column prop="creatAt" label="下单时间" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click.native.stop='handleDeliver(scope.row)' size="small" type="text">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--    发货对话框-->
    <el-dialog
      title="填写物流信息"
      :visible.sync="deliverProps.visible"
      :modal-append-to-body='false'
      :append-to-body="true"
      width="30%"
      :before-close="handleClose">
      <el-form :model="formValidate" status-icon :rules="rules" label-width="150px">
        <el-form-item label="物流公司" prop="company">
          <el-select v-model="formValidate.company" placeholder="请选择物流公司">
            <el-option value="1" label="顺丰"></el-option>
            <el-option value="2" label="申通"></el-option>
            <el-option value="3" label="中通"></el-option>
            <el-option value="4" label="圆通"></el-option>
            <el-option value="5" label="韵达"></el-option>
            <el-option value="6" label="邮政"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="checkPass">
          <el-input v-model="formValidate.id"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click='handleClose' type="info">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Search from '@/framework/components/search'
  import {search,count,get} from '@/project/service/manager'
  export default {
    name: "deliverList",
    components: {
      Search
    },
    data() {
      return {
        model: 'deliver',
        searchItems: [
          {
            name: "订单号",
            key: "id",
            type: "string"
          },
          {
            name: "用户手机号",
            key: "phone",
            type: "string"
          },
          {
            name: "收货人姓名",
            key: "receiveName",
            type: "string"
          },
          {
            name: "收货人手机号",
            key: "receivePhone",
            type: "string"
          },
          {
            name: "下单时间",
            key: "creatAt",
            type: "datetimerange"
          }
        ],
        // 顶部搜索框额外查询参数
        extraParam: {},
        // 待发货数据信息
        data: [],
        deliverProps: {
          visible: false
        },
        // 表单绑定数据对象
        formValidate: {
          company: '',
          deliverId: ''
        },
        // 表单验证规则
        rules: {},
        pageSize: 10,
        page: 1,
        total: 0,
        orderId: 0
      }
    },
    created() {
      this.$store.dispatch('GET_USER_CACHE')
      this.search(1)
    },
    methods: {
      searchBySearchItem(searchItems) {
        let keys = [];
        for (
          let i = 0,
            searchItemList = this.searchItems,
            len = searchItemList.length;
          i < len;
          i++
        ) {
          keys.push(searchItemList[i].key);
        }
        for (let i in keys) {
          // keys: [username,realname,roleId,status]
          if (searchItems[keys[i]]) {
            // 如果该单元表单中有输入查询条件,则加入到extraParams中作为请求参数
            this.extraParam[keys[i]] = searchItems[keys[i]];
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        this.search(1);
      },
      // 调用接口查询数据
      search(page) {
        let _t = this;
        _t.page = page;
        let param = {
          pageable: {
            page: page,
            size: _t.pageSize,
            sort: _t.sort
          },
          manager: _t.extraParam
        };
        // 调用接口 查询数据
        search(param, res => {
          _t.data = res;
          _t.getTotal();
        });
      },
      // 获取数据总条数
      getTotal() {
        let _t = this;
        let param = {manager: _t.extraParam};
        count(param, res => {
          _t.total = parseInt(res);
        });
      },
      handleDeliver(row) {
        get({id: row.id}, res => {
          this.formValidate = res;
        });
        this.deliverProps.visible = true
      },
      handleClose() {
        this.deliverProps.visible = false
      },
      handleConfirm() {
        this.deliverProps.visible = false
        setTimeout(()=> {
          this.$confirm('订单发货成功', '提示', {
            confirmButtonText: '确定',
            type: 'success'
          }).then(() => {
            this.$router.push({path: `/${this.model}/show/delivering/`+ this.orderId})
          })
        }, 500)
      },
      toDetail(row) {
        this.$router.push({path: `/${this.model}/show/deliver/`+ row.id})
      },
      // 监听当前页码的变化
      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },
      // 监听每页显示条目数的变化
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(this.page);
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
