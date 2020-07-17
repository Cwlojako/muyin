const manager = {
  routes: [
    {
      path: '/manager/list',
      name: 'managerList',
      meta: {
        isShowHeader: true,
        isShowLeftSider: true,
        keepAlive: true,
        breadcrumb: [
          {
            name: '首页',
            path: '/index'
          },
          {
            name: '管理员管理',
            path: '/manager/list'
          }
        ]
      },
      component: () => import('@/project/views/manager/list.vue')
    },
    {
      path: '/manager/show/:id',
      name: 'managerShow',
      meta: {
        isShowHeader: true,
        isShowLeftSider: true,
        keepAlive: false,
        breadcrumb: [
          {
            name: '首页',
            path: '/index'
          },
          {
            name: '管理员管理',
            path: '/manager/list'
          },
          {
            name: '管理员详情',
            path: '/manager/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/manager/show.vue')
    }
  ]
}
export default manager;
