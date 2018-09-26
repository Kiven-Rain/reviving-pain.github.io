/*
 * @Author: Reviving-Pain-Laptop
 * @Date: 2018-09-20 10:08:15
 * @Last Modified by: Reviving-Pain-Laptop
 * @Last Modified time: 2018-09-25 21:23:48
 */
import axios from 'axios'

// axios配置
// 配置请求数据的默认类型
axios.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
}
// 配置data对象里的数据格式(将JSON转化为键值对)
axios.defaults.transformRequest = [function (data) {
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret
}]
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
