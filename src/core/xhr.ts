import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {

  // ajax请求promise化
  return new Promise( (resolve, reject) => {

    const { 
      url, headers, responseType, timeout, cancelToken,
      method = 'get', data = null
    } = config

    const request = new XMLHttpRequest()

    // 指定响应数据的类型
    if (responseType) {
      request.responseType = responseType
    }

    // 配置超时时间
    // 如果没有配置，则不超时
    if (timeout) {
      request.timeout = timeout
    }

    // request.open(method.toLocaleUpperCase(), url, async: true)   
    // async报错 为什么？？

    request.open(method.toUpperCase(), url!)

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

      // 网络错误或者超时错误，status为0
      if (request.status === 0) {
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
      // resolve(response)
      // 把原本直接resolve，改为根据状态码处理promise状态
      handleResponse(response)
    }

    // 处理网络错误
    // 当网络出现异常的时候，发送请求会触发XMLHttpRequest对象实例的 error事件
    request.onerror = function handleError() {
      // reject(new Error('Network Error'))
      reject(createError('Network Error', config, null, request))
    }

    request.ontimeout = function handleTimeout() {
      // reject(new Error(`Timeout of ${timeout} ms exceeded`))
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
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

    // ? 这里的 cancelToken 是 CancelToken类的实例，但是这个实例是从哪来的？？？
    // ? 外部传入的方法 执行 executor 从哪传入了 ???

    // * 这里只是预定义一个取消行为，
    // * 当 cancelToken 实例对象调用了executor传入的取消方法，才会真正取消

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }

    request.send(data)

    // 分别处理状态码的正常和异常情况
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        // reject(new Error(`Request failed with status code ${response.status}`))
        reject(
          createError(
            `Request failed with status code ${response.status}`, 
            config, 
            null,
            request,
            response
          ))
      }
    }
  })
}