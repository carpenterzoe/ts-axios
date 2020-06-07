// 原本index中写的是axios的定义
// 这里把它抽出去，方便导出其他内容
// 比如导出下面的一些类型定义，让外部也可以使用这些类型定义
import axios from './axios'

// 导出类型定义，让外部也可以使用这些类型定义 (比如接口调用的app.ts中)
export * from './types'

export default axios