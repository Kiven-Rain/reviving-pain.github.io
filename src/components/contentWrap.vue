<template>
  <div class="content-wrap">
    <div v-show="displayContentMask" @click="hideMobilSidebar" class="content-mask">我是content遮罩层</div>
    <router-view name="defaultContent"></router-view>
    <keep-alive>
      <router-view name="serverRequest"></router-view>
    </keep-alive>
    <router-view name="user"></router-view>
    <router-view name="article"></router-view>
    <router-view name="waterfallFlow"></router-view>
    <router-view name="css3Animation"></router-view>
  </div>
</template>

<script>
import bus from '../assets/eventBus.js'

export default {
  data: function () {
    return {
      hideBarOrder: true,
      displayContentMask: false
    }
  },
  methods: {
    hideMobilSidebar: function () {
      // 发出收起移动侧边栏的命令
      bus.$emit('hide-mobil-sidebar', this.hideBarOrder)
      // 发出复位顶部的侧边栏呼出按钮的命令
      bus.$emit('resetMobilsideBtn', this.hideBarOrder)
      // 遮罩层被点击之后隐藏
      this.displayContentMask = false
    }
  },
  mounted: function () {
    var self = this
    // 注意，$on()方法中的function参数中使用this很特别，有点儿箭头函数的意思，但是并没有使用箭头函数，this需要在这个方法外面缓存一一下
    // 接收来自于header侧边栏按钮的命令并决定content遮罩层的显隐
    bus.$on('displayContentMask', function (msg) {
      self.displayContentMask = msg
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content-wrap {
  /* padding: 10px; */
  top:0px;
  bottom: 0px;
  left: 260px;
  right: 0px;
  background: #fff;
  text-align: left;
  position: absolute;
  overflow-y: auto;
  overflow-x: hidden;
}

/*运用媒体查询检测宽度，比window.onresize方法效率高一点*/
@media only screen and (max-width: 900px) {
  .content-wrap {
    transition: left 0.4s ease;
    left: 0px;
  }
  /* 当设备宽度小于900px的时候遮罩层才会出现 */
  .content-mask {
    top: 60px;
    bottom: 50px;
    left:0px;
    right: 0px;
    opacity: 0.2;
    background: #ccc;
    position: fixed;
    z-index: 5;
  }
}
@media only screen and (min-width: 900px) {
  /* 当宽度大于900时，遮罩层消失 */
  .content-mask {
    display: none;
  }
  .content-wrap {
    transition: left 0.4s ease;
    left: 260px;
  }
}
</style>
