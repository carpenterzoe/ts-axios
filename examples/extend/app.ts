import axios from '../../src'

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'hello'
  }
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello'
  }
})

axios.get('/extend/get')

axios.options('/extend/options')

axios.delete('/extend/delete')

axios.head('/extend/head')

axios.post('/extend/post', { msg: 'post'})

axios.put('/extend/put', { msg: 'put' })

axios.patch('/extend/patch', { msg: 'patch'} )


interface ResponseData<T = any> {
  code: number
  result: T
  message: string
}

interface User {
  name: string
  age: number
}

function getUser<T>() {
  // 叠加泛型的写法???
  return axios<ResponseData<T>>('/extend/user')
    // 这里 res.data 表示什么含义???  表示再返回一层promise的返回值，让外部.then直接拿到data里的值???
    .then(res => res.data)    
    .catch(err => console.error(err))
}

async function test() {
  const user = await getUser<User>()
  if (user) {
    console.log(user.result.name)   // 前面定义了泛型T，所以这里可以推导出正确的属性
  }
}

/**
 * 为什么调用时传入了T，就能在返回数据中正确拿到这个类型？
 */