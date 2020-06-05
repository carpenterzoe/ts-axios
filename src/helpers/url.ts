import { isDate, isPlainObject } from './util'

/**
 * encodeURIComponent 的作用：
 * 将文本字符串编码为一个有效的统一资源标识符 (URI)。
 * 将中文、韩文等特殊字符转换成utf-8格式的url编码。
 * 
 * 当想把 username 整个当做参数传递给 CGI, 而不让 CGI 将 username 分割掉。
 * 如果 username = 'a&foo=boo' 而不用 encodeURIComponent 的话，
 * 整个参数就成了 name=a&foo=boo, 这样 CGI 就获得两个参数 name 和 foo. 
 * 这不是我们想要的。
 * Javascript 里还有个同样功能的函数 encodeURI, 
 * 但是此方法不会对这些字符进行编码：":"、"/"、";" 和 "?"
 * 
 * document.write(encodeURIComponent(",/?:@&=+$#"))
 * 返回结果 %2C%2F%3F%3A%40%26%3D%2B%24%23
 */

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

  // 遍历params，生成 键值对拼接的 字符串数组。
  // ['key=val', 'key=val', 'key=val']

  //  定义键值对数组
  const parts: string[] = []

  // params是对象 参数键值对  ??? 这样的话为什么一开始定义的是any??
  Object.keys(params).forEach((key) => {

    const val = params[key]

    if (val === null || typeof val === 'undefined') {
      return  // forEach中的return，只是跳出本次循环，下一次循环会继续
    }

    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'   // url中有数组需要这样拼接 ???
    } else {
      values = [val]  //  统一处理为数组方便后续处理
    }

    values.forEach((val) => {
      // 普通对象和日期对象转字符串，并把特殊字符转码???
      if (isDate(val)) {
        // isDate函数定义时有类型保护，所以这里可以直接访问Date的方法
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
      // parts  ['key=val', 'key=val', 'key=val']
    })
  })

  // 把处理完的参数数组，以 & 处理成字符串拼接。
  let serializedParams = parts.join('&')

  if (serializedParams) {
    const marIndex = url.indexOf('#')

    // 去除 # 哈希标识
    //  /base/get#hash  => /base/get
    if (marIndex !== -1) {
      url = url.slice(0, marIndex)
    }
    url += (url.indexOf('?') === -1 ? '?':'&') + serializedParams
  }

  return url
}