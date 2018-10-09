<template>
  <div class="content-wrap">
    <div v-show="this.$store.state.showNavside" @click="hideMobilSidebar" class="content-mask">我是content遮罩层</div>
    <router-view name="defaultContent"></router-view>
    <keep-alive>
      <router-view name="cnodejsTopic"></router-view>
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
    hideMobilSidebar: function () {
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
            this.$router.push({path: '/cnodeCommunity/cnodejsTopic'})
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
