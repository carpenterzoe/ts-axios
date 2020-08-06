// * 该文件是整个取消逻辑的实现

import { CancelExecutor, CancelTokenSource, Canceler } from '../types'

// * 函数类型
interface ResolvePromise {
  (reason?: string): void
}

export default class CancelToken {
  promise: Promise<string>
  reason?: string

  // * cancelToken类的构造函数 的参数 为CancelExecutor类型的函数
  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise

    this.promise = new Promise<string>(resolve => {
      // resolvePromise 指向 resolve函数
      // 后续调用 executor 时， 执行了resolvePromise，就相当于执行了 resolve
      resolvePromise = resolve
    })

    /**
     * * 在 CancelToken 被实例化时，构造函数中 resolvePromise指向了 Promise.resolve()
     * * 即 指向了同一个引用地址
     * 
     * * 而 executor 这个取消执行器，也在构造函数中初始化，所以可以直接调用前文存下的变量 resolvePromise
     * * 也就是说 在 executor 方法中，保存了 Promise.resolve() 方法的 引用地址
     * * 只要在外部调用 executor 就可以直接把 promise 变为 resolve 状态
     */
    executor(message => {
      // reason 一开始没有值，只有当调用过 executor之后才会有值
      // 所以用于防止多次调用
      if (this.reason) {
        return
      }
      this.reason = message
      resolvePromise(this.reason)
    })
  }

  /**
   * new CancelToken() 时，resolvePromise 会保存 promise的resolve
   * 所以 当实例调用 executor时，就可以直接手动把promise状态变成 resolve
   */


  // ??? source() 这种调用的方式的意义是什么，和上面那种调用方式有什么区别 ? 

  static source(): CancelTokenSource {

    // cancel的赋值包了一层函数，ts识别不到赋值了，所以用到类型断言
    // 在下文执行 new CancelToken时，cancel就被赋值了executor函数 所以 cancel一定有值
    let cancel!: Canceler

    const token = new CancelToken(c => {
      cancel = c
      
      // ??? 为什么执行 executor 就相当于执行了这里的赋值??
      // ??? 且赋值的意义是干什么用 ???
    })
    return {
      cancel,  // ? cancel 保存了取消执行器 ?? 
      token    // ? token 是 CancelToken 构造函数的实例对象 ?? 
    }
  }
}