import { AxiosRequestConfig, AxiosPromise, Method } from '../types'
import dispatchRequest from './dispatchRequest'

// 创建axios类来实现接口中定义的方法
export default class Axios {

  // request改写成 兼容第一个参数传url的情况
  // 函数内部实现改了，接口不需要改，只要内部实现兼容原本接口的定义即可

  // request(config: AxiosRequestConfig): AxiosPromise {
  //   return dispatchRequest(config)
  // }

  // 第一个参数有可能是url或者config
  request(url: string | AxiosRequestConfig, config?: AxiosRequestConfig): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
  }

  // get(url: string, config?: AxiosRequestConfig): AxiosPromise {
  //   return this.request(
  //     Object.assign(config || {}, {
  //       method: 'get',
  //       url
  //     })
  //   )
  // }
  // delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
  //   return this.request(
  //     Object.assign(config || {}, {
  //       method: 'get',
  //       url
  //     })
  //   )
  // }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}