const hotSearch = {
  routes: [
    {
      path:'/hotSearch/list',
      name:'hotSearchList',
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
            name:'热搜管理',
            path:'/hotSearch/list'
          }
        ]
      },
      component: () => import('@/project/views/hotSearch/list')
    }
  ]
}
export default hotSearch;
