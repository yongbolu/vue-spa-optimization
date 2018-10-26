import fetch from '@/utils/fetch'

// 帐号登录
export function login (data) {
  return fetch({
    url: '/bakend/login.do',
    method: 'post',
    data
  })
}

// 根据ID获取用户信息
export function getUserInfo (id) {
  return fetch({
    url: '/v1/bk/user',
    method: 'get',
    params: { id }
  })
}

// 获取用户角色
export function getUserRole (id) {
  return fetch({
    url: '/v1/bk/role/by/user/' + id,
    method: 'get'
  })
}
