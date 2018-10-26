import fetch from '@/utils/fetch'

/* *********** user **************************/
// 增
export function modifyPwd (data) {
  return fetch({
    url: '/bakend/modifyPwd.do',
    method: 'post',
    data
  })
}
