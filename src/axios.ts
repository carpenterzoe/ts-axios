import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'


// 实现Axios混合对象
// 本身是一个函数 但又有各个属性方法

/**
 * function createInstance(config: AxiosRequestConfig): AxiosInstance {}
 * 原有函数返回 AxiosInstance，改成 AxiosStatic，用于扩展axios.create方法
 */
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)

  // Axios的request方法内部访问了this，所以这里需要bind绑定上下文
  // 调axios作为方法时，实际上就是调用了这里的request
  const instance = Axios.prototype.request.bind(context)

  // 把Axios的原型属性和实例属性都拷贝到instance上
  // 所以instance实现了 AxiosInstance这个接口的定义
  // 本身是一个函数 但是又有各个属性作为方法以供更方便地调用
  extend(instance, context)

  // return instance as AxiosInstance
  return instance as AxiosStatic
}

const axios = createInstance(defaults)

// ? 老师说 这里不需要定义config的类型，因为有类型推断 ?
// ? so 类型推断 会通过内部函数所定义约束的类型，推断出外层调用函数参数的类型???
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios