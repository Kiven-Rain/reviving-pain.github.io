/*
 * @Author: Reviving-Pain-Laptop
 * @Date: 2018-10-05 10:10:50
 * @Last Modified by: Reviving-Pain-Laptop
 * @Last Modified time: 2018-10-12 15:53:42
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
  },
  // 平滑滚动方法,传入"目标位置"和"需要滚动的DOM对象"
  smoothScroll: function (aimPosition, passenger) {
    let currentPosition = passenger.scrollTop
    let step = Math.abs(currentPosition - aimPosition) / 50
    if (aimPosition !== currentPosition) {
      if (aimPosition > currentPosition) {
        smoothDown()
      } else {
        smoothUp()
      }
    }
    function smoothDown () {
      if (currentPosition < aimPosition) {
        // currentPosition每次朝着aimPosition前进step像素
        currentPosition += step
        passenger.scrollTop = currentPosition
        // (异步回调)将每一次回调在间隔时间结束后都依次推入事件队列一个接一个执行
        setTimeout(smoothDown, 10)
        // 普通的回调
        // smoothDown()
      } else {
        passenger.scrollTop = aimPosition
      }
    }
    function smoothUp () {
      if (currentPosition > aimPosition) {
        currentPosition -= step
        passenger.scrollTop = currentPosition
        setTimeout(smoothUp, 10)
      } else {
        passenger.scrollTop = aimPosition
      }
    }
  },
  // 更改页面标题,需要特殊处理的就传入pageType
  exchangePageTitle: function (pageName, pageType) {
    if (pageType === 'article') {
      document.title = '文章 - ' + pageName
    } else if (pageType === 'editArticle') {
      document.title = '编辑 - ' + pageName
    } else if (pageType === 'userCenter') {
      document.title = pageName + ' 的主页'
    } else if (pageType === 'profile') {
      document.title = 'CnodeJS社区个人中心'
    } else {
      document.title = pageName
    }
  },
  // 封装存储cookie的方法
  setCookie: function (name, value, hours) {
    // 创建一个日期对象，用来存储过期时间
    let date = new Date()
    date.setTime(date.getTime() + (hours - 8) * 1000 * 3600)
    document.cookie = name + '=' + value + ';expires=' + date
  },
  // 封装获取cookie的方法
  getCookie: function (name) {
    let cookies = document.cookie.split(' ')
    for (let i = 0; i < cookies.length; i++) {
      if (RegExp(name).test(cookies[i])) {
        return cookies[i].split('=')[1].replace(';', '')
      }
    }
  },
  // 封装清除cookie的方法
  removeCookie: function (name) {
    let date = new Date()
    date.setTime(date.getTime() - 12 * 1000 * 3600)
    document.cookie = name + '=' + '' + ';expires=' + date
  }
}
