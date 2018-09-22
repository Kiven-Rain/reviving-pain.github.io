<template>
  <div class="publishBackground">
    <loading v-if="loading"></loading>
    <div class="publishWrp">
      <div>
        <span>选择板块：</span>
        <select name="topicTab">
          <option value="default_select">请选择</option>
          <option value="share">分享</option>
          <option value="ask">问答</option>
          <option value="job">招聘</option>
          <option value="dev">客户端测试</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../assets/eventBus.js'
import loading from './loading.vue'

export default {
  components: {
    'loading': loading
  },
  data: function () {
    return {
      loading: true
    }
  },
  methods: {
    // put some function here
  },
  created: function () {
    var username = sessionStorage['loginUsername']
    if (username === '') {
      alert('您尚未登陆，请先登录')
      bus.$emit('openLoginCard', true)
    } else {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.publishBackground {
  min-height: 100%;
  padding: 0px 10px 0px 10px;
  background: #f6f6f6;
  overflow: hidden;
}
.publishWrp {
  max-width: 800px;
  height: 1000px;
  box-shadow: 0px 0px 10px #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  background: #fff;
}
</style>
