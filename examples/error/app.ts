import axios, { AxiosError } from '../../src/index'

// url故意写错，访问返回 404，catch中会捕获到错误
axios({
  method: 'get',
  url: '/error/get1'
}).then((res) => {
  console.log(res)
}).catch((e) => {
  console.log(e)
})

// 响应中随机出错
axios({
  method: 'get',
  url: '/error/get'
}).then((res) => {
  console.log(res)
}).catch((e) => {
  console.log(e)
})

// 延迟5秒发送请求，把控制台调成offline模拟网络错误
// 程序会走到request.onerror中
setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get'
  }).then((res) => {
    console.log(res)
  }).catch((e) => {
    console.log(e)
  })
}, 8000)

// 这个接口服务器设置的3秒后返回，这里设置超时时间为2秒，一定会超时
axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000
}).then((res) => {
  console.log(res)
}).catch((e: AxiosError) => {
  console.log(e.message)

  // 通过导出AxiosError接口，指明这里的error类型，可以拿到接口中定义的这些属性
  console.log(e.config)
  console.log(e.code)
  console.log(e.request)
  console.log(e.isAxiosError)
})