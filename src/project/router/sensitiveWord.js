const sensitiveWord = {
  routes: [
    {
      path:'/sensitiveWord/list',
      name:'sensitiveWordList',
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
            name:'敏感词管理',
            path:'/sensitiveWord/list'
          }
        ]
      },
      component: () => import('@/project/views/sensitiveWord/list')
    }
  ]
}
export default sensitiveWord;
