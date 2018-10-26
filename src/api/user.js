import fetch from '@/utils/fetch'

/* *********** 用户管理 **************************/

// 分页获取用户列表
export function getCustomerByPage (params) {
  return fetch({
    url: '/customer/getCustomerByPage.do',
    method: 'get',
    params
  })
}

// 根据手机号搜索客户信息
export function getCustomerByCellphone (params) {
  return fetch({
    url: '/customer/getCustomerByCellphone.do',
    method: 'get',
    params
  })
}
