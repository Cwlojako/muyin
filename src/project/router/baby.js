const baby = {
  routes: [
    {
      path:'/baby/list',
      name:'babyList',
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
            name:'宝宝信息列表',
            path:'/baby/list'
          }
        ]
      },
      component: () => import('@/project/views/baby/list')
    },
    {
      path:'/baby/show/:id',
      name:'babyShow',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'宝宝信息列表',
            path:'/user/baby/list'
          },
          {
            name:'宝宝详情',
            path:'/baby/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/baby/show')
    }
  ]
}
export default baby
