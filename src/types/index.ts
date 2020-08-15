export type Method = 'get' | 'GET'
| 'delete' | 'DELETE'
| 'head' | 'HEAD'
| 'options' | 'OPTIONS'
| 'post' | 'POST'
| 'put' | 'PUT'
| 'patch' | 'PATCH'

/**
 * 新增泛型的逻辑先后步骤
 * 
 * 1. AxiosResponse<T = any>
 * AxiosResponse中的data字段，会拿到类型T
 * 
 * 2. AxiosPromise<T = any> extends Promise<AxiosResponse<T>>
 *  a) AxiosPromise<T = any> extends Promise
 *     表示这个接口是返回一个promise
 *  b) Promise<AxiosResponse<T>>
 *     表示 当这个promise是resolve状态时，返回的数据类型是 AxiosResponse<T>
 *  c) AxiosResponse<T>
 *     和上面第1点的含义相同
 * 所以最终实现AxiosPromise这个接口时，会返回一个promise，且resolve时，
 * 这个promise返回AxiosResponse<T> 类型的数据，
 * 返回值中的data字段，会体现出调用时方法时传入的T。
 */

export interface AxiosRequestConfig {

  // axios改成混合对象之后，url可能不传到config中，而是在外围配置
  // 如 interface Axios 定义的
  // 所以这里url变成了可选参数
  url?: string  
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType,   // ts中定义好的 响应类型
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken

  [propName: string]: any   // 添加索引签名 作用???
}

// 拓展泛型，用于接口调用的配置中指定返回数据类型，在后续返回时可以匹配
export interface AxiosResponse<T = any> {
  data: T   // 服务端返回的数据
  status: number    // http状态码
  statusText: string
  headers: any    // 响应头
  config: AxiosRequestConfig    // 请求的配置
  request: any
}

// axios返回的数据类型  继承promise泛型接口 ???
// 再叠加一个泛型T ???

// Promise<AxiosResponse<T>>  这里的 AxiosResponse<T> 表示 promise resolve拿到的参数 res
// 为什么?????
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

// 增强错误信息
export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

// 这里调用方法时传入的泛型，和后面返回中的泛型，是怎样的对应关系??
// 是传入的数据和返回的数据中，各有某一部分数据 是同种泛型?
// 还是返回数据的一整个，是泛型T ??? 
export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request:  AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// AxiosInstance 混合类型对象
// 既有函数类型，又有继承而来的属性方法
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  // config不传 则直接使用默认配置
  create(config?: AxiosRequestConfig): AxiosInstance

  // ? 静态类型 ???
  CancelToken: CancelTokenStatic    // ? 给 axios直接挂上了CancelToken属性 ??
  Cancel: CancelStatic
  isCancel:(value: any) => boolean
}

// 拦截器管理器 的对外接口
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  
  eject(id: number): void
}

// 请求拦截器和响应拦截器的参数类型不同
export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

// * CancelToken 取消实现的类
export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel           // * promise resolve的参数

  throwIfRequested(): void
}

// * 取消函数
export interface Canceler {
  (message?: string): void
}

// * 取消执行器
// * 自己既接收别的函数作为参数（保存Cancel方法时）
// * 也作为参数，传入其他函数中（传给CancelToken构造函数）
export interface CancelExecutor {
  (cancel: Canceler): void
}

// * cancelToken 通过 source() 方法，返回这个对象类型
export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// ??? CancelTokenStatic 是 CancelToken 的 【类类型】
// ? 里面包括 构造函数的定义 和静态方法的定义
export interface CancelTokenStatic {
  // * 返回值是 CancelToken 的实例类型
  new(executor: CancelExecutor): CancelToken

  // ? 类类型里面的静态方法如何调用
  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

// ? 类类型 ???
export interface CancelStatic {
  new(message?: string): Cancel
}