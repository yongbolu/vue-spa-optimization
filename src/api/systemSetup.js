import fetch from '@/utils/fetch'

/* *********** 系统设置 **************************/

// 获取所有系统配置项
export function getAllSysConfig (params) {
  return fetch({
    url: '/bakend/getAllSysConfig.do',
    method: 'get',
    params
  })
}

// 修改系统配置项
export function modifySysconfig (data) {
  return fetch({
    url: '/bakend/modifySysconfig.do',
    method: 'post',
    data
  })
}
