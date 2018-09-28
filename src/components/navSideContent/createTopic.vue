<template>
  <div class="publishBackground">
    <loading v-if="loading"></loading>
    <div v-show="!loading" class="publishWrp">
      <div class="selectHead">
        <span>选择板块：</span>
        <select name="topicTab" v-model="publishData.topicTab">
          <option value="default_select">请选择</option>
          <option value="share">分享</option>
          <option value="ask">问答</option>
          <option value="job">招聘</option>
          <option value="dev">客户端测试</option>
        </select>
      </div>
      <div class="topicTitle">
        <input type="text" v-model.trim="publishData.topicTitle" placeholder="标题字数10字以上">
      </div>
      <div class="topicContent">
        <textarea cols="30" rows="10" v-model.trim="publishData.topicContent" placeholder="测试帖请选择“客户端测试”板块！"></textarea>
      </div>
      <div @click="publishTopic" class="publishBtn">提交</div>
    </div>
  </div>
</template>

<script>
import loading from '../common/loading.vue'
import request from '../../util/apiRequest.js'

export default {
  components: {
    'loading': loading
  },
  data: function () {
    return {
      loading: false,
      publishData: {
        topicTab: 'default_select',
        topicTitle: '',
        topicContent: ''
      }
    }
  },
  methods: {
    // 发布文章
    publishTopic: function () {
      if (!(this.publishData.topicTab === 'default_select')) {
        if (this.publishData.topicTitle) {
          // 正则验证，标题字数10~50字之间
          var re = new RegExp('^.{10,50}$')
          if (re.test(this.publishData.topicTitle)) {
            console.log('正则验证通过')
            if (this.publishData.topicContent) {
              this.loading = true
              request.createTopic({
                accesstoken: sessionStorage['accesstoken'],
                title: this.publishData.topicTitle,
                tab: this.publishData.topicTab,
                content: this.publishData.topicContent
              }, (res) => {
                this.loading = false
                if (confirm('发布成功，需要查看刚发布的文章吗？')) {
                  this.$router.push({path: '/cnodeCommunity/cnodejsTopic/' + res.data.topic_id})
                } else {
                  this.$parent.reload()
                }
              }, (err) => {
                alert(err.response.data.error_msg)
              })
            } else {
              alert('内容不能为空')
            }
          } else {
            alert('标题太短或太长')
          }
        } else {
          alert('标题不能为空')
        }
      } else {
        alert('请选择分类')
      }
    }
  }
}
</script>

<style scoped>
.publishBackground {
  min-height: 100%;
  padding: 0px 10px 0px 10px;
  background: linear-gradient(#f6f6f6, #fff);
  overflow: hidden;
}
.publishWrp {
  max-width: 800px;
  box-shadow: 0px 0px 10px #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  background: #fff;
}
.selectHead {
  margin: 10px ;
  font-size: 1.2rem;
}
.selectHead select {
  width: 150px;
  height: 30px;
  padding-left: 5px;
  border-radius: 5px;
  font-size: 1.2rem;
  background: #fff;
}
.topicTitle {
  padding: 10px;
}
.topicTitle input {
  width: 100%;
  height: 30px;
  border: 1px solid #aaa;
  border-radius: 5px;
  font-size: 1.2rem;
  outline: none;
}
.topicContent {
  padding: 10px 15px 10px 10px;
}
.topicContent textarea {
  width: 100%;
  border: 1px solid #aaa;
  border-radius: 5px;
  font-size: 1.2rem;
  font-family: '微软雅黑';
  outline: none;
  resize: none;
}
.publishBtn {
  max-width: 600px;
  height: 50px;
  line-height: 50px;
  border-radius: 5px;
  margin: 0 auto;
  background: #c60023;
  text-align: center;
  color: #fff;
  font-size: 1.3rem;
}
</style>
