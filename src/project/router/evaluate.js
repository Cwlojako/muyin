const evaluate = {
  routes: [
    {
      path:'/evaluate/list',
      name:'evaluateList',
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
            name:'评价管理',
            path:'/evaluate/list'
          }
        ]
      },
      component: () => import('@/project/views/evaluate/list')
    },
    {
      path:'/evaluate/show/:id',
      name:'evaluateShow',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'评价管理',
            path:'/evaluate/list'
          },
          {
            name:'评价详情',
            path:'/evaluate/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/evaluate/show')
    }
  ]
}
export default evaluate
