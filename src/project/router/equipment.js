const equipment = {
  routes: [
    {
      path:'/equipment/list',
      name:'equipmentList',
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
            name:'设备管理',
            path:'/equipment/list'
          }
        ]
      },
      component: () => import('@/project/views/equipment/list')
    },
    {
      path:'/equipment/show/:id',
      name:'equipmentShow',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'设备管理',
            path:'/equipment/list'
          },
          {
            name:'设备详情',
            path:'/equipment/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/equipment/show')
    },
  ]
}
export default equipment;
