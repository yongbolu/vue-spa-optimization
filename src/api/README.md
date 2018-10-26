## api接口 说明
api 下面文件目录跟随项目模块对应建立

## 请求模式

1. 默认请求 `json` 格式数据，如果需要请求protobuf请在头部添加ap  `plication/protobuf`
2. baseURL 各类 baseUrl 在 `process.env.BASE_URL` 中取
3. 其他 Axios 详细配置，请异步[Axios文档](https://github.com/axios/axios)

如下示例
```javascript
import fetch from '@/utils/fetch'
import LeaguePB from '../proto/league_pb'

// 登录
export function login (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo () {
  return fetch({
    url: '/getUserInfo',
    method: 'get'
  })
}

// 获取 json 格式数据  Demo
export function jsonAjax (data) {
  return fetch({
    url: 'http://lea.weiwuu.com/v1/league/27407358692948',
    method: 'get'
  })
}

// 获获取 protobuf 格式数据 Demo
export function pBAjax (data) {
  return fetch({
    url: 'http://lea.weiwuu.com/v1/league/27407358692948',
    method: 'get',
    headers: { Accept: 'application/protobuf' },
    transformResponse: [function (data) {
      // 对 data 进行任意转换处理
      let dataPB = LeaguePB.League.deserializeBinary(data)
      console.log('getNotes', dataPB.getNotes())
      const resdata = {
        notes: dataPB.getNotes()
      }
      return resdata
    }]
  })
}

```
