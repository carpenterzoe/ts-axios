import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders } from '../helpers/headers'

// function axios(config: AxiosRequestConfig): AxiosPromise {
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  // xhr(config)
  // return xhr(config)  
  
  // 改写成promise后，要把promise return出去

  // 发送请求之后, promise中的 config 变成 res 传递下去
  return xhr(config).then( (res) => {
    return transformResponseData(res)
  })
}

// 处理config 单独抽了一个函数
// 原因：目前虽然只处理了url，后面可能还有对config的处理
// 统一放在一起
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  
  // 对headers的处理必须放在处理data的前面
  // 因为 transformRequestData 对 data进行了转换
  // 普通对象执行了transformRequestData后，转成了JSON字符串
  // 再执行transformHeaders时，无法再次被判断为普通对象
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

// 调用 buildURL, 处理params和url拼接
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)   // 类型断言，表示这里一定会有url
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  // headers 在解构赋值时给一个默认值
  // 避免 processHeaders 函数调用时，没有headers传入
  // 导致没有赋值默认的 Content-Type
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}

// export default axios