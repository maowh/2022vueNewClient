import request from '@/utils/request'

// 获取列表信息
export const costList = (data) => {
  return request({
    url: '/cost/list',
    params: data
  })
}

// 获取显示列表信息
export const costListDisplay = (data) => {
  return request({
    url: '/cost/listdisplay',
    params: data
  })
}

// 删除制定记录
export const costDel = (data) => {
  return request({
    url: '/cost/delete',
    method: 'get',
    params: data
  })
}

// 获取详情
export const costDetail = (data) => {
  return request({
    url: '/cost/detail',
    method: 'get',
    params: data
  })
}

// 获取详情
export const costDisplay = (data) => {
  return request({
    url: '/cost/display',
    method: 'get',
    params: data
  })
}
// 新增
export const costCreate = (data) => {
  return request({
    url: '/cost/create',
    method: 'POST',
    data
  })
}

// 编辑
export const costEdit = (data) => {
  return request({
    url: '/cost/edit',
    method: 'POST',
    data
  })
}

// 单选编辑
export const costSingleEdit = (data) => {
  return request({
    url: '/cost/editsingle',
    method: 'POST',
    data
  })
}
