import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig):void {
  const {url, method = 'get', data = null, headers} = config
  
  const request = new XMLHttpRequest()

  // request.open(method.toLocaleUpperCase(), url, async: true)   
  // async报错 为什么？？

  request.open(method.toLocaleUpperCase(), url)

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
}