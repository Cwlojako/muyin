const vaccin = {
  routes: [
    {
      path:'/vaccin/list',
      name:'vaccinList',
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
            name:'疫苗管理',
            path:'/vaccin/list'
          }
        ]
      },
      component: () => import('@/project/views/vaccin/list')
    },
    {
      path:'/vaccin/show/:id',
      name:'vaccinShow',
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
            name:'疫苗管理',
            path:'/vaccin/list'
          },
          {
            name:'疫苗详情',
            path:'/vaccin/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/vaccin/show')
    }
  ]
}
export default vaccin;
