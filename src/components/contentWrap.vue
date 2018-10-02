<template>
  <div class="content-wrap">
    <div v-show="displayContentMask" @click="hideMobilSidebar" class="content-mask">我是content遮罩层</div>
    <router-view name="defaultContent"></router-view>
    <keep-alive>
      <router-view name="cnodejsTopic"></router-view>
    </keep-alive>
    <router-view name="user"></router-view>
    <router-view name="article" :loginStatus="loginStatus" v-if="isRouterAlive"></router-view>
    <!-- 需要强制登录的的组件都放在这里 -->
    <div v-if="loginStatus">
      <router-view name="createTopic" v-if="isRouterAlive"></router-view>
      <router-view name="cnodeProfile"></router-view>
      <router-view name="messages"></router-view>
    </div>
    <router-view name="getMockdata"></router-view>
    <router-view name="notFoundComponent"></router-view>
    <loading v-show="loading"></loading>
  </div>
</template>

<script>
import bus from '../util/eventBus.js'
import loading from './common/loading.vue'

export default {
  components: {
    'loading': loading
  },
  data: function () {
    return {
      hideBarOrder: true,
      displayContentMask: false,
      isRouterAlive: true,
      loading: true,
      // 管理需要登录才能查看的组件
      pageShouldLogin: [
        'createTopic',
        'profile',
        'messages'
      ],
      loginStatus: false
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
    // 重新加载子组件
    reload: function () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    // 判断当前登录状态选择页面加载
    manageView: function () {
      if (!this.loginStatus) {
        var currentPage = this.$route.path.split('/').pop()
        if (this.pageShouldLogin.indexOf(currentPage) + 1) {
          this.loading = true
          alert('您尚未登录，请先登录')
          bus.$emit('openLoginCard', true)
        } else {
          this.loading = false
        }
      }
    }
  },
  watch: {
    $route: function () {
      this.manageView()
    }
  },
  mounted: function () {
    // 接收来自于header侧边栏按钮的命令并决定content遮罩层的显隐
    bus.$on('displayContentMask', (msg) => {
      this.displayContentMask = msg
    })
    // 统一管理需要登录才能够加载的组件
    bus.$on('loginStatus', (loginStatus) => {
      this.loginStatus = loginStatus
      this.loading = !this.loginStatus
      this.manageView()
    })
    // 当未登录时，模块初次加载通过解析url只要不是pageShouldLogin里的成员就不需要loading
    for (var i = 0; i < this.pageShouldLogin.length; i++) {
      if (this.pageShouldLogin[i] !== this.$route.path.split('/')[2]) {
        this.loading = false
      } else {
        // 未登录状态,且确认是需要登录的页面,匹配一次即跳出循环,否则loading状态会被接下来的循环覆盖
        this.loading = true
        break
      }
    }
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
    z-index: 140;
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
