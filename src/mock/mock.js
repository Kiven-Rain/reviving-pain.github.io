/*
* @Author: Reviving-Pain-Laptop
* @Date:   2018-07-25 19:37:54
 * @Last Modified by: Reviving-Pain-Laptop
 * @Last Modified time: 2018-10-10 21:02:51
*/

// 引入mockjs插件
const Mock = require('mockjs')

// 配置一个自定义对象(人物特征)
let characteristics = {
  '血型': 'AB型',
  '外号': '阿黄',
  '喜爱的水果': '榴莲',
  '正在追的动漫': '汪汪队立大功',
  '暗恋的对象': '二年级三班 赛春花'
}

// 自定义请求响应时间
Mock.setup({
  // 设置4秒后再响应
  // timeout: 4000
  // 设置1~4秒间响应
  timeout: '1000-4000'
})

// 配置在接收到Ajax请求时，Mock.js的响应信息(这里的响应信息是JSON对象)
// 第二个选项为限定的请求类型,不匹配会报错，第二个选项不写则不限请求类型(常用有post和get)
Mock.mock('http://test.com', 'get', {
  // 随机生成1~3个用户信息
  'user|1-3': [{
    'name': '@cname', // 中文名称
    'id|+1': 5, // 随着随机条目的增长,属性值自动加1,初始值为5
    'age|18-28': 0, // 18至28以内随机整数, 0只是用来确定类型
    'birthday': '@date("yyyy-MM-dd)', // 日期
    'city': '@city(true)', // 中国城市
    'favoriteColor': '@color', // 16进制颜色
    'isMale|1': true, // 布尔值
    'isFat|1-2': true, // true的概率是三分之一 min / (min + max) 即 1/(1+2)为三分之一
    'characteristics1|2': characteristics, // 从characteristics这个对象中随机获取2个属性
    'characteristics2|1-3': characteristics, // 从characteristics这个对象中随机获取1~3个属性
    'brother|1': ['Jack', 'Jim', 'Jarvis'], // 随机获取1个数组元素
    'sister|+1': ['Eily', 'Clementine', 'Claire'], // 从数组中顺序的选取元素作为结果
    'friends|2': ['Crystal', 'Lukas', 'Ruben', 'Veronica'] // 重复2次属性值生成一个新数组
  }, {
    '(girl/boy)friend': '@cname'
  }]
})

// mock.js在接收到Ajax请求时，响应信息也可以是function
Mock.mock('http://test233.com', 'get', function () {
  return Mock.mock({
    'user|1-3': [{
      'name': '@cname',
      'id': 16
    }]
  })
})
// 响应信息为function时可以接收请求中的参数，参数只有经过格式转换才可以在这里接收到
Mock.mock('http://testorz.com', function (options) {
  // 这样方便对不合法的参数进行过滤
  console.log('Mock已拿到参数，参数信息如下：')
  console.log(options)
  return Mock.mock({
    'user|1-3': [{
      'name': '@cname',
      'id': 23
    }]
  })
})

// 自定义一些模拟对象
export var data = Mock.mock({
  // 随机输出1~10条email信息,对应的id的起始序号为1,随着数据条目的增长,id自动+1
  'list|1-10': [{
    'id|+1': 1,
    'email': '@EMAIL'
  }],
  // 输出3名随机人员的姓名信息
  'name|3': [{
    first: '@FIRST',
    middle: '@FIRST',
    last: '@LAST',
    full: '@first @middle @last'
  }]
})

// // 随机生成一个email格式字符串，写法一：
// console.log(Mock.mock('@email'))

// // 使用Mock.js的Random类来随机生成一个email格式的字符串，写法二：
// var random = Mock.Random
// console.log(random.email())

// Random类还支持自定义扩展
var random = Mock.Random
random.extend({
  weekday: function (date) {
    let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    // pick方法，返回一个只有列入挑选key属性的对象
    return this.pick(weekdays)
  },
  sex: function () {
    let sexes = ['男', '女', '中性', '未知']
    return this.pick(sexes)
  }
})

// // 测试刚刚配置好的自定义扩展
// console.log(random.weekday())
// console.log(Mock.mock('@weekday'))
// console.log(random.sex())
// console.log(Mock.mock('@sex'))

// // 数据结构匹配校验
// // Mock.valid(template, data) 用来校验真实数据data是否与数据模板的template匹配例如下面的这个例子：
// var tempObj = {'user|1-3': [{'name': '@cname', 'id|18-29': 20}]}
// var realObj = {'user': [{'name': '张三', 'id': 98}]}
// // 打印结果为对象，里面记录了匹配的结果汇报'
// console.log(Mock.valid(tempObj, realObj))
