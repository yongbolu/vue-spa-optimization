import fetch from '@/utils/fetch'

/* *********** 活动管理 **************************/

// 添加活动
export function addGroupBuy (data) {
  return fetch({
    url: '/groupbuy/addGroupBuy.do',
    method: 'post',
    data
  })
}

// 分页获取活动列表
export function getGroupBuyByPage (params) {
  return fetch({
    url: '/groupbuy/getGroupBuyByPage.do',
    method: 'get',
    params
  })
}

// 根据查询条件分页获取活动列表
export function queryGroupBuyByPage (params) {
  return fetch({
    url: '/groupbuy/queryGroupBuyByPage.do',
    method: 'get',
    params
  })
}

// 根据活动id获取该活动包含的商品数量等信息
export function getItemsByGroupBuyID (params) {
  return fetch({
    url: '/groupbuy/getItemsByGroupBuyID.do',
    method: 'get',
    params
  })
}

// 根据活动id停止活动
export function stopGroupBuy (params) {
  return fetch({
    url: '/groupbuy/stopGroupBuy.do',
    method: 'get',
    params
  })
}

// 根据活动id获取配送单
export function getDistributionListByGroupBuyID (params) {
  return fetch({
    url: '/groupbuy/getDistributionListByGroupBuyID.do',
    method: 'get',
    params
  })
}
