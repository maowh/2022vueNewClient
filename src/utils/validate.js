/**
 * 判断是否为外部资源
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const validatetext = (rule, value, callback) => {
  if (!value || value === '') {
    callback(new Error('请输入内容'))
  } else if (value.length > 50) {
    callback(new Error('输入内容需要小于50个字符'))
  } else {
    callback()
  }
}
// 判断是否复杂密码
export function isComplexPwd(password) {
  return /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}/.test(password)
}
