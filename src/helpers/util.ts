const toString = Object.prototype.toString

// val is Date 类型谓词保护
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// val is Object 类型谓词保护
// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

// 由于 Blob对象 FormData对象，在 isObject 中也是返回true
// 这里用于区分普通对象
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}