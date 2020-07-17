const timeZone = {
  routes: [
    {
      path: '/timeZone/list',
      name: 'timeZoneList',
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
            name: '时区管理',
            path: '/timeZone/list'
          }
        ]
      },
      component: () => import('@/project/views/timeZone/list.vue')
    }
  ]
}
export default timeZone;
