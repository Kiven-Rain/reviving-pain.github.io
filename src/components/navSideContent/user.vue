<template>
  <div class="userBackground">
    <loading v-if="loading"></loading>
    <div v-show="!loading" class="userProfile">
      <div class="basicProfile commonBlockWrp">
        <img v-bind:src='userInfo.avatar_url' v-bind:title='userInfo.loginname'>
        <div class="basicProfileText">
          <span class="fa fa-user"> 用户名：{{userInfo.loginname}}</span><br>
          <span class="fa fa-gg-circle"></span>
          <span>积分：{{userInfo.score}}</span><br>
          <span class="fa fa-github"></span>
          <span>GitHub：</span>
          <a :href="'https://github.com/' + userInfo.githubUsername" target="_blank" title="点击进入github">{{userInfo.githubUsername}}</a><br>
          <span class="fa fa-clock-o"></span>
          <span>注册时间：{{(userInfo.create_at).slice(0,10) + ' ' + (userInfo.create_at).slice(11,20)}}</span>
        </div>
      </div>
      <div class="relatedTopics commonBlockWrp">
        <h2>最近发布的话题</h2>
        <div v-for='(item, index) in userInfo.recent_topics' v-bind:key='index' class="topicItem">
          <img v-bind:src='item.author.avatar_url' v-bind:title='item.author.loginname'>
          <router-link v-bind:to='{name: "ArticleRoute", params: {id: item.id}}'>
            <span>{{item.title}}</span>
          </router-link>
        </div>
      </div>
      <div class="relatedTopics commonBlockWrp">
        <h2>最近参与的话题</h2>
        <div v-for='(item, index) in userInfo.recent_replies' v-bind:key='index' class="topicItem">
          <img v-bind:src='item.author.avatar_url' v-bind:title='item.author.loginname'>
          <router-link v-bind:to='{name: "ArticleRoute", params: {id: item.id}}'>
            <span>{{item.title}}</span>
          </router-link>
        </div>
      </div>
      <div class="relatedTopics commonBlockWrp">
        <h2>收藏的话题</h2>
        <div v-for='(item, index) in userCollect' v-bind:key='index' class="topicItem">
          <img v-bind:src='item.author.avatar_url' >
          <router-link v-bind:to='{name: "ArticleRoute", params: {id: item.id}}'>
            <span>{{item.title}}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from '../common/loading.vue'
import request from '../../util/apiRequest.js'

export default {
  props: {
    'userName': String
  },
  components: {
    'loading': loading
  },
  data: function () {
    return {
      userInfo: {
        create_at: ''
      },
      userCollect: {},
      loading: true
    }
  },
  created: function () {
    var userName = ''
    if (!this.userName) {
      userName = (this.$route.path).split('/').pop()
    } else {
      userName = this.userName
    }
    // 请求用户基本信息
    request.getUserInfo(userName, (res) => {
      this.userInfo = res.data.data
      this.loading = false
    }, (err) => {
      console.log('请求个人信息出错了，错误信息是：' + err)
    })
    // 请求用户收藏的文章
    request.getUserCollectedTopic(userName, (res) => {
      this.userCollect = res.data.data
    }, (err) => {
      console.log('无法获取用户收藏，错误信息是：' + err)
    })
  }
}
</script>

<style scoped>
a {
  color: #000;
  font-size: 1.1rem;
}
h2 {
  height: auto;
  width: 100%;
  margin: 0px;
  border-bottom: 1px solid #c4c4c4;
  margin-bottom: 10px;
  font-size: 1.5rem;
}
.commonBlockWrp {
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 10px #ccc;
}
.userBackground {
  background: linear-gradient(#f6f6f6, #fff);
  min-height: 100%;
}
.userProfile {
  max-width: 800px;
  padding: 10px;
  margin: 0 auto;
}
.basicProfile {
  padding: 10px;
  overflow: hidden;
}
@media only screen and (max-width: 900px) {
  .basicProfile img {
    width: 8rem;
    border-radius: 2rem;
    box-shadow: 0px 0px 10px #999;
    margin: 0 auto;
    margin-bottom: 10px;
    display: block;
  }
  .basicProfile .basicProfileText {
    width: 240px;
    line-height: 30px;
    padding-left: 40px;
    margin: 0 auto;
  }
}
@media only screen and (min-width: 900px) {
  .basicProfile img {
    width: 8rem;
    border-radius: 5px;
    box-shadow: 0px 0px 10px #ccc;
    margin-right: 30px;
    display: block;
    float: left;
  }
  .basicProfile .basicProfileText {
    line-height: 30px;
    float: left;
  }
}
.basicProfile .basicProfileText a {
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  color: orange;
}

/* 与用户相关的话题 */
.relatedTopics {
  padding: 15px;
  margin-top: 15px;
}
.relatedTopics .topicItem {
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
}
.relatedTopics .topicItem img {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 10px #ccc;
}
.relatedTopics .topicItem a {
  line-height: 3rem;
  padding-left: 10px;
  line-height: 2rem;
  text-decoration: none;
}
.relatedTopics .topicItem a:hover {
  color: #999;
}
</style>
