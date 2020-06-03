import { isDate, isObject } from './util'

// 处理特殊字符
function encode(val:string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/ig, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/ig, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/ig, '[')
    .replace(/%5D/ig, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const parts: string[] = []  //  键值对数组

  // params是对象 参数键值对
  Object.keys(params).forEach((key) => {

    const val = params[key]

    if (val === null || typeof val === 'undefined') {
      return  // forEach中的return，只是跳出本次循环，下一次循环会继续
    }

    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]  //  统一处理为数组方便后续处理
    }

    values.forEach((val) => {
      if (isDate(val)) {
        // isDate函数定义时有类型保护，所以这里可以直接访问Date的方法
        val = val.toISOString()
      } else if (isObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')

  if (serializedParams) {
    const marIndex = url.indexOf('#')
    if (marIndex !== -1) {
      url = url.slice(0, marIndex)
    }
    url += (url.indexOf('?') === -1 ? '?':'&') + serializedParams
  }

  return url
}