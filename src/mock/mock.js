/*
* @Author: Reviving-Pain-Laptop
* @Date:   2018-07-25 19:37:54
* @Last Modified by:   Reviving-Pain-Laptop
* @Last Modified time: 2018-07-25 21:57:43
*/

// 引入mockjs插件
const Mock = require('mockjs')
// 设置所有Ajax请求的超时时间，模拟网络耗时
Mock.setup({
  timeout: 0 - 300
})
// 配置相关模拟数据
export var data = Mock.mock({
  // 'list|1-10': [{
  //   'id|+1': 1
  // }],
  'name|3': [{
    first: '@FIRST',
    middle: '@FIRST',
    last: '@LAST',
    full: '@first @middle @last'
  }]
})
