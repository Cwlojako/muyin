<template>
  <el-dialog
    title="编辑信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body='false'
    width="50%"
    :before-close="handleClose">

    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="疫苗名称" prop="name">
        <el-input v-model="formValidate.name" placeholder="输入疫苗名称"></el-input>
      </el-form-item>
      <el-form-item label="是否收费" prop="free">
        <el-select v-model="formValidate.free" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适应症" prop="indication">
        <el-input v-model="formValidate.indication" type="textarea" placeholder="输入适应症描述"></el-input>
      </el-form-item>
      <el-form-item label="临床应用" prop="application">
        <el-input v-model="formValidate.application" type="textarea" placeholder="输入临床应用描述"></el-input>
      </el-form-item>
      <el-form-item label="不良反应" prop="reaction">
        <el-input v-model="formValidate.reaction" type="textarea" placeholder="输入不良反应描述"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
      <el-button type="info" @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {get, update} from '@/project/service/vaccine'
  import emitter from "@/framework/mixins/emitter"
  export default {
    name: "vaccinEdit",
    mixins: [emitter],
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      id: {
        type: [Number, String]
      }
    },
    data() {
      return {
        model: 'vaccin',
        formValidate: {
          name: '',
          free: '',
          indication: '',
          application: '',
          reaction: ''
        },
        // 添加表单校验规则
        ruleValidate: {
          name: [
            {required: true, message: "账号不能为空", trigger: "blur"}
          ],
          free: [
            {required: true, message: "请选择"}
          ],
          indication: [
            {required: true, message: "请输入适应症描述", trigger: "blur"}
          ]
        },
        options: [
          {
            value: '是',
            label: '是'
          }, {
            value: '否',
            label: '否'
          }
        ]
      }
    },
    watch: {
      // 监听editId的变化，如果发生变化则获取对应id的数据
      id(val) {
        this.get(val);
      }
    },
    methods: {
      handleClose() {
        this.$emit('on-dialog-close');
      },
      handleConfirm() {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            let param = Object.assign({}, this.formValidate)
            if (param.free === '是') {
              delete param.free
              param.free = true
            } else {
              delete param.free
              param.free = false
            }
            update({
              vaccine: param
            }, res => {
              this.handleClose()
              this.$emit('refreshData');
              this.$message({
                type: 'success',
                message: '更新疫苗信息成功'
              })
            })
          } else {
            return false
          }
        })
      },
      get(id) {
        get({id: id}, res => {
          this.formValidate = res;
          this.formValidate.free = res.free ? '是' : '否'
        });
      }
    }
  }
</script>

<style scoped>

</style>
