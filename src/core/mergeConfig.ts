import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

// strat => strategy    策略模式

// 默认策略：调用时有自定义配置，使用调用者的配置，没有的话 用默认配置
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 只取val2
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 混合合并策略
function deepMergeStrat(val1: any, val2: any): any {
  
  if (isPlainObject(val2)) {
    return deepMerge(val2)
  } else if (typeof val2 !== 'undefined') {
    return val2

  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

// 把取值只取val2的属性保存到 strats对象中
// 不在这个对象中的  则执行默认策略函数
const strats = Object.create(null)

// 对于 url params data 这种每个接口都不同的数据 只取 val2
const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach( key => {
  strats[key] = fromVal2Strat
})

// 对于 headers这样需要混合合并的复杂对象 采用的策略
const stratKeysDeepMerge = ['headers']
stratKeysDeepMerge.forEach( key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig): AxiosRequestConfig {
    if (!config2) {
      config2 = {}
    }

    const config = Object.create(null)

    for(let key in config2) {
      mergeFieled(key)
    }

    for(let key in config1) {
      if (!config2[key]) {
        mergeFieled(key)
      }
    }

    function mergeFieled(key: string): void {
      // strats 中保存了 仅取val2的属性 url params data, 和混合合并策略的headers
      // 在strats中找不到的属性, 则取默认函数
      const strat = strats[key] || defaultStrat   // strat就是方法, 方法有定义参数

      config[key] = strat(config1[key], config2![key])

      // config1[key] config2[key] 报错
      // key 是未知的值, 需要给接口定义中加上索引签名 ???
      // config2 虽然在前面定义了默认的空对象, 但这里又嵌套了一个函数, 所以推倒不出来, 需要类型断言
    }

    return config
  }