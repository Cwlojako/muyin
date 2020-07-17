const log = {
  routes: [
    {
      path:'/log/list',
      name:'logList',
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
            name:'系统操作日志',
            path:'/log/list'
          }
        ]
      },
      component: () => import('@/project/views/log/list')
    }
  ]
}
export default log;
