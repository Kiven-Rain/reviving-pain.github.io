<template>
  <div class="content-wrap">
    <div v-show="displayContentMask" @click="hideMobilSidebar" class="content-mask">我是content遮罩层</div>
    <router-view name="defaultContent"></router-view>
    <keep-alive>
      <router-view name="cnodejsTopic"></router-view>
    </keep-alive>
    <router-view name="user"></router-view>
    <router-view v-if="isRouterAlive" name="article"></router-view>
    <router-view name="createTopic"></router-view>
    <router-view name="cnodeProfile"></router-view>
    <router-view name="css3Animation"></router-view>
    <router-view name="notFoundComponent"></router-view>
  </div>
</template>

<script>
import bus from '../util/eventBus.js'

export default {
  data: function () {
    return {
      hideBarOrder: true,
      displayContentMask: false,
      isRouterAlive: true
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
    },
    reload: function () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  },
  mounted: function () {
    // 接收来自于header侧边栏按钮的命令并决定content遮罩层的显隐
    bus.$on('displayContentMask', (msg) => {
      this.displayContentMask = msg
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content-wrap {
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
