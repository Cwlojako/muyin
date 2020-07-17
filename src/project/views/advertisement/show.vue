<template>
  <div class="user-detail">
    <el-col :span="6" class="user-detail-left">
      <el-card class="box-card">
        <div slot="header" class="box-card-header">
          <span class='box-card-header-left'>基本信息</span>
          <el-dropdown class='box-card-header-right'  @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="14" height="12">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="编辑">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text-item">
          <span class="text_label">广告位：</span>
          {{slide.location}}
        </div>
        <div class="text-item">
          <span class="text_label">广告标题：</span>
          {{slide.title}}
        </div>
        <div class="text-item">
          <span class="text_label">开始时间：</span>
          {{slide.effectAt}}
        </div>
        <div class="text-item">
          <span class="text_label">结束时间：</span>
          {{slide.expireAt}}
        </div>
        <div class="text-item">
          <span class="text_label">排序数字：</span>
          {{slide.position}}
        </div>
        <div class="text-item">
          <span class="text_label">广告图片：</span>
          <img
            style="width: 50px; height: 50px;border-radius: 40px;"
            :src=$store.state.prefix+slide.image
            @click="imgVisible = true" />
        </div>
      </el-card>
    </el-col >
    <el-col :span="18" class="user-detail-right">
      <el-card class="box-card-large">
        <el-tabs v-model="activeName">
          <el-tab-pane label="广告内容" name="first">
            <div class="text item">
              <span class="text_label">广告类型：</span>
              {{slide.type}}
            </div>
            <div class="text item">
              <span class="text_label">链接：</span>
              {{slide.link}}
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>


    <i-edit
      :dialog-visible="editProps.visible"
      :id="editId"
      @on-dialog-close="handleClose"
      @on-save-success="handleSaveSuccess"
    ></i-edit>
    <el-dialog
      title="查看图片"
      :visible.sync="imgVisible"
      :modal-append-to-body='false'
      width="50%"
      :before-close="handleClose">
      <img :src="$store.state.prefix+slide.image" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
  import {get} from '@/project/service/slide'
  import previewImg from '@/framework/components/previewImg/previewImg.vue'
  import IEdit from './edit'

  export default {
    name: "show",
    components: {
      IEdit, previewImg
    },
    data() {
      return {
        slide: {},
        editProps: {
          visible: false
        },
        imgVisible: false,
        sercetVisible: false,
        id: this.$route.params.id,
        editId: 0,
        activeName: 'first',
        page: 1,
        pageSize: 10,
        sort: {desc: ['id']},
        roleList: [],
        total: 0,
        ruleForm: {
          pass: '',
          checkPass: '',
        },
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        defaultList:[],
        model:'slide'
      }
    },
    created() {
      this.get();
    },
    methods: {
      get() {
        get({id: this.id}, res => {
          this.slide = res;
        });
      },
      handleClose() {
        this.editProps.visible = false;
        this.imgVisible = false;
      },
      handleCheckChange(data,isSelect){
        console.log(data);
        console.log(isSelect);
        if (!data.children) {
          if (isSelect) {
            addModule({roleId:this.id,moduleId:data.id},res => {
              this.$message.success('添加成功');
            })
          }else {
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
      getMenu(){
        findAll({},res => {
          let list = res.map((s,i) => {
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
      findByRoleId(){
        findByRoleId({roleId:this.id},res => {
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
