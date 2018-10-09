<template>
  <div id="app">
    <loading class="loading" v-if="loading"></loading>
    <div class="header">
      <nav-head></nav-head>
    </div>
    <div class="wrapper">
      <nav-side></nav-side>
      <content-wrap></content-wrap>
    </div>
    <div v-show="showFooter" class="footer-wrap">
      <footer-wrap></footer-wrap>
    </div>
    <cnode-login v-if="$store.state.openLoginCard"></cnode-login>
    <!-- github的fork标签 -->
    <a v-show="showFooter" href="https://github.com/Reviving-Pain/reviving-pain.github.io" target="_blank">
      <img class="fork-on-github" src="./assets/fork_on_github.png" alt="Fork me on GitHub">
    </a>
  </div>
</template>

<script>
import navHead from './components/navHead.vue'
import navSide from './components/navSide.vue'
import contentWrap from './components/contentWrap.vue'
import cnodeLogin from './components/cnodeLogin.vue'
import footerWrap from './components/footerWrap.vue'
import loading from './components/common/loading.vue'
import request from './util/apiRequest.js'

export default {
  components: {
    'nav-head': navHead,
    'nav-side': navSide,
    'content-wrap': contentWrap,
    'cnode-login': cnodeLogin,
    'footer-wrap': footerWrap,
    'loading': loading
  },
  data: function () {
    return {
      // 记录原本设备屏幕高度
      defaultHeight: document.documentElement.clientHeight,
      // 记录实时屏幕高度
      currentHeight: document.documentElement.clientHeight,
      // 控制footer的显隐
      showFooter: true,
      loading: false,
      isMobil: true,
      mobilDirection: 0
    }
  },
  methods: {
    // 处理软键盘弹出footer被顶起，占用狭小显示空间的问题
    resizeMethod: function () {
      // 监测到视口尺寸变化，判断当前平台
      if (navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )) {
        // 开发模式下pc端直接切移动端不触发footer相关判断逻辑
        if (this.isMobil === true) {
          // 存储本次触发onresize事件时的平台，用于下次判断使用
          this.isMobil = true
          // 监测到旋转，初始化屏幕默认方向，同时初始化defaultHeight(对比屏幕高度)与currentHeight(当前屏幕高度)
          if (window.orientation !== this.mobilDirection) {
            this.mobilDirection = window.orientation
            this.defaultHeight = document.body.clientHeight
            this.currentHeight = document.body.clientHeight
          }
          // 开始处理footer伸缩逻辑,首先记录当前实时显示区域高度
          this.currentHeight = document.body.clientHeight
          if (this.defaultHeight - this.currentHeight > 100) {
            this.showFooter = false
          } else {
            this.showFooter = true
          }
        } else {
          // do nothing, pc突然转mobil, footer不做任何响应
        }
      } else {
        // 当前是PC端
        this.isMobil = false
      }
    },
    // accesstoken验证
    verifyToken: function () {
      request.verifyAccesstoken({
        accesstoken: sessionStorage['accesstoken']
      }, (res) => {
        this.loading = false
        this.$store.commit('changeLoginStatus', res.data)
      }, (err) => {
        this.$store.commit('changeLoginStatus', {
          success: false
        })
        alert('认证失败，' + err.response.data.error_msg)
        // 重新加载一下登录组件
        this.$store.commit('openLoginCard', false)
        this.$nextTick(() => {
          this.$store.commit('openLoginCard', true)
        })
        sessionStorage['accesstoken'] = ''
      })
    }
  },
  created: function () {
    // 验证是否有token存储
    if (sessionStorage['accesstoken']) {
      this.loading = true
      this.verifyToken()
    } else {
      this.$store.commit('openLoginCard', true)
    }
  },
  mounted: function () {
    // 添加这个窗口resize事件监听器
    window.addEventListener('resize', this.resizeMethod, true)
    this.resizeMethod()
  }
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0px;
  padding: 0px;
  font-size: 15px;
  /*处理移动端点击时出现高亮蓝色背景的问题*/
  -webkit-tap-highlight-color: transparent;
}
/*调整浏览器滚动条宽度*/
::-webkit-scrollbar {
  /* 垂直滚动条宽度 */
  width: 8px;
  /* 水平滚动条宽度 */
  height: 8px;
}
/*定义滚动条滑块 内阴影+圆角+滑块颜色*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
  background-color: #c4c4c4;
}
/*定义滚动条轨道 内阴影+圆角+轨道颜色*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 8px;
  background-color: #F5F5F5;
}

#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
}
.wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}
.footer-wrap{
  height: 50px;
}
.fork-on-github {
  width: 120px;
  height: 120px;
  border: 0;
  position: absolute;
  bottom: 50px;
  right: 0;
  z-index: 120;
}
.loading {
  z-index: 300 !important;
}
</style>
