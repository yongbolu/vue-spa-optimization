export default [
  {
    path: '/login',
    name: '登录页',
    hidden: true,
    component: () => import('@/views/singlePages/login')
  },
  {
    path: '/register',
    name: '注册页',
    hidden: true,
    component: () => import('@/views/singlePages/register')
  }
]
