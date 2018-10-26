/**
 * Created by huangjin on 17/11/08.
 */
// 验证电话号码  手机 电话
export function validatePhone (str) {
  const reg = /(^([+]?86)?(1[34578]\d{9})$)|(^((0\d{2,3})-)?(\d{7,8})(-(\d{1,4}))?$)/ // 座机电话验证
  return reg.test(str)
}

// 验证 邮箱
export function validateEmail (email) {
  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  return reg.test(email)
}

// 供应商密码
export function validatePassword (password) {
  return password.length >= '6' && password.length <= '12'
}
