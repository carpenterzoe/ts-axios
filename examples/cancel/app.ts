import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch((e) => {
  if(axios.isCancel(e)) {
    console.log('Request canceled', e.message)
  }
})

setTimeout(() => {
  source.cancel('Operation canceled by the user.')
  
  axios.post('/cancel/post', { a: 1 }, {
    cancelToken: source.token
  }).catch((e) => {
    if(axios.isCancel(e)) {
      console.log(e.message)
    }
  })
}, 100)

// * case 2
var cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  })
});

// 取消请求
cancel();