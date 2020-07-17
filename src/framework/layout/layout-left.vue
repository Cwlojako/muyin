<template>
  <el-aside
    width="201px"
    :style="{
      position: 'fixed',
      height: 'calc(100vh - 48px)',
      left: 0,
      top:'48px',
      overflow: 'auto',
      background: 'rgb(20, 31, 41)',
      boxSizing: 'border-box',
    }">
    <!--:default-active是为了刷新后默认打开之前的激活菜单项，它的值是激活菜单项的index值-->
    <div ref="menuBlock" :style="'height:' + menuBlockHeight + 'px'" class="sider-menu-block">
      <el-menu
        background-color="rgba(20, 31, 41)"
        text-color="rgb(224, 225, 226)"
        active-text-color="#00A16C"
        :unique-opened="true"
        @select="onSelect"
        :default-active="activePath"
      >
        <template v-for="(item,i) in menuList">
          <el-submenu :index="i.toString()">
<!--            第一层-->
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.displayName}}</span>
            </template>
<!--            第二层-->
            <el-menu-item
              :index="i+'-'+j"
              v-if="!child.children"
              v-for="(child,j) in item.children"
              @click="saveMenuActive(i, j)"
            >
              {{child.displayName}}
            </el-menu-item>
<!--            第三层-->
            <el-submenu :index="i + '-' + j" v-else>
              <template slot="title">{{child.displayName}}</template>
              <el-menu-item
                v-for="(c,k) in child.children"
                :index="i + '-' + j + '-' + k"
                :key="k"
                @click="saveMenuActive(i, j, k)"
              >
                {{c.displayName}}
              </el-menu-item>
            </el-submenu>
          </el-submenu>
        </template>
      </el-menu>
    </div>
  </el-aside>
</template>

<script>
const menuList = require("./menuList.json")
export default {
  name: "SiLayoutLeft",
  data(){
    return{
      projectName: "母婴后台管理系统",
      menuList: menuList,
      menuBlockHeight: 0,
      activePath: ''
    }
  },
  mounted() {
    // 计算滚动区域高度
    // let logoHeight = this.$refs.siderLogo.offsetHeight;
    // this.menuBlockHeight = window.innerHeight - logoHeight;
  },
  created() {
    // 获取保存在缓存中的路径，保持菜单当前选中菜单项不变
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods:{
    onSelect(name,path){
      console.log(name)
      let menuList = this.menuList;
      let flag = typeof name === "number";
      let link = "/";
      let displayName = "";
      if (flag) {
        // 如果flag是数字类型则表示点击的是一级菜单
        link = menuList[name].link;
        displayName = menuList[name].displayName;
      } else {
        // 如果不是则表示点击的是二级菜单
        let arr = name.split("-");
        if (arr.length === 2) {
          // 第二层数据
          link = menuList[arr[0]].children[arr[1]].link;
          displayName = menuList[arr[0]].children[arr[1]].displayName;
          console.log(displayName, link)
        } else {
          // 第三层数据
          link = menuList[arr[0]].children[arr[1]].children[arr[2]].link;
          displayName =
            menuList[arr[0]].children[arr[1]].children[arr[2]].displayName;
        }
      }
      this.$router.push(link);
    },
    // 保存菜单激活状态
    saveMenuActive(...args) {
      // 如果是二级菜单
      if (args.length === 2) {
        let activePath = args[0] + '-' + args[1]
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      } else {
        // 如果是三级菜单
        let activePath = args[0] + '-' + args[1] + '-' + args[2]
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .sider-logo {
    // color: #19be6b;
    color: #57b382;
    width: 100%;
    text-align: center;
    font-size: 15px;
    line-height: 40px;
    margin: 10px 0;
  }
  .el-menu-item:hover{
    background:#57b382!important;

  }
  .el-aside{
    /*!*隐藏滚动条，当IE下溢出，仍然可以滚动*!*/
    /*-ms-overflow-style:none;*/
    /*!*火狐下隐藏滚动条*!*/
    /*overflow:-moz-scrollbars-none;*/
    &::-webkit-scrollbar{
      display:none;
    }
  }
</style>
