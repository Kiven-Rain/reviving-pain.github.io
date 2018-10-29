<template>
  <user-proifle></user-proifle>
</template>

<script>
import userProfile from './user.vue'

export default {
  components: {
    'user-proifle': userProfile
  },
  data: function () {
    return {
      // some data here
    }
  },
  mounted: function () {
    this.$commonUtil.exchangePageTitle('', 'profile')
  }
}
</script>
