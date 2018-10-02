<template>
  <user-proifle :userName="loginName"></user-proifle>
</template>

<script>
import userProfile from './user.vue'

export default {
  components: {
    'user-proifle': userProfile
  },
  data: function () {
    return {
      loginName: ''
    }
  },
  created: function () {
    this.loginName = sessionStorage['loginUsername']
  }
}
</script>
