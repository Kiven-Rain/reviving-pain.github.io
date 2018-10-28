// 这是vue项目的入口文件，主要作用是初始化vue实例，以及引入需要使用的插件
import Vue from 'vue'
// 这里引入App.vue是因为进行根组件注册的时候要在冒号的右边引用组件的选项对象配置
import app from './App.vue'
import router from './router/index.js'
import 'babel-polyfill'
import store from './store/index.js'
import 'font-awesome/css/font-awesome.css'
import './assets/css/common.css'
import './assets/css/markdown.css'
import commonUtil from './util/common.js'
import apiRequest from './service/apiRequest.js'

// 配置浏览器console里输出生产环境的提示
Vue.config.productionTip = false

// 将自定义公共方法添加到vue的原型中
Vue.prototype.$commonUtil = commonUtil
Vue.prototype.$apiRequest = apiRequest

/* eslint-disable no-new */
// 创建Vue根实例
new Vue({
  el: '#app',
  // 引入路由配置 选项对象
  router,
  // 引入stroe配置
  store,
  // 注册根组件
  components: {
    App: app
  },
  template: '<App></App>'
})
