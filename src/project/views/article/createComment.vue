<template>
  <div>
    <el-dialog
      title="添加评论"
      :visible.sync="dialogVisible"
      :modal-append-to-body='false'
      width="40%"
      :before-close="handleClose">
      <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
        <el-form-item label="关联用户" prop="user">
          <el-input type="text" v-model="formValidate.user" @focus='selectUser'></el-input>
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input type="textarea" v-model="formValidate.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('formValidate')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 关联用户弹框 -->
    <el-dialog
      title="请选择关联用户"
      :visible.sync="userVisible"
      :modal-append-to-body='false'
      width="40%"
      :before-close="handleClose">
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
      <el-table
        :data="userData"
        style="width: 95%;margin:0 auto;"
        highlight-current-row
        @current-change="handleSelect"
        ref='singleTable'
      >
        <el-table-column label="昵称">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.nickname}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { save } from '@/project/service/comment' //接口
  import { search, count } from '@/project/service/user'

  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      id: {
        type: Number,
        default: 0,
      }
    },
    data() {
      const validateUser = (rule, value, callback) => {
        if (this.formValidate.user === '') {
          callback("请选择关联用户");
        } else {
          callback();
        }
      }
      return {
        userId: 0,
        formValidate: {
          user: '',
          content: ''
        },
        ruleValidate: {
          user: [{validator: validateUser, trigger: 'blur'}],
          content: [{required: true, message: '评论内容不能为空'}],
        },
        model: 'comment',
        userVisible: false,
        userData: [],
        page: 1,
        pageSize: 10,
        total: 0,
        radio: ''
      }
    },
    methods: {
      getUserData(page) {
        let param = {
          user: {},
          pageable: {
            page: page,
            size: this.pageSize,
            sort: 'id'
          }
        }
        search(param, res => {
          this.userData = res
          this.getTotal()
        })
      },
      getTotal() {
        let param = {
          user: {}
        }
        count(param, res => {
          this.total = res
        })
      },
      handleClose() {
        this.userVisible = false
        this.$emit('on-dialog-close');
        this.$refs.formValidate.resetFields()
      },
      handleConfirm(name) {
        this.$refs[name].validate(valid => {
          if (!valid) return false
          let param = {
            content: this.formValidate.content,
            user: {
              id: this.userId
            },
            post: {
              id: parseInt(this.$route.params.id)
            }
          }
          save({[this.model]: param}, res => {
            this.$message.success('添加成功');
            this.handleClose()
            this.$emit('onRefreshData');
          })
        })
      },
      selectUser() {
        this.userVisible = true
        this.$nextTick(() => {
          this.$refs.singleTable.setCurrentRow(this.userData[0]);
        })
      },
      confirmUser() {
        this.userVisible = false
      },
      handleSelect(val) {
        this.formValidate.user = val.nickname
        this.userId = val.id
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getUserData(this.page);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.getUserData(this.page);
      }
    },
    created() {
      // 获取用户列表
      this.getUserData(1)
    }
  }
</script>

<style lang="less" scoped>
</style>
