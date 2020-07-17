<template>
  <!-- 疫苗详情页 -->
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
              <el-dropdown-item command="状态" :disabled="vaccine.enabled"
                                :style="vaccine.enabled ? {'color' : 'rgba(255,255,255,0.1)'} : '#fff'">启用
              </el-dropdown-item>
              <el-dropdown-item command="状态" :disabled="!vaccine.enabled"
                                :style="!vaccine.enabled ? {'color' : 'rgba(255,255,255,0.1)'} : '#fff'">禁用
              </el-dropdown-item>
              <el-dropdown-item command="编辑">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">疫苗名称：</span>
          {{vaccine.name}}
        </div>
        <div class="text-item">
          <span class="text_label">状态：</span>
          {{vaccine.enabled ? '启用' : '禁用'}}
        </div>
        <div class="text-item">
          <span class="text_label">是否收费：{{vaccine.free ? '否' : '是'}}</span>
        </div>
        <div class="text-item">
          <span class="text_label">适应症：{{vaccine.indication}}</span>
        </div>
        <div class="text-item">
          <span class="text_label">临床应用：{{vaccine.application}}</span>
        </div>
        <div class="text-item">
          <span class="text_label">不良反应：{{vaccine.reaction}}</span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="18" class='user-detail-right'>
      <el-card>
        <div slot="header" class='box-card-header'>
          <span class='box-card-header-left'>注射计划管理</span>
          <el-dropdown class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="添加">添加</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 数据表格 -->
        <el-col :span="24" class='tabel-data'>
          <el-table :data="vaccine.periodList">
            <el-table-column prop="duration" label="周期">
              <template slot-scope="scope">
                {{scope.row.duration + '周'}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click='deleteById(scope.row.id)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-col>
    <i-edit
      :dialog-visible="editProps.visible"
      :id="editId"
      @on-dialog-close="handleClose"
      @refreshData='getById(id)'
    ></i-edit>

<!--    添加注射周期对话框-->
    <el-dialog
      title="添加注射周期"
      :visible.sync="addProps.visible"
      :modal-append-to-body='false'
      :append-to-body="true"
      width="50%"
      :before-close="handleClose">
      <el-form :model="formValidate" status-icon :rules='ruleValidate' ref='formValidate'>
        <el-form-item label="注射周期" prop="duration">
          <el-input v-model="formValidate.duration" placeholder="添加注射周期"></el-input>&nbsp;周
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button type="info" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { get, batchUpdateEnable } from '@/project/service/vaccine'
  import { save, deleteById } from '@/project/service/period'
  import IEdit from './edit'
  export default {
    name: "vaccinDetail",
    components: {
      IEdit
    },
    data() {
      return {
        data: [],
        ruleValidate: {
          duration: [{required: true, message: '请输入注射周期', tigger: blur}]
        },
        formValidate: {
          duration: ''
        },
        editProps: {
          visible: false
        },
        addProps: {
          visible: false
        },
        editId: 0,
        // 疫苗数据对象
        vaccine: {}
      }
    },
    created() {
      this.id = this.$route.params.id
      this.getById(this.id);
    },
    methods: {
      getById(id) {
        get({id}, res => {
          this.vaccine = res;
        });
      },
      
      handleClick(command){
        switch (command) {
          case '状态':
            let status = this.vaccine.enabled;
            if (status) {
              // 启用状态 进行禁用
              batchUpdateEnable({idList: [this.id], enable: false}, res => {
                this.$message({
                  type: 'success',
                  message: '已禁用!'
                });
                this.getById(this.id);
              })
            } else {
              // 禁用 状态 进行启用
              batchUpdateEnable({idList: [this.id], enable: true}, res => {
                this.$message({
                  type: 'success',
                  message: '已启用!'
                });
                this.getById(this.id);
              })
            }
            break;
          case '编辑':
            this.editId = this.id
            this.editProps.visible = true;
            break;
          case '添加':
            this.addProps.visible = true;
        }
      },

      handleClose() {
        this.editProps.visible = false;
        this.addProps.visible = false;
      },

      // 确认添加注射周期
      handleConfirm() {
        this.$refs.formValidate.validate(valid => {
          if (!valid) return false
          let param = {
            period: Object.assign(this.formValidate, {vaccine: {id: this.id}})
          }
          save(param, res => {
            this.addProps.visible = false;
            this.getById(this.id)
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          })
        })
      },
    
      // 删除周期
      deleteById(id) {
        deleteById({id}, res => {
          this.getById(this.id)
        })
      }
    }
  }
</script>

<style lang='less' scoped>
</style>
