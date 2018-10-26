/*
* 定义一些过滤器
*/

// 客户格式化金额  把分转化为元
export const moneyFilter = money => {
  if (money) {
    return Number((money / 100).toFixed(2))
  } else {
    return 0
  }
}

// 去除所有的html标签
export const htmlFilter = html => html.replace(/<[^>]*>/g, '')

// 截取日期 字段 返回 月份日期
export const MonthDayFilter = date => {
  if (date) {
    return date.slice(5, 10)
  }
}

export const orderState = row => {
  let state = ''
  if (row.success === false) {
    state = '未支付'
  } else if (row.success === true && row.picked === null) {
    state = '已支付'
  } else if (row.success === true && row.picked === false) {
    state = '已发货'
  } else if (row.success === true && row.picked === true) {
    state = '已完成'
  }
  return state
}
