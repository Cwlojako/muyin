const brand = {
  routes: [
    {
      path:'/brand/list',
      name:'brandList',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        keepAlive:false,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'品牌管理',
            path:'/brand/list'
          }
        ]
      },
      component: () => import('@/project/views/brand/list')
    }
  ]
}
export default brand;
