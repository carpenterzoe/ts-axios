export type Method = 'get' | 'GET'
| 'delete' | 'DELETE'
| 'head' | 'HEAD'
| 'options' | 'OPTIONS'
| 'post' | 'POST'
| 'put' | 'PUT'
| 'patch' | 'PATCH'

export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType   // ts中定义好的类型
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