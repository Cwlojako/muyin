const feedLevel = {
  routes: [
    {
      path:'/feedLevel/list',
      name:'feedLevelList',
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
            name:'喂养阶段管理',
            path:'/feedLevel/list'
          }
        ]
      },
      component: () => import('@/project/views/feedLevel/list')
    }
  ]
}
export default feedLevel;
