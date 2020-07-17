const role = {
  routes: [
    {
      path:'/role/list',
      name:'roleList',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        keepAlive:true,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'角色管理',
            path:'/role/list'
          }
        ]
      },
      component: () => import('@/project/views/role/list')
    },
    {
      path:'/role/show/:id',
      name:'roleShow',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'角色管理',
            path:'/role/list'
          },
          {
            name:'角色详情',
            path:'/role/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/role/show')
    },

  ]
}
export default role;
