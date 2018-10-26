import { login, getUserInfo } from '@/api/singlePages'

import * as types from './mutation_types'

export default {
  // 登录
  login ({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        if (response.data) {
          localStorage.setItem('Authorization1', response.data)   // 用户token 存到本地
          commit(types.SET_AUTHORIZATION, response.data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户信息
  getInfo ({ commit }, userId) {
    return new Promise((resolve, reject) => {
      getUserInfo(userId).then(res => {
        if (res.head.code === 1 && res.body.data) {
          commit(types.SET_USERMSG, res.body.data)
        }
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 登出
  logOut ({ commit }) {
    return new Promise(resolve => {
      commit(types.SET_AUTHORIZATION, null)
      commit(types.SET_USERMSG, null)
      localStorage.removeItem('Authorization1')
      localStorage.removeItem('Accountpsw1')
      resolve()
    })
  }
}
