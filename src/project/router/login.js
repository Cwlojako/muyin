const login = {
  routes: [
    {
      path:'/',
      redirect:'/index'
    },
    {
      path: '/index',
      name: 'Welcome',
      meta:{
        breadcrumb:[
          {
            name:'首页',
            path:'/index'
          }
        ],
        isShowLeftSider:true,
        isShowHeader:true,
      },
      component: () => import( '@/project/views/Welcome.vue')
    },
    {
      path:'/login',
      name:'login',
      meta:{
        isShowHeader:false,
        isShowLeftSider:false,
      },
      component: () => import( '@/project/views/Login.vue'),
    },

  ]
}
export default login;
