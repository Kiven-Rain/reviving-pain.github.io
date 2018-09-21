/*
 * @Author: Reviving-Pain-Laptop
 * @Date: 2018-09-20 10:08:15
 * @Last Modified by: Reviving-Pain-Laptop
 * @Last Modified time: 2018-09-20 23:03:16
 */
import axios from 'axios'

export default {
  ajaxRequest (url, type, params, successCallback, errorCallback) {
    axios({
      url: url,
      method: type,
      params: params
    }).then(successCallback).catch(errorCallback)
  }
}
