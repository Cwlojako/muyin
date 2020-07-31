<template>
  <el-dialog
    title="添加优惠券"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :before-close="handleClose">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formValidate.name" placeholder="输入优惠券名称"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formValidate.type" placeholder="请选择优惠券类型">
          <el-option value="满减" label="满减"></el-option>
          <el-option value="满折" label="满折"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="面额" prop="discount">
        <el-input v-model="formValidate.discount" placeholder="输入面额"></el-input>
      </el-form-item>
      <el-form-item label="起用条件" prop="precondition">
        <el-input v-model="formValidate.precondition" placeholder="输入起用条件"></el-input>&nbsp;元
      </el-form-item>
      <el-form-item label="失效时间" prop="expirationTime">
        <el-date-picker
          v-model="formValidate.expirationTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择失效日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="领取结束时间" prop="endTime">
        <el-date-picker
          v-model="formValidate.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择领取结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="数量" prop="total">
        <el-input v-model="formValidate.total" placeholder="输入该优惠券总量"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm('formValidate')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Upload from "@/framework/components/upload";
  import emitter from '@/framework/mixins/emitter'
  import {save} from '@/project/service/coupon'

  export default {
    mixins: [emitter],
    components: {
      Upload
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        // 添加表单校验规则
        ruleValidate: {
          name: [{required: true, message: "优惠券名称不能为空", trigger: "blur"}],
          type: [{required: true, message: "请选择优惠券类型", trigger: "change"}],
          discount: [{required: true, message: "面额不能为空，满减券填写金额，满折券填写折扣", trigger: "blur"}],
          precondition: [{required: true, message: "启用条件金额不能为空", trigger: "blur"}],
          expirationTime: [{required: true, message: "失效时间不能为空", trigger: "cahnge"}],
          endTime: [{required: true, message: "领取结束时间不能为空", trigger: "change"}],
          total: [{required: true, message: "昵称不能为空", trigger: "blur"}]
        },
        model: 'coupon',
        formValidate: {
          name: '',
          type: '',
          discount: '',
          precondition: '',
          expirationTime: '',
          endTime: '',
          total: ''
        }
      }
    },
    methods: {
      handleClose() {
        this.$refs.formValidate.resetFields();
        this.$emit('on-dialog-close');
      },
      handleConfirm(name) {
        this.$refs[name].validate(valid => {
          if (!valid) return false
          save(
            {[this.model]: this.formValidate},
            res => {
              this.$message.success('添加成功');
              this.handleClose();
              this.$emit('onRefreshData');
          })
        }) 
      }
    },
    filters: {
      updateTime(val) {
        let expirationTime = +new Date(val)
        let now = +new Date().getTime()
        let duration = timeStamp - now
        if (duration < 0) {
          return 0
        } else {
          return duration/86400
        }
      }
    }
  }
</script>

<style scoped>

</style>
