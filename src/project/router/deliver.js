const deliver = {
  routes: [
    {
      path:'/deliver/list',
      name:'deliverList',
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
            name:'订单发货',
            path:'/deliver/list'
          }
        ]
      },
      component: () => import('@/project/views/deliver/list')
    },
    {
      path:'/deliver/show/deliver/:id',
      name:'deliverShow',
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
            name:'订单发货',
            path:'/deliver/list'
          },
          {
            name:'发货详情',
            path:'/deliver/show/deliver/:id'
          }
        ]
      },
      component: () => import('@/project/views/deliver/showDeliver')
    },
    {
      path:'/deliver/show/delivering/:id',
      name:'deliveringShow',
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
            name:'订单发货',
            path:'/deliver/list'
          },
          {
            name:'已发货详情',
            path:'/deliver/show/delivering/:id'
          }
        ]
      },
      component: () => import('@/project/views/deliver/showDelivering')
    },
    {
      path:'/deliver/show/receive/:id',
      name:'receiveShow',
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
            name:'订单发货',
            path:'/deliver/list'
          },
          {
            name:'已收货详情',
            path:'/deliver/show/receive/:id'
          }
        ]
      },
      component: () => import('@/project/views/deliver/showReceive')
    }
  ]
}
export default deliver;
