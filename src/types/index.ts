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

export interface AxiosResponse {
  data: any   // 服务端返回的数据
  status: number    // http状态码
  statusText: string
  headers: any    // 响应头
  config: AxiosRequestConfig    // 请求的配置
  request: any
}

// axios返回的数据类型  继承promise泛型接口 ???
export interface AxiosPromise extends Promise<AxiosResponse> {
  
}

// 增强错误信息
export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

export interface Axios {
  request(config: AxiosRequestConfig): AxiosPromise
  get(url: string, config?: AxiosRequestConfig): AxiosPromise
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise
  head(url: string, config?: AxiosRequestConfig): AxiosPromise
  options(url: string, config?: AxiosRequestConfig): AxiosPromise
  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
}

// AxiosInstance 混合类型对象
// 既有函数类型，又有继承而来的属性方法
export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise
}