<template>
  <div class="content-wrap content-wrap-response">
    <!-- 宽度小于900px且移动侧边栏展开时的遮罩层 -->
    <div v-show="this.$store.state.showNavside" @click="hideMobileSidebar" class="content-mask"></div>
    <router-view name="defaultContent"></router-view>
    <!-- 避免重复渲染的组件放在这里 -->
    <keep-alive>
      <router-view name="cnodejsTopics"></router-view>
    </keep-alive>
    <router-view name="user"></router-view>
    <router-view name="article" v-if="isRouterAlive"></router-view>
    <!-- 需要强制登录的的组件都放在这里 -->
    <div v-if="loginStatus">
      <router-view name="createTopic" v-if="isRouterAlive"></router-view>
      <router-view name="cnodeProfile"></router-view>
      <router-view name="messages" v-if="isRouterAlive"></router-view>
    </div>
    <router-view name="getMockdata"></router-view>
    <router-view name="notFoundComponent"></router-view>
    <loading v-show="loading"></loading>
  </div>
</template>

<script>
import loading from './common/loading.vue'

export default {
  components: {
    'loading': loading
  },
  data: function () {
    return {
      isRouterAlive: true,
      loading: true,
      // 管理需要登录才能查看的组件
      pageShouldLogin: [
        'createTopic',
        'profile',
        'messages'
      ]
    }
  },
  methods: {
    hideMobileSidebar: function () {
      // 点击遮罩层之后，隐藏侧边导航
      this.$store.commit('navSideController', !(this.$store.state.showNavside))
    },
    // 重新加载子组件
    reload: function () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    // 判断当前登录状态选择页面加载
    manageView: function (changeType) {
      if (!this.loginStatus) {
        let currentPage = this.$route.path.split('/').pop()
        if (this.pageShouldLogin.indexOf(currentPage) + 1) {
          this.loading = true
          if (changeType === 'routeChange') {
            // 失去登录状态后，从其他页面跳转到的当前页面如果必须登录才能查看，弹出alert提示
            alert('您尚未登录，请先登录')
          } else if (changeType === 'statusChange') {
            // 如果当前页面必须登录才能查看，失去登录状态后跳转到主页
            this.$router.push({path: '/cnodeCommunity/cnodejsTopics'})
          }
          this.$store.commit('openLoginCard', true)
        } else {
          this.loading = false
        }
      }
    }
  },
  computed: {
    loginStatus: function () {
      return this.$store.state.loginStatus
    }
  },
  watch: {
    // 切换路由时监控登录状态
    $route: function () {
      this.manageView('routeChange')
    },
    // 登录状态变化时的逻辑
    loginStatus: function () {
      if (this.loginStatus) {
        this.loading = !this.loginStatus
      } else {
        this.manageView('statusChange')
      }
    }
  },
  mounted: function () {
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
