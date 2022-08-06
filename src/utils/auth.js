import { TIME_STAMP, TOKEN_TIMEOUT_VALUE } from '@/constant'
import { setItem, getItem } from '@/utils/storage'

// 获取时间戳，当前时间
export function getTimeStamp() {
  return getItem(TIME_STAMP)
}
// 设置时间戳，记录登录的当前时间
export function setTimeStamp() {
  setItem(TIME_STAMP, Date.now())
}
// 是否超时
export function isCheckTimeout() {
  // 当前时间戳
  var currentTime = Date.now()
  // 缓存时间戳
  var timeStamp = getTimeStamp()
  // 判断当前时间减去登录时间是否超过token失效时间
  return currentTime - timeStamp > TOKEN_TIMEOUT_VALUE
}
