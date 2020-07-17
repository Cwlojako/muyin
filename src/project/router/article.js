const article = {
  routes: [
    {
      path:'/article/list',
      name:'articleList',
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
            name:'文章管理(论坛文章)',
            path:'/article/list'
          }
        ]
      },
      component: () => import('@/project/views/article/list')
    },
    {
      path:'/article/show/:id',
      name:'articleShow',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'文章管理(论坛文章)',
            path:'/article/list'
          },
          {
            name:'文章详情',
            path:'/article/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/article/show')
    },
  ]
}
export default article;
