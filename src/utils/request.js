import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store'

// 定义后台访问的基本地址和超时时间
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在这个位置需要统一的去注入token
    if (store.getters.token) {
      // 如果token存在 注入token
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config // 必须返回配置
  },
  (error) => {
    console.log('请求拦截器报错！')
    return Promise.reject(error)
  }
)

// 响应拦截器，对获取的data中的token数据进行处理
service.interceptors.response.use(
  // 请求成功
  (response) => {
    const { code, msg, data } = response.data
    // 需要判断当前请求是否成功
    if (code === 0) {
      // 成功返回解析后的数据
      return data
    } else {
      // 失败（请求成功，业务失败），消息提示
      ElMessage.error(msg)
      // 传递服务端返回的错误信息提示
      return Promise.reject(new Error(msg))
    }
  },
  // 请求失败
  (error) => {
    // token过期
    // if (
    //   error.response &&
    //   error.response.data &&
    //   error.response.data.code === 401
    // ) {
    //   store.dispatch('user/logout')
    // }
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export default service
