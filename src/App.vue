<template>
  <div id="app">
    <div class="rw-header">
      <rw-head></rw-head>
    </div>
    <div class="rw-wrapper">
      <nav-side v-if="isRouterAlive"></nav-side>
      <rw-content></rw-content>
    </div>
    <div v-show="showFooter" class="rw-footer">
      <rw-footer></rw-footer>
    </div>
    <!-- github的fork标签 -->
    <a v-show="showFooter" href="https://github.com/Reviving-Pain/reviving-pain.github.io" target="_blank" title="fork me, thanks">
      <fork-me class="fork-me"></fork-me>
    </a>
    <loading style="z-index:300; background:rgba(255,255,255,1)" v-if="loading"></loading>
  </div>
</template>

<script>
import header from './components/header.vue'
import navSide from './components/navSide.vue'
import content from './components/content.vue'
import footer from './components/footer.vue'
import loading from './components/common/loading.vue'
import forkMe from './components/common/forkMe.vue'

export default {
  components: {
    'rw-head': header,
    'nav-side': navSide,
    'rw-content': content,
    'rw-footer': footer,
    'loading': loading,
    'fork-me': forkMe
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
      // 存储本次触发onresize事件时的平台，用于下次判断使用
      isMobile: true,
      mobileDirection: 0,
      isRouterAlive: true
    }
  },
  methods: {
    // 处理软键盘弹出footer被顶起，占用狭小显示空间的问题
    resizeMethod: function () {
      // 监测到视口尺寸变化，判断当前平台
      if (navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )) {
        // 当前是移动端
        this.$store.commit('mobileController', true)
        // 开发模式下pc端直接切移动端不触发footer相关判断逻辑
        if (this.isMobile === true) {
          // 监测到旋转，初始化屏幕默认方向，同时初始化defaultHeight(对比屏幕高度)与currentHeight(当前屏幕高度)
          if (window.orientation !== this.mobileDirection) {
            this.mobileDirection = window.orientation
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
          // pc突然转mobile, footer不做任何响应
          this.isMobile = true
        }
      } else {
        // 当前是PC端
        this.$store.commit('mobileController', false)
        this.isMobile = false
      }
    },
    // accesstoken验证
    verifyToken: function () {
      this.$apiRequest.verifyAccesstoken({
        accesstoken: this.$commonUtil.getCookie('accesstoken')
      }, (res) => {
        this.loading = false
        this.$store.commit('changeLoginStatus', res.data)
      }, (err) => {
        this.$store.commit('changeLoginStatus', {
          success: false
        })
        // 密码验证错误时清除错误的cookie存储
        this.$commonUtil.removeCookie('accesstoken')
        this.$commonUtil.netErrorTips(err)
        this.loading = false
        // 重新加载一下登录组件
        this.$children[2].reload()
      })
    }
  },
  created: function () {
    // 验证是否有token存储
    if (this.$commonUtil.getCookie('accesstoken')) {
      sessionStorage['isAutoLogin'] = 'true'
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
  width: 100%;
  margin: 0px;
  padding: 0px;
  font-size: 15px;
  /*处理移动端点击时出现高亮蓝色背景的问题*/
  -webkit-tap-highlight-color: transparent;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* root-window(rw) css style */
#app {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
}
.rw-header {
  order: 0;
  flex: 0 1 60px;
  z-index: 200;
}
.rw-wrapper {
  order: 1;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  /* flex: 1 1 auto; 为以上三者的缩写*/
  /* 照顾到子元素的absulute定位 */
  position: relative;
}
.rw-footer{
  order: 2;
  flex: 0 1 50px;
  z-index: 150;
}

/* github标签组件定位样式 */
.fork-me {
  position: fixed;
  transform: rotate(-45deg)!important;
  right: -45px;
  bottom: 85px;
  z-index: 120;
}
</style>
