const afterSale = {
  routes: [
    {
      path:'/afterSale/list',
      name:'afterSaleList',
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
            name:'售后单管理',
            path:'/afterSale/list'
          }
        ]
      },
      component: () => import('@/project/views/afterSale/list')
    },
    {
      path:'/afterSale/show/uncheck',
      name:'afterSaleUncheck',
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
            name:'售后单管理',
            path:'/afterSale/list'
          },
          {
            name:'售后单详情--待审核',
            path:'/afterSale/show/uncheck'
          }
        ]
      },
      component: () => import('@/project/views/afterSale/showUncheck')
    },
    {
      path:'/afterSale/show/checking',
      name:'afterSaleChecking',
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
            name:'售后单管理',
            path:'/afterSale/list'
          },
          {
            name:'售后单详情--处理中',
            path:'/afterSale/show/checking'
          }
        ]
      },
      component: () => import('@/project/views/afterSale/showChecking')
    },
    {
      path:'/afterSale/show/success',
      name:'afterSaleSuccess',
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
            name:'售后单管理',
            path:'/afterSale/list'
          },
          {
            name:'售后单详情--售后成功',
            path:'/afterSale/show/success'
          }
        ]
      },
      component: () => import('@/project/views/afterSale/showSuccess')
    },
    {
      path:'/afterSale/show/fail',
      name:'afterSaleFail',
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
            name:'售后单管理',
            path:'/afterSale/list'
          },
          {
            name:'售后单详情--售后失败',
            path:'/afterSale/show/fail'
          }
        ]
      },
      component: () => import('@/project/views/afterSale/showFail')
    }
  ]
}
export default afterSale;
