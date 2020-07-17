const discount = {
  routes: [
    {
      path:'/discount/list',
      name:'discountList',
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
            name:'优惠券管理',
            path:'/discount/list'
          }
        ]
      },
      component: () => import('@/project/views/discount/list')
    },
    {
      path:'/discount/show/:id',
      name:'discountList',
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
            name:'优惠券管理',
            path:'/discount/list'
          },
          {
            name:'优惠券详情',
            path:'/discount/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/discount/show')
    }
  ]
}
export default discount;
