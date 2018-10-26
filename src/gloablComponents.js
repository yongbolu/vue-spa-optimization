import SvgIcon from './components/SvgIcon'
import MyTable from './components/MyTable'
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 * Ideally, only small components that are re-used many times across your application should be registered here.
 * For plugins and bigger components local registration is preferable because it will allow you to do code splitting easier :)
 */

const GlobalComponents = {
  install (Vue) {
    Vue.component(SvgIcon.name, SvgIcon)
    Vue.component(MyTable.name, MyTable)
  }
}

export default GlobalComponents
