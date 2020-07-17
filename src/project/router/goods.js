const goods = {
  routes: [
    {
      path:'/goods/list',
      name:'goodsList',
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
            name:'商品管理',
            path:'/goods/list'
          }
        ]
      },
      component: () => import('@/project/views/goods/list')
    },
    {
      path:'/goods/show/:id',
      name:'goodsShow',
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
            name:'商品管理',
            path:'/goods/list'
          },
          {
            name:'商品详情',
            path:'/goods/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/goods/show')
    }
  ]
}
export default goods;
