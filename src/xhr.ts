import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {

  // ajax请求promise化
  return new Promise( (resolve) => {

    const { url, method = 'get', data = null, headers, responseType } = config

    const request = new XMLHttpRequest()

    // 指定响应数据的类型
    if (responseType) {
      request.responseType = responseType
    }

    // request.open(method.toLocaleUpperCase(), url, async: true)   
    // async报错 为什么？？

    request.open(method.toUpperCase(), url)

    // 每当 readyState 属性改变时，就会调用该函数。
    request.onreadystatechange = function handleLoad() {

      /**
       * 0: 请求未初始化
       * 1: 服务器连接已建立
       * 2: 请求已接收
       * 3: 请求处理中
       * 4: 请求已完成，且响应已就绪
       */
      if (request.readyState !== 4) {
        return
      }

      // 把原本的字符串解析成对象
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      
      // 根据是否指定了响应类型，来决定返回的data类型
      const responseData = responseType !== 'text' ?
                           request.response : request.responseText

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }

    // 请求头中可能有多个内容
    Object.keys(headers).forEach( (name) => {

      // data没有数据时，不需要content-type
      if (data === null && name.toLocaleLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}