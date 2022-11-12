import request from '@/utils/request'

// 获取全部角色信息
export const roleList = () => {
  return request({
    url: '/role/rolelist'
  })
}

// 获取全部页面功能控制权限信息
export const permissionList = () => {
  return request({
    url: '/role/permissionlist'
  })
}

// 查询用户的角色信息
export const findRole = (id) => {
  return request({
    url: '/role/findrole',
    method: 'get',
    params: { id }
  })
}

// 分用户分配角色
export const updateRole = (userRoles) => {
  return request({
    url: '/role/updaterole',
    method: 'POST',
    data: userRoles
  })
}

// 查询角色的授权信息
export const findPermission = (id) => {
  return request({
    url: '/role/findpermission',
    method: 'get',
    params: { id }
  })
}
