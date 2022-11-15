import router from './router'
import store from './store'

// 白名单
const whiteList = ['/login']
// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  // 存在token，进入主页
  // if (store.state.user.toke)
  // 快捷访问
  if (store.getters.token) {
    if (to.path === 'login') {
      next('/')
    } else {
      // 判断用户资料是否已获取，如果不存在用户信息，则需要获取用户信息
      if (!store.getters.hasUserInfo) {
        // 触发获用户信息的action
        // await store.dispatch('user/getUserInfo')
        // 获取到解析的permission
        const { permission } = await store.dispatch('user/getUserInfo')
        // console.log(permission.menus)
        // 处理用户权限，筛选出需要添加的权限
        const filterRoutes = await store.dispatch(
          'permission/filterRoutes',
          permission.menus
        )
        // 利用addRoute循环添加
        filterRoutes.forEach((item) => {
          router.addRoute(item)
          // console.log(item)
        })
        // 添加完动态路由之后，需要再进行一次主动跳转
        return next(to.path)
      }
      next()
    }
  } else {
    // 没有token的情况下，可以进入白名单
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
})
