import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  // 私有属性  用于存储拦截器
  // interceptors 数组中包含的是 单个interceptor或null
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    // 添加拦截器
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1   // 返回拦截器id
  }

  // 提供一个遍历拦截器的方法，给拦截器实现内部逻辑使用
  // 在定义接口时没有定义forEach，因为forEach并不对外提供
  // 且接口定义和接口实现并不需要完全一致
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach( interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    // 不能删除原数组，因为原数组的id是根据数组的长度来定位的
    // 所以把要剔除的拦截器置为null，数组的占位还是保持原来的
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}