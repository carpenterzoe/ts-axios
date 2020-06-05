import { isPlainObject } from './util'
import { head } from 'shelljs'

function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach( (name) => {
    if (name !== normalizedName && 
        name.toLocaleUpperCase() === normalizedName.toLocaleUpperCase()
    ) {
      headers[normalizedName] = headers[name]
      delete headers[name]      
    }
  })
}
export function processHeaders(headers: any, data: any): any {
  // 统一处理Content-Type的大小写
  // 因为XMLHttpRequest请求中大小写都能识别
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  
  return headers
}