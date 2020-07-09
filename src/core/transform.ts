import { AxiosTransformer } from '../types'

// 由于可能会有多个转换函数
// 先定义一个transform函数，处理这些转换函数的调用逻辑
export default function transform(data: any, headers: any, 
  fns?: AxiosTransformer | AxiosTransformer[]): any {

    // 没有转换函数的话，data不需要任何操作，原样返回
    if (!fns) {
      return data
    }
    if (!Array.isArray(fns)) {
      fns = [fns]
    }

    fns.forEach( fn => {
      data = fn(data, headers)    // data会被fns中的方法依次加工，重新赋值，再加工
    })
    
    //  ??? 一开始传入了 data headers，后面加工返回合并到只有data ???
    // 因为 transformRequest 方法中，默认的方法 只返回data
    // 所以这里每次都是直接加工同一个headers?? 
    // 且headers指向同一个引用地址，会直接被改变???
    
    return data
}