/**
 * 判断是否为外部资源
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const validatetext = (rule, value, callback) => {
  if (!value && value === '') {
    callback(new Error('请输入内容'))
  } else if (value.length > 25) {
    callback(new Error('输入内容需要小于25个字符'))
  } else {
    callback()
  }
}
