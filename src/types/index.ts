export type Method = 'get' | 'GET'
| 'delete' | 'DELETE'
| 'head' | 'HEAD'
| 'options' | 'OPTIONS'
| 'post' | 'POST'
| 'put' | 'PUT'
| 'patch' | 'PATCH'

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