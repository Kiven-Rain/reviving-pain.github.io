<template>
  <div class="content-wrap content-wrap-response">
    <router-view name="cnodeWrp"></router-view>
    <router-view name="mockWrp"></router-view>
    <router-view name="defaultContent"></router-view>
    <router-view name="notFoundComponent"></router-view>
    <cnode-login v-if="$store.state.openLoginCard"></cnode-login>
    <!-- 宽度小于900px且移动侧边栏展开时的遮罩层 -->
    <div v-show="this.$store.state.showNavside" @click="hideMobileSidebar" class="content-mask"></div>
  </div>
</template>

<script>
import cnodeLogin from './navSideContent/cnodeContent/cnodeLogin.vue'

export default {
  components: {
    'cnode-login': cnodeLogin
  },
  data: function () {
    return {
      // some data here
    }
  },
  methods: {
    hideMobileSidebar: function () {
      // 点击遮罩层之后，隐藏侧边导航
      this.$store.commit('navSideController', !(this.$store.state.showNavside))
    }
  }
}
</script>

<style scoped>
.content-wrap {
  background: url(../assets/img/pub_background.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  text-align: left;
  position: absolute;
  top:0px;
  right: 0px;
  bottom: 0px;
  overflow-y: auto;
  overflow-x: hidden;
  transition: left 0.4s ease;
}

/* 响应式样式 */
@media only screen and (max-width: 900px) {
  /* contentWrp响应式样式 */
  .content-wrap-response {
    left: 0px;
  }
  /* 移动侧边栏遮罩层响应式样式 */
  .content-mask {
    background: #aaa;
    opacity: 0.2;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 140;
  }
}
@media only screen and (min-width: 900px) {
  /* contentWrp响应式样式 */
  .content-wrap-response {
    left: 260px;
  }
  /* 移动侧边栏遮罩层响应式样式 */
  .content-mask {
    display: none;
  }
}
</style>
