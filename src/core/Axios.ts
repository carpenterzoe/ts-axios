import { AxiosRequestConfig, AxiosPromise, Method, 
  AxiosResponse, ResolvedFn, RejectedFn } from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './interceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain <T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn   // 拦截器的rejected是可选
}

// 创建axios类来实现接口中定义的方法
export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors    // 给Axios添加interceptors属性

  // 初始化 - 把拦截器管理器中的方法初始化进来
  // 请求拦截和响应拦截 都可以调用 use eject来添加删除拦截器
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  // request改写成 兼容第一个参数传url的情况
  // 函数内部实现改了，接口不需要改，只要内部实现兼容原本接口的定义即可

  // request(config: AxiosRequestConfig): AxiosPromise {
  //   return dispatchRequest(config)
  // }

  // 第一个参数有可能是url或者config
  // request(url: string | AxiosRequestConfig, config?: AxiosRequestConfig): AxiosPromise {
  // 当之前定义的类型不能兼容后续需要场景时, 改成any??? 有没有更好的方法
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    config = mergeConfig(this.defaults, config)

    // chain 链中 是一堆拦截器 以及下面的初始值
    const chain: PromiseChain<any>[] = [{
      // 这是chain数组中的初始对象 即发送请求
      resolved: dispatchRequest,
      rejected: undefined
    }]

    // 请求拦截 后添加的先执行 unshift
    this.interceptors.request.forEach( interceptor => {
      chain.unshift(interceptor)
    })

    // 响应拦截 先添加的先执行 push
    this.interceptors.response.forEach( interceptor => {
      chain.push(interceptor)
    })

    // 通过上述两种添加方式, 加上chain中的初始对象
    // 实现了 1. 依次执行请求拦截 => 2. 发请求 => 3. 依次执行响应拦截
    // forEach往chain数组中添加的拦截器, 夹在初始对象的前后

    // chain.shift() 拿到的元素 可能是 PromiseChain, 也可能是undefined ??? 
      // 因为 eject 可能删掉某些元素了??? 还是由于这个方法的特性 ??? 
      // 如果数组是空的，那么 shift() 方法将不进行任何操作，返回 undefined 值。
      // 好像两种原因都不属于??????

    // 这里 Promise.resolve(config) 是把config传进去初始化???
    // 这是promise链的第一个resolve, 后面执行的.then会拿到这里resolve的config
    let promise = Promise.resolve(config) 

    while (chain.length) {
      const { resolved, rejected } = chain.shift()! // 类型断言表示这里一定有值，不是undefined
      
      // promise.then 依次叠加赋值 让 chain 依次执行
      promise = promise.then( resolved, rejected)
    }

    // return dispatchRequest(config)
    // 定义request时, 把url和config都改成any类型才能让这里不报错 why?????
    return promise
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