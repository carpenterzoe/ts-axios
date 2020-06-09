import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'


// 实现Axios混合对象
// 本身是一个函数 但又有各个属性方法
function createInstance(): AxiosInstance {
  const context = new Axios()

  // Axios的request方法内部访问了this，所以这里需要bind绑定上下文
  // 调axios作为方法时，实际上就是调用了这里的request
  const instance = Axios.prototype.request.bind(context)

  // 把Axios的原型属性和实例属性都拷贝到instance上
  // 所以instance实现了 AxiosInstance这个接口的定义
  // 本身是一个函数 但是又有各个属性作为方法以供更方便地调用
  extend(instance, context)
  
  return instance as AxiosInstance
}

const axios = createInstance()

export default axios