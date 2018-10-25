/*
 * @Author: Reviving-Pain-Laptop
 * @Date: 2018-09-20 10:08:15
 * @Last Modified by: Reviving-Pain-Laptop
 * @Last Modified time: 2018-10-25 18:13:15
 */
import axios from 'axios'

// axios配置
// 配置请求数据的默认类型
axios.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
}
// 将data对象转化为多个键值对中间用&连接的形式
axios.defaults.transformRequest = [function (data) {
  let newData = ''
  for (let propName in data) {
    newData += encodeURIComponent(propName) + '=' + encodeURIComponent(data[propName]) + '&'
  }
  return newData
}]
// 配置axios相应超时时间(5s)
axios.defaults.timeout = 5000

// 配置默认的基础url
axios.defaults.baseURL = 'https://cnodejs.org/api/v1'

export default {
  // url:             数据请求的url，例如 '/topic'
  // type:            数据请求的方式，常用的有 'get' 和 'post'
  // params:          需要添加到数据请求url后面的参数写到这个对象里
  // data:            不希望出现在url中的请求参数放在这个对象里
  // successCallback: 请求成功后获取成功返回的数据并进行处理的方法
  // errorCallback:   请求失败后获取失败返回数据并进行处理的方法
  ajaxRequest (url, type, params, data, successCallback, errorCallback) {
    axios({
      url: url,
      method: type,
      params: params,
      data: data
    }).then(successCallback).catch(errorCallback)
  }
}
