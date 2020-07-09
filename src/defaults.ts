import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

// 配置默认config
const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  /**
   * 需求文档中的定义：
   * transformRequest允许在请求数据发送到服务器之前对其进行修改
   * 这只适用于请求方法 put post patch
   * 如果值是数组，则数组中的最后一个函数必须返回一个字符串 或 
   * FormData URLSearchParams Blob 等类型 作为 xhr.send 方法的参数
   * 而且在 transform 过程中，可以修改headers对象
   * 
   * but why ???
   * 1. 为什么只适用于这几个方法
   * 2. 为什么最后一个函数必须返回这些东西？？？
   * 3. 为什么在 transform 里面去修改headers， 之前定义的mergeConfig策略呢 ???
   */

  // 相当于把之前写的，在发请求之前执行的
  // 请求之前 和拿到数据之后的 默认操作 抽离到一起去 ???
  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)   // 目前是用于配置有data时的Content-Type
      return transformRequest(data)   // 对象 => JSON.stringfy
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ]
}

const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach( method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach( method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form/urlencoded'
  }
})

export default defaults