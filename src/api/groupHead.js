import fetch from '@/utils/fetch'

/* *********** 团长管理 **************************/

// 分页获取团长列表
export function getAgentsByPage (params) {
  return fetch({
    url: '/bakend/agent/getAgentsByPage.do',
    method: 'get',
    params
  })
}

// 根据电话号码或名字搜索团长
export function getAgentByCellphoneOrName (params) {
  return fetch({
    url: '/bakend/agent/getAgentByCellphoneOrName.do',
    method: 'get',
    params
  })
}

// 添加团长
export function addAgent (data) {
  return fetch({
    url: '/bakend/agent/addAgent.do',
    method: 'post',
    data
  })
}

// 修改团长
export function modifyAgent (data) {
  return fetch({
    url: '/bakend/agent/modifyAgent.do',
    method: 'post',
    data
  })
}

// 批量删除团长
export function delAgent (data) {
  return fetch({
    url: '/bakend/agent/delAgent.do',
    method: 'post',
    data
  })
}

// 审核团长
export function examine (data) {
  return fetch({
    url: '/bakend/agent/examine.do',
    method: 'post',
    data
  })
}

/* *********** 提现审核 ************************* */
// 获取团长提现申请列表
export function getWithdrawList (params) {
  return fetch({
    url: '/bakend/agent/getWithdrawList.do',
    method: 'get',
    params
  })
}

// 根据ID批量获取团长信息
export function getAgentsByIds (data) {
  return fetch({
    url: '/bakend/agent/getAgentsByIds.do',
    method: 'post',
    data
  })
}

// 审批团长提现
export function examineWithdraw (data) {
  return fetch({
    url: '/bakend/agent/examineWithdraw.do',
    method: 'post',
    data
  })
}
