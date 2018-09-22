<template>
  <div>
    <h1>页面走丢了</h1>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // enter some data
    }
  },
  methods: {
    // put some function here
  },
  created: function () {
    // 处理cnode文章详情中出现的@用户的链接(v-html渲染的)，在这里做一个拼接和重定向
    if ((this.$route.path).split('/')[1] === 'user') {
      this.$router.push({path: '/cnodeCommunity' + this.$route.path})
    }
  }
}
</script>

<style scoped>
/* some css here */
</style>
