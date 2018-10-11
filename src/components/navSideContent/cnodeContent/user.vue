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
          <a class="user-github" :href="'https://github.com/' + userInfo.githubUsername" target="_blank" title="点击进入github">{{userInfo.githubUsername}}</a><br>
          <span class="fa fa-clock-o"></span>
          <span>注册时间：{{(userInfo.create_at).slice(0,10)}}</span>
        </div>
      </div>
      <div class="relatedTopics commonBlockWrp">
        <h2>最近发布的话题</h2>
        <span v-if="!userInfo.recent_topics.length">最近没有发布话题</span>
        <div v-if="userInfo.recent_topics.length" v-for='(item, index) in userInfo.recent_topics' v-bind:key='index' class="topicItem">
          <img v-bind:src='item.author.avatar_url' v-bind:title='item.author.loginname'>
          <router-link v-bind:to='{name: "ArticleRoute", params: {id: item.id}}'>
            <span>{{item.title}}</span>
          </router-link>
        </div>
      </div>
      <div class="relatedTopics commonBlockWrp">
        <h2>最近参与的话题</h2>
        <span v-if="!userInfo.recent_replies.length">最近没有参与任何讨论</span>
        <div v-if="userInfo.recent_replies.length" v-for='(item, index) in userInfo.recent_replies' v-bind:key='index' class="topicItem">
          <img v-bind:src='item.author.avatar_url' v-bind:title='item.author.loginname'>
          <router-link v-bind:to='{name: "ArticleRoute", params: {id: item.id}}'>
            <span>{{item.title}}</span>
          </router-link>
        </div>
      </div>
      <div class="relatedTopics commonBlockWrp">
        <h2>收藏的话题</h2>
        <span v-if="!this.hasCollect">收藏是不可能的，这辈子都不可能的</span>
        <div v-show="index < collectShowNum" v-for='(item, index) in userCollect' v-bind:key='index' class="topicItem">
          <img v-bind:src='item.author.avatar_url' v-bind:title='item.author.loginname'>
          <router-link v-bind:to='{name: "ArticleRoute", params: {id: item.id}}'>
            <span>{{item.title}}</span>
          </router-link>
        </div>
        <div @click="showMoreCollect" v-if="(userCollect.length > 6)" class="showMoreCollect">
          <span v-show="collectShowNum === 5">查看更多&nbsp;<i class="fa fa-angle-double-right"></i></span>
          <span v-show="collectShowNum > 5">收起&nbsp;<i class="fa fa-angle-double-up"></i></span>
        </div>
        <div v-if="collectLoading" class="collectLoadingWrp">
          <span class="fa fa-spinner fa-pulse"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from '../../common/loading.vue'
import request from '../../../util/apiRequest.js'
import commonUtil from '../../../util/common.js'

export default {
  components: {
    'loading': loading
  },
  data: function () {
    return {
      userInfo: {
        create_at: '',
        recent_topics: [],
        recent_replies: []
      },
      userCollect: {},
      hasCollect: true,
      collectLoading: true,
      collectShowNum: 5,
      loading: true
    }
  },
  methods: {
    showMoreCollect: function () {
      if (this.collectShowNum === 5) {
        this.collectShowNum = this.userCollect.length
      } else {
        this.collectShowNum = 5
      }
    }
  },
  created: function () {
    let userName = (this.$route.path).split('/').pop()
    if (userName === 'profile') {
      commonUtil.exchangePageTitle(userName, 'profile')
      userName = this.$store.state.loginUsername
    } else {
      commonUtil.exchangePageTitle(userName, 'userCenter')
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
      this.collectLoading = false
      this.userCollect = res.data.data
      if (!this.userCollect.length) {
        this.hasCollect = false
      }
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
  background: linear-gradient(rgba(246, 246, 246, 0.9), rgba(255, 255, 255, 0.9));
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
    width: 180px;
    line-height: 30px;
    padding-left: 20px;
    margin: 0 auto;
  }
  .user-github {
    font-size: 0.9rem!important;
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
  /* 收藏板块查看更多按钮的hover */
  .showMoreCollect:hover {
    color: #175199;
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
  flex-shrink: 0;
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
/* 收藏loading */
.collectLoadingWrp {
  width: 100%;
  height: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.collectLoadingWrp .fa {
  width: 100%;
  font-size: 3rem;
  text-align: center;
  color: #333;
}
.showMoreCollect {
  padding: 10px 10px 0px 0px;
  display: inline-block;
  cursor: pointer;
}
</style>
