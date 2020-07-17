const help = {
  routes: [
    {
      path:'/help/list',
      name:'helpList',
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
            name:'文章管理(帮助中心)',
            path:'/help/list'
          }
        ]
      },
      component: () => import('@/project/views/help/list')
    },
    {
      path:'/help/show',
      name:'helpShow',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'文章管理(帮助中心)',
            path:'/help/list'
          },
          {
            name:'文章详情',
            path:'/help/show'
          }
        ]
      },
      component: () => import('@/project/views/help/show')
    },
  ]
}
export default help;
