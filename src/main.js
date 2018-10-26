import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'// A module alternative to CSS resets
import './styles/index.scss'

// Plugins
import GlobalComponents from './gloablComponents'
import GlobalApis from './globalApis'

// router setup
import router from './router'
import './permission' // 权限、路由拦截

// Vuex setup
import store from './store'

Vue.use(ElementUI)
// plugin setup
Vue.use(GlobalComponents)
Vue.use(GlobalApis)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
