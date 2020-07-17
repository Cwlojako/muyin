const information = {
  routes: [
    {
      path:'/information/list',
      name:'informationList',
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
            name:'文章管理(孕育资讯)',
            path:'/information/list'
          }
        ]
      },
      component: () => import('@/project/views/information/list')
    },
    {
      path:'/information/show/:id',
      name:'informationShow',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'文章管理(孕育资讯)',
            path:'/information/list'
          },
          {
            name:'文章详情',
            path:'/information/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/information/show')
    },
  ]
}
export default information;
