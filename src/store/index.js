import { createStore } from 'vuex'
import user from './modules/user'
import getters from './getters'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  // getters快速访问
  getters,
  modules: { user }
})
