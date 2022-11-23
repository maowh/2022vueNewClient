import request from '@/utils/request'

// 获取文章分页信息
export const getArticleList = (data) => {
  return request({
    url: '/article/articleList',
    params: data
  })
}

// 删除指定文章
export const deleteArticle = (id) => {
  return request({
    url: '/article/delete',
    method: 'get',
    params: { id }
  })
}

// 获取文章详情
export const articleDetail = (id) => {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

// 新增文章
export const articleCreate = (data) => {
  return request({
    url: '/article/create',
    method: 'POST',
    data
  })
}

// 编辑文章
export const articleEdit = (data) => {
  return request({
    url: '/article/edit',
    method: 'POST',
    data
  })
}
