<template>
  <div class="publishBackground">
    <loading v-if="loading"></loading>
    <div class="publishWrp">
      <div class="selectHead">
        <span>选择板块：</span>
        <select name="topicTab" v-model="publishData.topicTab">
          <option value="default_select" selected>请选择</option>
          <option value="share">分享</option>
          <option value="ask">问答</option>
          <option value="job">招聘</option>
          <option value="dev">客户端测试</option>
        </select>
      </div>
      <div class="topicTitle">
        <input type="text" v-model="publishData.topicTitle">
      </div>
      <div class="topicContent">
        <textarea name="" id="" cols="30" rows="10" v-model="publishData.topicContent"></textarea>
      </div>
      <div @click="publishTopic" class="publishBtn">提交</div>
    </div>
  </div>
</template>

<script>
import bus from '../../util/eventBus.js'
import loading from './loading.vue'
import request from '../../util/apiRequest.js'

export default {
  components: {
    'loading': loading
  },
  data: function () {
    return {
      loading: true,
      publishData: {
        topicTab: '',
        topicTitle: '',
        topicContent: ''
      }
    }
  },
  methods: {
    // 发布文章
    publishTopic: function () {
      if (this.publishData.topicTab === 'default_select') {
        alert('请选择板块')
      } else if (this.publishData.topicTitle === '') {
        alert('没有填写标题')
      } else if (this.publishData.topicContent === '') {
        alert('没有填写内容')
      } else {
        request.createTopic({
          accesstoken: sessionStorage['accesstoken'],
          title: this.publishData.topicTitle,
          tab: this.publishData.topicTab,
          content: this.publishData.topicContent
        }, (res) => {
          alert('发布成功！')
          console.log(res)
        }, (err) => {
          console.log(err.response)
          alert(err.response.data.error_msg)
        })
      }
    }
  },
  created: function () {
    var username = sessionStorage['loginUsername']
    if (!username) {
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
