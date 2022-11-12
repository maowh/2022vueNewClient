const whiteList = ['/login', '/import', '/404', '/401']

// path是否需要被缓存，根据是否在白名单判断
export function isTags(path) {
  return !whiteList.includes(path)
}
