<template>
  <!-- 发货详情页 -->
  <div class='user-detail'>
    <el-col :span="6" class='user-detail-left'>
      <!-- 基本信息 -->
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>基本信息</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="发货">发货</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">订单号：</span>
          {{manager.status}}
        </div>
        <div class="text-item">
          <span class="text_label">用户昵称：</span>
          {{manager.nickname}}
        </div>
        <div class="text-item">
          <span class="text_label">用户手机号：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">收件人：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">手机号码：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">所在地区：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">详细地址：</span>
          {{manager.email}}
        </div>
        <div class="text-item">
          <span class="text_label">下单时间：</span>
          {{manager.email}}
        </div>
      </el-card>
    </el-col>
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>商品清单信息</span>
        </div>
        <!-- 数据表格 -->
        <el-col :span="24" class='table-data'>
          <el-table :data="data">
            <el-table-column prop="username" label="商品名称"></el-table-column>
            <el-table-column prop="spec" label="商品规格"></el-table-column>
            <el-table-column prop="num" label="数量"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.stop="setBatch(scope.row)">设置批次</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-col>
    <el-dialog title="货品批次选择"
      :visible.sync="setBatchProps.visible"
      :modal-append-to-body="false"
      width="50%"
      :before-close="handleClose">
      <div class="set-batch-top">
        <div class="item">
          <span>商品名称：</span>
          <span>雅培二段婴幼儿奶粉</span>
        </div>
        <div class="item">
          <span>规格：</span>
          <span>1.5kg</span>
        </div>
        <div class="item">
          <span>数量：</span>
          <span>{{num}}</span>
        </div>
      </div>
      <div>
      <el-form :model="formValidate" inline>
        <el-row v-for="(item, index) in formValidate.items" :key="index">
          <el-form-item label="批次号">
            <el-select v-model="defaultOptions" clearable v-if="index === 0">
              <el-option v-for="opt in options" :label="opt.label" :value="opt.value" :key="opt.value"></el-option>
            </el-select>
            <el-select v-model="item.options" clearable v-if="index !== 0">
              <el-option v-for="opt in options" :label="opt.label" :value="opt.value" :key="opt.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="item.num"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
                v-if="index !== 0"
                type="info"
                @click="delRow(index)"
                size="small"
            >删除</el-button>
            <el-button
                v-if="index === 0"
                type="primary"
                @click="addRow"
                size="small"
            >新增</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      </div>
      <div slot="footer">
        <el-button type="info" @click="handleClose">取消</el-button>
        <el-button type="primary" :disabled="limit" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
    <!--    发货对话框-->
    <el-dialog
      title="填写物流信息"
      :visible.sync="deliverProps.visible"
      :modal-append-to-body='false'
      :append-to-body="true"
      width="30%"
      :before-close="handleClose">
      <el-form :model="deliverForm" status-icon label-width="150px">
        <el-form-item label="物流公司" prop="company">
          <el-select v-model="deliverForm.company" placeholder="请选择物流公司">
            <el-option value="1" label="顺丰"></el-option>
            <el-option value="2" label="申通"></el-option>
            <el-option value="3" label="中通"></el-option>
            <el-option value="4" label="圆通"></el-option>
            <el-option value="5" label="韵达"></el-option>
            <el-option value="6" label="邮政"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="id">
          <el-input v-model="deliverForm.deliverId"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click='handleClose' type="info">取消</el-button>
        <el-button type="primary" @click="handleDeliver">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {get, enable, disable, search} from '@/project/service/manager'
  import Search from '@/framework/components/search'
  export default {
    name: "showDeliver",
    components: {
      Search
    },
    data() {
      return {
        manager: {},
        model: 'deliver',
        id: this.$route.params.id,
        data: [],
        // 该商品购买数量
        num: 5,
        // 货品批次设置表单数据对象
        formValidate: {
          items: [{
            num: 0
          }]
        },
        // 发货物流表单数据
        deliverForm: {
          company: '',
          deliverId: ''
        },
        // 批次选项
        options: [
          {value: 1, label: '20200000516'},
          {value: 2, label: '20200000517'},
          {value: 3, label: '20200000112'},
          {value: 4, label: '20200000512'},
          {value: 5, label: '20200000492'},
          {value: 6, label: '20200000500'},
        ],
        // 默认选择生产日期最前的批次
        defaultOptions: '',
        id: this.$route.params.id,
        setBatchProps: {
          visible: false
        },
        deliverProps: {
          visible: false
        },
        // 额外搜索条件参数
        extraParam: {},

        // 分页组件参数
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    created() {
      this.$store.dispatch('GET_USER_CACHE')
      this.get();
      this.search(1)
    },
    mounted() {
      this.initNum()
    },
    computed: {
      // 从批次中选择的商品数量总计必须等于该订单的数量，否则确定按钮禁用
      limit() {
        let total = 0
        this.formValidate.items.forEach(item => {
          console.log(item)
          total += parseInt(item.num)
        })
        console.log(total)
        if (total !== this.num) {
          return true
        }
        return false
      },
    },
    methods: {
      // 初始化第一个批次的数量
      initNum() {
        this.formValidate.items[0].num = this.num
      },
      // 增加行
      addRow() {
        this.formValidate.items.push({
          num: 0,
          options: [
            {value: 1, label: '20200000516'},
            {value: 2, label: '20200000517'},
            {value: 3, label: '20200000112'},
            {value: 4, label: '20200000512'},
            {value: 5, label: '20200000492'},
            {value: 6, label: '20200000500'},
          ]
        })
      },
      // 删除行
      delRow(index) {
        this.formValidate.items.splice(index, 1);
      },
      // 批次号默认选择生产日期最前的一个，也即是数值最小,获取生产日期最前的批次数所对应option的label值
      getMinBatch() {
        let arr = []
        for (let i of this.options) {
          arr.push(parseInt(i.label))
        }
        // 得到批次号的最小值
        let min = Math.min.apply(null, arr)
        this.defaultOptions = min + ''
      },
      get() {
        get({id: this.id}, res => {
          this.manager = res;
        });
      },
      handleClick(command){
        switch (command) {
          case '发货':
            this.deliverProps.visible = true
            break;
        }
      },
      // 用户详情列表查询交易记录
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
        search(param, res => {
          let data = res;
          _t.data = data;
        });
      },

      // 分页组件监听函数
      // 监听当前页数变换
      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },
      // 监听当前页条目数变换
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(this.page);
      },

      setBatch(row) {
        this.getMinBatch()
        this.setBatchProps.visible = true
      },
      handleClose() {
        this.setBatchProps.visible = false
        this.deliverProps.visible = false
        // 将表单置为原始值
        this.initNum()
      },

      // 完成批次选择
      handleConfirm() {
        // 默认不选的情况下会选择生产日期最前的且批次中有符合顾客选择规格的商品，对该批次中的商品进行扣除
        // 扣除完后需要重新计算库存
      },

      //确定发货
      handleDeliver() {
        this.deliverProps.visible = false
        setTimeout(()=> {
          this.$confirm('订单发货成功', '提示', {
            confirmButtonText: '确定',
            type: 'success'
          }).then(() => {
            //跳转到已发货详情页
            this.$router.push({path: `/${this.model}/show/delivering/${this.id}`})
          })
        }, 500)
      }
    }
  }
</script>

<style lang='less' scoped>
  .set-batch-top {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    .add-batch-btn {
      margin-left: 10px;
    }
    .item {
      flex: 1;
    }
  }
</style>
