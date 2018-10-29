<template>
  <div style="height: 100%; width: 100%;">
    <!-- 避免重复渲染的组件放在这里 -->
    <keep-alive>
      <router-view name="cnodejsTopics"></router-view>
    </keep-alive>
    <router-view name="user"></router-view>
    <router-view name="article" v-if="isRouterAlive"></router-view>
    <router-view name="createTopic" v-if="isRouterAlive"></router-view>
    <router-view name="cnodeProfile"></router-view>
    <router-view name="messages" v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      isRouterAlive: true,
      pageShouldLogin: [
        'createTopic',
        'profile',
        'messages'
      ]
    }
  },
  methods: {
    // 重新加载子组件
    reload: function () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  },
  computed: {
    loginStatus: function () {
      return this.$store.state.loginStatus
    }
  },
  watch: {
    loginStatus: function () {
      if (!this.loginStatus) {
        let shouldLogin = this.pageShouldLogin.indexOf(this.$route.path.split('/').pop()) + 1
        if (shouldLogin) {
          sessionStorage['lastOpenPath'] = this.$route.path
          this.$router.push({path: '/cnodeCommunity/cnodejsTopics'})
          this.$root.$children[0].reloadComponent()
          this.$store.commit('openLoginCard', true)
        }
      }
    }
  }
}
</script>

<style scoped>
/* some css here */
</style>
