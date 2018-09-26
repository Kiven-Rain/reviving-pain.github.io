// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 这是vue项目的入口文件，主要作用是初始化vue实例并使用需要的插件
import Vue from 'vue'
// 这里引入App.vue是因为进行根组件注册的时候要在冒号的右边引用组件的选项对象配置
import app from './App.vue'
import router from './router/index.js'
import 'font-awesome/css/font-awesome.css'

// 配置浏览器console里输出生产环境的提示
Vue.config.productionTip = false

/* eslint-disable no-new */
// 创建Vue根实例
new Vue({
  el: '#app',
  // 引入路由配置 选项对象
  router,
  // 注册根组件
  components: {
    App: app
  },
  template: '<App></App>'
})
