<template>
  <div class="user-detail">
    <el-col :span="6" class='user-detail-left'>
      <el-card class="box-card">
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>基本信息</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="编辑">编辑</el-dropdown-item>
              <el-dropdown-item command="启用"
              :disabled="manager.enabled"
              :style="manager.enabled ? {'color':'rgba(255,255,255,0.4)'} : {'color':'#fff'}">
                启用
              </el-dropdown-item>
              <el-dropdown-item command="禁用" 
              :disabled="!manager.enabled"
              :style="!manager.enabled ? {'color':'rgba(255,255,255,0.4)'} : {'color':'#fff'}">
                禁用
              </el-dropdown-item>
              <el-dropdown-item command="修改密码">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item avatar">
          <span class="text_label">头像：</span>
          <img
            v-if='manager.avatar'
            style="width: 50px; height: 50px;border-radius: 40px;"
            :src=$store.state.prefix+manager.avatar
            @click="imgVisible = true" />
        </div>
        <div class="text-item">
          <span class="text_label">账号：</span>
          {{manager.username}}
        </div>
        <div class="text-item">
          <span class="text_label">手机号：</span>
          {{manager.phone}}
        </div>
        <div class="text-item">
          <span class="text_label">姓名：</span>
          {{manager.realname}}
        </div>
        <div class="text-item">
          <span class="text_label">状态：</span>
          {{manager.enabled ? '启用' : '禁用'}}
        </div>
        <div class="text-item">
          <span class="text_label">备注：</span>
          {{manager.comment}}
        </div>
      </el-card>
    </el-col>
    <el-col :span="18" class='user-detail-right'>
      <el-card class="box-card-large">
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色设置" name="first">
            <el-col :span="24">
              <div class="table-button">
                <div>
                  <el-button type="primary" @click="roleVisible = true">添加角色</el-button>
                  <el-button @click="removeRole">删除角色</el-button>
                </div>
              </div>
              <el-table class='table-data' :data="myRoleList" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column prop="comment" label="角色备注"></el-table-column>
              </el-table>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>

    <i-edit
      :dialog-visible="editProps.visible"
      :edit-id="editId"
      @on-dialog-close="handleClose"
      @onRefreshData='get'
    ></i-edit>

    <preview-img :img-visible="imgVisible" :img-url="manager.avatar" @on-preview-cancel="handleClose">
    </preview-img>

    <el-dialog
      title="修改密码"
      :visible.sync="sercetVisible"
      :modal-append-to-body='false'
      :append-to-body="true"
      width="50%"
      :before-close="handleClose">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm('ruleForm')">确 定</el-button>
        <el-button type="info" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="添加角色"
      :visible.sync="roleVisible"
      :modal-append-to-body='false'
      :append-to-body="true"
      width="50%"
      :before-close="handleClose">
      <div class="pager-group">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes,jumper,prev,next"
          :total="total">
        </el-pagination>
      </div>
      <el-table
        :data="roleList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
        >
        </el-table-column>
        <el-table-column
          prop="comment"
          label="角色备注"
        >
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRole">确 定</el-button>
        <el-button type="info" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {get, enable, disable, addRole, removeRole, updatePassword} from '@/project/service/manager'
  import {search, count, findByAccount} from '@/project/service/role'
  import previewImg from '@/framework/components/previewImg/previewImg.vue'
  import IEdit from './edit'

  export default {
    name: "show",
    components: {
      IEdit, previewImg
    },
    data() {
      // 密码自定义校验规则
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      // 确认密码自定义校验规则
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        manager: {},
        editProps: {
          visible: false
        },
        imgVisible: false,
        sercetVisible: false,
        roleVisible: false,
        id: this.$route.params.id,
        editId: 0,
        activeName: 'first',
        page: 1,
        pageSize: 10,
        roleList: [],
        total: 0,
        rules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        },
        ruleForm: {
          pass: '',
          checkPass: '',
        },
        selection: [],
        myRoleList: []
      }
    },
    created() {
      this.get();
      this.findByAccount();
    },
    methods: {
      get() {
        get({id: this.id}, res => {
          this.manager = res;
        });
      },
      roleSearch() {
        let param = {
          pageable: {
            page: this.page,
            size: this.pageSize,
            sort: this.sort
          },
          role: {}
        };
        search(param, res => {
          let arr = res.filter(item => {
            return this.myRoleList.indexOf(item) === -1
          });
          this.roleList = arr;
          this.roleCount();
        });
      },
      roleCount() {
        count({role: {}}, res => {
          this.total = res;
        })
      },
      handleSelectionChange(val) {
        this.selection = val;
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.roleSearch();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.roleSearch();
      },
      handleClose() {
        this.editProps.visible = false;
        this.imgVisible = false;
        this.sercetVisible = false;
        this.roleVisible = false;
      },
      handleClick(command) {
        switch (command) {
          case '编辑':
            this.editId = this.id;
            this.editProps.visible = true;
            break;
          case '修改密码':
            this.sercetVisible = true;
            break;
          case '禁用':
            disable({id: this.id}, res => {
              this.$message({
                type: 'success',
                message: '已禁用!'
              });
              this.get();
            })
            break;
          case '启用':
            enable({id: this.id}, res => {
              this.$message({
                type: 'success',
                message: '已启用!'
              });
              this.get();
            })
            break;
        }
      },
      handleConfirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updatePassword({id: this.id, password: this.ruleForm.pass}, res => {
              this.$message.success('修改成功');
              this.sercetVisible = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      reload() {
        this.roleSearch();
      },
      addRole(id) {
        this.selection.forEach((item,index) => {
          addRole({id: parseInt(this.id), roleId: item.id}, res => {
            if (index === this.selection.length-1) {
              this.$message.success('添加成功');
              this.findByAccount();
              this.handleClose();
            }
          })
        })
      },
      removeRole(id) {
        this.selection.forEach((item,index) => {
          removeRole({id: this.id, roleId: item.id}, res => {
            if (index === this.selection.length-1) {
              this.$message.success('删除成功');
              this.findByAccount();
            }
          })
        })
      },
      findByAccount() {
        findByAccount({account: {id: this.id}}, res => {
          this.myRoleList = res;
          this.roleSearch();
        })
      },
    }
  }
</script>

<style scoped>
 .avatar {
   display: flex;
 }
</style>
