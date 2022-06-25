import axios from 'axios'

// 定义后台访问的基本地址和超时时间
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// // 请求拦截器
// service.interceptors.request.use((config) => {
//   // 统一注入token
// })

export default service
