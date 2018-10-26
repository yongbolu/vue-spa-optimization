import router from './router'
// import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
// import { Message } from 'element-ui'

const whiteList = ['/start', '/login', '/register', '/lock'] // 不需要权限验证拦截的白名单路由

router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress
  if (localStorage.getItem('Authorization1')) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      /* if (!store.state.userMsg) {
        store.dispatch('getInfo', localStorage.getItem('Authorization')).then(res => {
          next()
        }).catch(() => {
          next()
          Message.error('拉取用户信息失败')
        })
      } else {
        next()
      } */
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
