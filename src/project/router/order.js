const order = {
  routes: [
    {
      path:'/order/list',
      name:'orderList',
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
            name:'订单管理',
            path:'/order/list'
          }
        ]
      },
      component: () => import('@/project/views/order/list.vue')
    },
    {
      path:'/order/show/:id',
      name:'orderShow',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'订单管理',
            path:'/order/list'
          },
          {
            name:'订单详情',
            path:'/order/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/order/show')
    }
  ]
}
export default order;
