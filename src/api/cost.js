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
export const costCreateSingle = (data) => {
  return request({
    url: '/cost/createsingle',
    method: 'POST',
    data
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

// 数据条件筛选判断
export const costAllSelect = (data) => {
  return request({
    url: '/cost/allselect',
    method: 'POST',
    data
  })
}

// 数据条件分页筛选判断
export const costAllSelectPage = (data) => {
  return request({
    url: '/cost/allselectpage',
    method: 'POST',
    data
  })
}
