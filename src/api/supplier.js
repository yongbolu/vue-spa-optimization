import fetch from '@/utils/fetch'

/* *********** 供应商管理 **************************/

// 添加供应商
export function addSupplier (data) {
  return fetch({
    url: '/supplier/addSupplier.do',
    method: 'post',
    data
  })
}

// 根据供应商id批量删除供应商,key为ids,value为id数组
export function delSupplierByIds (data) {
  return fetch({
    url: '/supplier/delSupplierByIds.do',
    method: 'post',
    data
  })
}

// 修改供应商
export function modifySupplier (data) {
  return fetch({
    url: '/supplier/modifySupplier.do',
    method: 'post',
    data
  })
}

// 分页获取供应商列表
export function getSupplierByPage (params) {
  return fetch({
    url: '/supplier/getSupplierByPage.do',
    method: 'get',
    params
  })
}

// 根据供应商名字查找供应商
export function getSupplierByName (params) {
  return fetch({
    url: '/supplier/getSupplierByName.do',
    method: 'get',
    params
  })
}

// 根据供应商id批量获取供应商信息
export function getSupplierByIds (data) {
  return fetch({
    url: '/supplier/getSupplierByIds.do',
    method: 'post',
    data
  })
}
