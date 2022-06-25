import request from '@/utils/request'

// 登录，定义登录的具体后台地址和发送请求的方法和数据
export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  })
}
