import { login, getUserInfoApi } from '@/api/sys'
import { setItem, getItem, removeAllItem } from '@/utils/storage'
import { TOKEN } from '@/constant'
import router, { resetRouter } from '@/router'
import { setTimeStamp } from '@/utils/auth'
// import store from './app'

// import md5 from 'md5'

export default {
  namespaced: true,
  state: () => ({
    token: getItem(TOKEN) || '',
    userInfo: {}
  }),
  mutations: {
    setToken(state, token) {
      // 更新token的状态
      state.token = token
      // 更新本地缓存的token数据
      setItem(TOKEN, token)
    },
    setUserInfo(state, userInfo) {
      // 更新userInfo的值
      state.userInfo = userInfo
    }
  },
  actions: {
    login(context, userInfo) {
      const { username, password } = userInfo
      console.log(userInfo)
      return new Promise((resolve, reject) => {
        // post服务器数据，获取返回数据
        login({
          username,
          // password: md5(password)
          password
        })
          .then((data) => {
            // 提交到mutations进行处理，响应拦截器处理后直接用data.token
            console.log(data)
            this.commit('user/setToken', data.token)
            // 跳转页面
            router.push('/')
            // 保存登录时间
            setTimeStamp()
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async getUserInfo(context) {
      // 调用api里面的接口，来获取传回来的数据
      const res = await getUserInfoApi()
      // 触发mutations下的user模块的setUserInfo
      this.commit('user/setUserInfo', res)
      return res
    },
    logout() {
      // 退出登录的时候清理路由
      resetRouter()
      this.commit('user/setToken', '')
      this.commit('user/setUserInfo', {})
      removeAllItem()
      this.commit('app/removeTagsView', {
        type: 'all'
      })
      router.push('/login')
    }
  }
}
