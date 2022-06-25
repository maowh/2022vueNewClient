import { login } from '@/api/sys'
// import md5 from 'md5'

export default {
  namespaced: true,
  state: () => ({}),
  mutations: {},
  actions: {
    login(context, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        // post服务器数据，获取返回数据
        login({
          username,
          // password: md5(password)
          password
        })
          .then((data) => {
            console.log('login正常')
            resolve()
          })
          .catch((err) => {
            console.log('login报错')
            reject(err)
          })
      })
    }
  }
}
