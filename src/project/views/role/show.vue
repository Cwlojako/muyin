<template>
  <div class='user-detail'>
    <el-col :span="6" class='user-detail-left'>
      <el-card class="box-card">
        <div slot="header">
          <span class='box-card-header-left'>基本信息</span>
          <el-dropdown  class='box-card-header-right' @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="编辑">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">角色名称：</span>
          {{role.name}}
        </div>
        <div class="text-item">
          <span class="text_label">备注：</span>
          {{role.comment}}
        </div>
      </el-card>
    </el-col>
    <el-col :span="18" class='user-detail-right'>
      <el-card class="box-card-large">
        <el-tabs v-model="activeName">
          <el-tab-pane label="权限设置" name="first">
            <el-tree
              :data="data"
              show-checkbox
              node-key="id"
              :default-expand-all="true"
              :default-checked-keys="defaultList"
              :props="defaultProps"
              @check-change="handleCheckChange"
            >
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>

    <i-edit
      :dialog-visible="editProps.visible"
      :edit-id="editId"
      @on-dialog-close="handleClose"
      @on-save-success="handleSaveSuccess"
    ></i-edit>
    <!--      <el-dialog-->
    <!--        title="查看图片"-->
    <!--        :visible.sync="imgVisible"-->
    <!--        :modal-append-to-body='false'-->
    <!--        width="50%"-->
    <!--        :before-close="handleClose">-->
    <!--        <img :src="'https://www.gunghobox.com/images/'+manager.avatar" alt="" width="100%">-->
    <!--      </el-dialog>-->
  </div>
</template>

<script>
  import {get, enable, disable,addModule,removeModule} from '@/project/service/role'
  import {findAll} from '@/project/service/menu'
  import {findByRoleId} from '@/project/service/module'
  import previewImg from '@/framework/components/previewImg/previewImg.vue'
  import IEdit from './edit'

  export default {
    name: "roleDetail",
    components: {
      IEdit, previewImg
    },
    data() {
      return {
        role: {},
        editProps: {
          visible: false
        },
        imgVisible: false,
        id: this.$route.params.id,
        editId: 0,
        activeName: 'first',
        page: 1,
        pageSize: 10,
        sort: {desc: ['id']},
        roleList: [],
        total: 0,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        defaultList:[]
      }
    },
    created() {
      this.get();
      // this.roleSearch();
      this.findByRoleId();
      // console.log(menuModel);
    },
    methods: {
      get() {
        get({id: this.id}, res => {
          this.role = res;
        });
      },
      handleClose() {
        this.editProps.visible = false;
      },
      handleCheckChange(data, isSelect){
        console.log(data);
        console.log(isSelect);
        if (!data.children) {
          if (isSelect) {
            // 添加权限
            addModule({roleId:this.id,moduleId:data.id},res => {
              this.$message.success('添加成功');
            })
          }else {
            // 删除权限
            removeModule({roleId:this.id,moduleId:data.id},res => {
              this.$message.success('删除成功');
            })
          }
        }
      },
      handleClick(command){
        switch (command) {
          case '编辑':
            this.editId = this.id;
            this.editProps.visible = true;
            break;
        }
      },

      // 获取所有权限并将数据处理成符合树形结构的数据形式
      getMenu(){
        findAll({},res => {
          let list = res.map((s,i) => {
            // 获取二级权限
            let arr = s.moduleList.map((item,index) => {
              let obj = {
                id:item.id,
                label:item.name,
                path: item.path
              };
              return obj;
            });
            return {
              id:s.id,
              label:s.name,
              children:arr
            }
          });
          this.data = list;
        })
      },

      // 根据角色id获取该角色的权限
      findByRoleId(){
        findByRoleId({roleId:this.id},res => {
          // 获取权限对应的id数组并赋值给树形结构为默认选中,
          this.defaultList = res.map(s => {
            return s.id;
          });
          this.getMenu();
        })
      },
      handleSaveSuccess(){
        this.get();
        this.editProps.visible = false;
      }
    }
  }
</script>

<style scoped>
</style>
