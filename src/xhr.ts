import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig):void {
  const {url, method = 'get', data = null} = config
  
  const request = new XMLHttpRequest()

  // request.open(method.toLocaleUpperCase(), url, async: true)   
  // async报错 为什么？？

  request.open(method.toLocaleUpperCase(), url)

  request.send(data)
}