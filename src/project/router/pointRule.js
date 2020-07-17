const log = {
  routes: [
    {
      path:'/pointRule/list',
      name:'pointRuleList',
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
            name:'积分规则管理',
            path:'/pointRule/list'
          }
        ]
      },
      component: () => import('@/project/views/pointRule/list')
    }
  ]
}
export default log;
