import * as types from './mutation_types'

export default {
  // 设置token
  [types.SET_AUTHORIZATION] (state, authorization) {
    state.authorization = authorization
  },
  // 设置用户信息
  [types.SET_USERMSG] (state, userMsg) {
    state.userMsg = userMsg
  },
  // 设置侧边栏展开关闭
  [types.TOGGLE_SIDEBAR] (state) {
    state.sidebar = !state.sidebar
  }
}
