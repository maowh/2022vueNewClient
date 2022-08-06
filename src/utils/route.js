import path from 'path'

// 这处是递归调用难点，暂时没有理解

// 返回所有子路由
const getChildrenRoutes = (routes) => {
  const result = []
  routes.forEach((route) => {
    if (route.children && route.children.length > 0) {
      result.push(...route.children)
    }
  })
  return result
}

// 处理脱离层级的路由：某一个路由为其他子路由，则剔除该一级路由，保留路由层级
export const filterRouters = (routes) => {
  const childrenRoutes = getChildrenRoutes(routes)
  return routes.filter((route) => {
    return !childrenRoutes.find((childrenRoute) => {
      return childrenRoute.path === route.path
    })
  })
}

// 判断数据是否为空值
function isNull(data) {
  if (!data) return true
  if (JSON.stringify(data) === '{}') return true
  if (JSON.stringify(data) === '[]') return true
  return false
}

// 根据routes数据，返回对应menu规则数组
export function generateMenus(routes, basePath = '') {
  const result = []
  // 遍历路由表
  routes.forEach((item) => {
    // 不存在children && 不存在meta直接return
    if (isNull(item.meta) && isNull(item.children)) return
    // 存在children 不存在meta，进入迭代
    if (isNull(item.meta) && !isNull(item.children)) {
      result.push(...generateMenus(item.children))
      return
    }
    // 合并path作为跳转路径
    const routePath = path.resolve(basePath, item.path)
    // 路由分离后，存在同名父路由的情况，需要单独处理
    let route = result.find((item) => item.path === routePath)
    if (!route) {
      route = {
        ...item,
        path: routePath,
        children: []
      }
      // icon 与title必须全部存在
      if (route.meta.icon && route.meta.title) {
        // meta存在生成route对象，放入arr
        result.push(route)
      }
    }
    // 存在children进入迭代到children
    if (item.children) {
      route.children.push(...generateMenus(item.children, route.path))
    }
  })
  return result
}
