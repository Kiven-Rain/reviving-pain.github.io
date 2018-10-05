/*
 * @Author: Reviving-Pain-Laptop
 * @Date: 2018-10-05 10:10:50
 * @Last Modified by: Reviving-Pain-Laptop
 * @Last Modified time: 2018-10-05 20:00:41
 */

export default {
  // 转换日期格式，将日期转换为距离传入时间的间距
  transformTimeInterval: function (publishTime) {
    let dateUnit = (publishTime.split('T')[0]).split('-')
    let timeUnit = ((publishTime.split('T')[1]).substr(0, 8)).split(':')
    let year = parseInt(dateUnit[0])
    let month = parseInt(dateUnit[1]) - 1
    let day = parseInt(dateUnit[2])
    let hour = parseInt(timeUnit[0]) + 8
    let minute = parseInt(timeUnit[1])
    let second = parseInt(timeUnit[2])
    // 传入时间格式转换
    let articleTime = new Date(year, month, day, hour, minute, second)
    // 当前时间
    let currentTime = new Date()
    // console.log('文章时间(+8)：' + articleTime)
    // console.log('当前时间(+8)：' + currentTime)
    // 做时间差，差值为+8时区日期，年份基数为1970年
    let timeInterval = parseInt(currentTime - articleTime)
    // 转换成UTC时区(也就是+0时区)时间
    let calculateTime = new Date((new Date(timeInterval)).toUTCString())
    // console.log('时间差时间(+0)：' + calculateTime)
    if (!(calculateTime.getUTCFullYear() - 1970)) {
      if (!calculateTime.getUTCMonth()) {
        if (!(calculateTime.getUTCDate() - 1)) {
          if (!calculateTime.getUTCHours()) {
            if (!calculateTime.getUTCMinutes()) {
              return '刚刚'
            } else {
              return calculateTime.getUTCMinutes() + '分钟前'
            }
          } else {
            return calculateTime.getUTCHours() + '小时前'
          }
        } else {
          let dayInterval = calculateTime.getUTCDate() - 1
          return dayInterval + '天前'
        }
      } else {
        return calculateTime.getUTCMonth() + '个月前'
      }
    } else {
      let yearInterval = calculateTime.getUTCFullYear() - 1970
      return yearInterval + '年前'
    }
  }
}
