import fetch from '@/utils/fetch'

/* *********** 活动管理 **************************/

// 获取订单
export function getBills (params) {
  return fetch({
    url: '/bill/getBills.do',
    method: 'get',
    params
  })
}

// 获取售后订单接口
export function getRejectBill (params) {
  return fetch({
    url: '/bill/getRejectBill.do',
    method: 'get',
    params
  })
}

// 后台审批退货接口
export function finishReject (data) {
  return fetch({
    url: '/bill/finishReject.do',
    method: 'post',
    data
  })
}
