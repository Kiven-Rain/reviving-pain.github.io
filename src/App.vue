<!-- 我叫App.vue，我是这个项目的根组件 -->
<!-- 所有页面都是以我为中心，在我的片区下进行切换的 -->
<!-- 我是顶级组件，你们所有组件的爸爸 -->
<template>
  <div id="app">
    <div class="header">
      <nav-head></nav-head>
    </div>
    <div class="wrapper">
      <nav-side></nav-side>
      <content-wrap></content-wrap>
    </div>
    <div class="footer-wrap">
      <footer-wrap></footer-wrap>
    </div>
    <cnode-login></cnode-login>
    <!-- github的fork标签 -->
    <a href="https://github.com/Reviving-Pain/reviving-pain.github.io" target="_blank">
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

export default {
  components: {
    'nav-head': navHead,
    'nav-side': navSide,
    'content-wrap': contentWrap,
    'cnode-login': cnodeLogin,
    'footer-wrap': footerWrap
  },
  data: function () {
    return {
      // some data here
    }
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
}
</style>
