const advertisement = {
  routes: [
    {
      path:'/advertisement/list',
      name:'advertisementList',
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
            name:'广告管理',
            path:'/advertisement/list'
          }
        ]
      },
      component: () => import('@/project/views/advertisement/list')
    },
    {
      path:'/advertisement/show/:id',
      name:'advertisementShow',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'广告管理',
            path:'/advertisement/list'
          },
          {
            name:'广告详情',
            path:'/advertisement/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/advertisement/show')
    },

  ]
}
export default advertisement;
