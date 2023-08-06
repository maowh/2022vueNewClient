import request from '@/utils/request'

// 登录，定义登录的具体后台地址和发送请求的方法和数据
export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  })
}

// 获取用户信息
export const getUserInfoApi = () => {
  return request({
    url: '/user/info'
  })
}

// 判断用户原始密码是否正确
export const getOriginalPwd = (data) => {
  return request({
    url: '/user/originalPwd',
    params: data
  })
}

// 判断用户原始密码是否正确
export const getUpdatePwd = (data) => {
  return request({
    url: '/user/updatePwd',
    params: data
  })
}

// 获取用户分页信息
export const getUserList = (data) => {
  return request({
    url: '/user/userList',
    params: data
  })
}
// 获取所有用户信息
export const getUserAll = () => {
  return request({
    url: '/user/userAll'
  })
}

// 获取文章列表信息
export const feature = () => {
  return request({
    url: '/user/feature'
  })
}

export const chapter = () => {
  return request({
    url: '/user/chapter'
  })
}

/**
 * 批量导入
 */
export const userImport = (data) => {
  return request({
    url: '/user/import',
    method: 'POST',
    data
  })
}

// 指定删除用户
export const deleteUser = (id) => {
  return request({
    url: '/user/delete',
    method: 'get',
    params: { id }
  })
}

// 查询指定用户信息
export const userDetail = (id) => {
  return request({
    url: '/user/detail',
    method: 'get',
    params: { id }
  })
}
