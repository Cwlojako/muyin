const goodsCategory = {
  routes: [
    {
      path:'/goodsCategory/list',
      name:'goodsCategoryList',
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
            name:'商品分类',
            path:'/goodsCategory/list'
          }
        ]
      },
      component: () => import('@/project/views/goodsCategory/list')
    }
  ]
}
export default goodsCategory;
