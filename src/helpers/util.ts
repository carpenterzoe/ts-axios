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

// ??? 这里写法的含义???
// 实现混合对象，首先这个对象是一个函数，其次这个对象要包括Axios类的所有原型属性和实例属性
// 把Axios类的属性都拷贝到函数中???
// 下面的函数把 from 的属性都拷贝到 to
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    // to 是 T和U 合并的结果
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}