import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'

// config配置的策略模式
axios.defaults.headers.common['test2'] = 123
axios({
  url: '/config/post',
  method: 'post',
  data: qs.stringify({
    a: 1
  }),
  headers: {
    test: '321'
  }
})
.then((res) => {
  console.log(res.data)
})

// 配置转换函数
axios({
  transformRequest: [
    function(data) {
      return qs.stringify(data)
    },
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    function(data) {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
    }
  ],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then( res => {
  console.log(res.data)
})

/**
 * ! 目前 axios还是单例，如果修改了config配置，会影响所有的axios请求
 * ! 官网提供的 axios.create  方法， 允许创建各自的axios实例
 * ! 调用create时 传入的配置，与默认配置合并，作为新的默认配置
*/ 


// case 3   demo to test axios.create()

const instance = axios.create({
  transformRequest: [
    function(data) {
      return qs.stringify(data)
    },
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    function(data) {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
    }
  ]
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then( res => {
  console.log(res.data)
})