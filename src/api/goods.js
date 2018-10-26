import fetch from '@/utils/fetch'

/* *********** 分类管理 **************************/

// 分页获取商品分类列表
export function getClassByPage (params) {
  return fetch({
    url: '/class/getClassByPage.do',
    method: 'get',
    params
  })
}

// 根据分类名搜索
export function getClassByName (params) {
  return fetch({
    url: '/class/getClassByName.do',
    method: 'get',
    params
  })
}

// 添加商品分类
export function addClass (data) {
  return fetch({
    url: '/class/addClass.do',
    method: 'post',
    data
  })
}

// 添加修改商品分类
export function modifyClass (data) {
  return fetch({
    url: '/class/modifyClass.do',
    method: 'post',
    data
  })
}

// 根据分类id批量删除商品分类
export function delClass (data) {
  return fetch({
    url: '/class/delClass.do',
    method: 'post',
    data
  })
}

// 后台其他需一次性获取所有分类信息的地方
export function getAllClass (params) {
  return fetch({
    url: '/class/getAllClass.do',
    method: 'get',
    params
  })
}

/* *********** 商品管理 *********************** */

// 添加商品
export function addCommodity (data) {
  return fetch({
    url: '/Commodity/addCommodity.do',
    method: 'post',
    data
  })
}

// 根据商品 id 批量删除商品
export function delCommodityByIds (data) {
  return fetch({
    url: '/Commodity/delCommodityByIds.do',
    method: 'post',
    data
  })
}

// 修改商品
export function modifyCommodity (data) {
  return fetch({
    url: '/Commodity/modifyCommodity.do',
    method: 'post',
    data
  })
}

// 分页获取商品列表
export function getCommodityByPage (params) {
  return fetch({
    url: '/Commodity/getCommodityByPage.do',
    method: 'get',
    params
  })
}

// 根据搜索条件返回分页商品列表
export function queryCommodityByPage (params) {
  return fetch({
    url: '/Commodity/queryCommodityByPage.do',
    method: 'get',
    params
  })
}

// 根据商品 ID 搜索商品信息
export function getCommodityById (params) {
  return fetch({
    url: '/Commodity/getCommodityById.do',
    method: 'get',
    params
  })
}

// 根据商品 ID 审核商品
export function examineCommodityById (data) {
  return fetch({
    url: '/Commodity/examineCommodityById.do',
    method: 'post',
    data
  })
}

// 保存 图片base64编码，去除data:image/jpeg;base64,部分
export function saveImg (data) {
  return fetch({
    url: '/Commodity/saveImg.do',
    method: 'post',
    data
  })
}
