<template>
  <div class="footer">
    <span>{{footerContent}}</span>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      footerContent: '我是footer'
    }
  }
}
</script>

<style scoped>
.footer {
  height: 100%;
  background: #2e3033;
}
</style>
