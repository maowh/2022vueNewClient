const getters = {
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userInfo,
  // return true表示已存在用户信息
  hasUserInfo: (state) => {
    return JSON.stringify(state.user.userInfo) !== '{}'
  }
}

export default getters
