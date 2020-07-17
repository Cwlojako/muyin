const version = {
  routes: [
    {
      path:'/version/list',
      name:'versionList',
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
            name:'APP管理',
            path:'/version/list'
          }
        ]
      },
      component: () => import('@/project/views/version/list')
    }
  ]
}
export default version;
