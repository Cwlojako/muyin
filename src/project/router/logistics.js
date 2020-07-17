const logistics = {
  routes: [
    {
      path:'/logistics/list',
      name:'logisticsList',
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
            name:'物流管理',
            path:'/logistics/list'
          }
        ]
      },
      component: () => import('@/project/views/logistics/list')
    }
  ]
}
export default logistics;
