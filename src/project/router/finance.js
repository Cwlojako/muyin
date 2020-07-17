const finance = {
  routes: [
    {
      path:'/finance/list',
      name:'financeList',
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
            name:'平台流水',
            path:'/finance/list'
          }
        ]
      },
      component: () => import('@/project/views/finance/list')
    }
  ]
}
export default finance;
