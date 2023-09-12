// 获取指定范围内的所有月份
// 如传入参数start:2020-03,end:2021-03,调用getMonthBetween(start,end)方法，返回
// ["2020-03","2020-04","2020-05"...]等
// 获取指定范围内的所有月份
export function getMonthBetween(start, end) {
  var result = []
  var s = start.split('-')
  var e = end.split('-')
  var min = new Date()
  var max = new Date()
  min.setFullYear(s[0], s[1])
  max.setFullYear(e[0], e[1])
  var curr = min
  console.log(s, s[0], s[1], min.setFullYear(s[0], s[1]))
  // eslint-disable-next-line no-unmodified-loop-condition
  while (curr <= max) {
    var month = curr.getMonth()
    var str =
      (month === 0 ? curr.getFullYear() - 1 : curr.getFullYear()) +
      '-' +
      (month === 0 ? 12 : month < 10 ? '0' + month : month)
    var s1 = curr.getFullYear() + '-12'
    if (str === s1) {
      str = curr.getFullYear() + '-12'
    }
    result.push(str)
    curr.setMonth(month + 1)
    // curr.setMonth(month)
  }
  return result
}

// 获取指定日期范围内的月份数量
export function monthNumber(startDate, endDate) {
  const dateOne = new Date(startDate)
  const dateTwo = new Date(endDate)
  // 第一个日期的年和月
  const yearOne = dateOne.getFullYear()
  const monthOne = dateOne.getMonth() + 1
  // 第二个日期的年和月
  const yearTwo = dateTwo.getFullYear()
  const monthTwo = dateTwo.getMonth() + 1
  // 两个日期的月份数
  const oneMonthNum = yearOne * 12 + monthOne
  const twoMonthNum = yearTwo * 12 + monthTwo
  return Math.abs(oneMonthNum - twoMonthNum)
}
