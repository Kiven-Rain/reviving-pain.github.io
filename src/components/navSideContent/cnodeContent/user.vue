<template>
  <div class="nsc-commonWrp">
    <loading v-if="loading"></loading>
    <div v-show="!loading" class="nsc-commonBody">
      <div class="nsc-commonBlockWrp">
        <img :src='userInfo.avatar_url' class="author-avatar author-avatar-response" :title='userInfo.loginname'>
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
      <div class="nsc-commonBlockWrp">
        <h2>发布的话题</h2>
        <div class="nsc-commonBlockBody">
          <span v-if="!hasPublishTopic">没有发布过话题</span>
          <div v-show="index < publishTopicShowNum" v-for='(item, index) in userInfo.recent_topics' :key='index' class="topicItem">
            <img :src='item.author.avatar_url' :title='item.author.loginname'>
            <router-link :to='{name: "ArticleRoute", params: {id: item.id}}'>
              <span>{{item.title}}</span>
            </router-link>
          </div>
          <div @click="showMoreContent('publishTopic')" v-if="(userInfo.recent_topics.length > 6)" class="showMoreContent">
            <span v-show="publishTopicShowNum === 5">查看更多&nbsp;<i class="fa fa-angle-double-right"></i></span>
            <span v-show="publishTopicShowNum > 5">收起&nbsp;<i class="fa fa-angle-double-up"></i></span>
          </div>
        </div>
      </div>
      <div class="nsc-commonBlockWrp">
        <h2>最近参与的话题</h2>
        <div class="nsc-commonBlockBody">
          <span v-if="!userInfo.recent_replies.length">最近没有参与任何讨论</span>
          <div v-if="userInfo.recent_replies.length" v-for='(item, index) in userInfo.recent_replies' :key='index' class="topicItem">
            <img :src='item.author.avatar_url' :title='item.author.loginname'>
            <router-link :to='{name: "ArticleRoute", params: {id: item.id}}'>
              <span>{{item.title}}</span>
            </router-link>
          </div>
        </div>
      </div>
      <div class="nsc-commonBlockWrp">
        <h2>收藏的话题</h2>
        <div class="nsc-commonBlockBody">
          <span v-if="!hasCollect">收藏是不可能的，这辈子都不可能的</span>
          <div v-show="index < collectShowNum" v-for='(item, index) in userCollect' :key='index' class="topicItem">
            <img :src='item.author.avatar_url' :title='item.author.loginname'>
            <router-link :to='{name: "ArticleRoute", params: {id: item.id}}'>
              <span>{{item.title}}</span>
            </router-link>
          </div>
          <div @click="showMoreContent('collect')" v-if="(userCollect.length > 6)" class="showMoreContent">
            <span v-show="collectShowNum === 5">查看更多&nbsp;<i class="fa fa-angle-double-right"></i></span>
            <span v-show="collectShowNum > 5">收起&nbsp;<i class="fa fa-angle-double-up"></i></span>
          </div>
          <div v-if="collectLoading" class="collectLoadingWrp">
            <span class="fa fa-spinner fa-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from '../../common/loading.vue'

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
      hasPublishTopic: true,
      collectLoading: true,
      publishTopicShowNum: 5,
      collectShowNum: 5,
      loading: true
    }
  },
  methods: {
    showMoreContent: function (type) {
      if (type === 'collect') {
        if (this.collectShowNum === 5) {
          this.collectShowNum = this.userCollect.length
        } else {
          this.collectShowNum = 5
        }
      } else if (type === 'publishTopic') {
        if (this.publishTopicShowNum === 5) {
          this.publishTopicShowNum = this.userInfo.recent_topics.length
        } else {
          this.publishTopicShowNum = 5
        }
      }
    }
  },
  created: function () {
    let userName = (this.$route.path).split('/').pop()
    if (userName === 'profile') {
      this.$commonUtil.exchangePageTitle(userName, 'profile')
      userName = this.$store.state.loginUsername
    } else {
      this.$commonUtil.exchangePageTitle(userName, 'userCenter')
    }
    // 请求用户基本信息
    this.$apiRequest.getUserInfo(userName, (res) => {
      this.userInfo = res.data.data
      this.loading = false
      if (!this.userInfo.recent_topics.length) {
        this.hasPublishTopic = false
      }
    }, (err) => {
      console.log('请求个人信息出错了，错误信息是：' + err)
    })
    // 请求用户收藏的文章
    this.$apiRequest.getUserCollectedTopic(userName, (res) => {
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
/* 用户Profile版头样式 */
.nsc-commonBlockWrp .author-avatar {
  width: 8rem;
  height: 8rem;
  box-shadow: 0px 0px 10px #999;
}
.nsc-commonBlockWrp .basicProfileText a {
  font-size: 1rem;
  font-weight: bold;
  color: orange;
}

/* 与用户相关的话题板块样式 */
.nsc-commonBlockWrp .topicItem {
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  /* flex子元素在交叉轴上的对齐方式为居中对齐 */
  align-items: center;
}
.nsc-commonBlockWrp .topicItem img {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 10px #ccc;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
}
.nsc-commonBlockWrp .topicItem a {
  line-height: 1.6rem;
  padding-left: 10px;
  color: #222;
  font-size: 1.1rem;
  flex: 1 1 auto;
}
.nsc-commonBlockWrp .topicItem a:hover {
  color: #999;
}

/* 查看更多按钮 */
.nsc-commonBlockWrp .nsc-commonBlockBody .showMoreContent {
  padding: 10px 10px 0px 0px;
  display: inline-block;
  user-select: none;
  cursor: pointer;
}

/* 收藏加载loading */
.nsc-commonBlockWrp .nsc-commonBlockBody .collectLoadingWrp {
  width: 100%;
  height: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.nsc-commonBlockWrp .nsc-commonBlockBody .collectLoadingWrp .fa {
  width: 100%;
  font-size: 3rem;
  text-align: center;
  color: #333;
}

/* 响应式样式 */
@media only screen and (max-width: 900px) {
  /* 用户资料版头Avatar响应式样式 */
  .nsc-commonBlockWrp .author-avatar.author-avatar-response {
    border-radius: 2rem;
    margin: 0 auto;
    margin-bottom: 10px;
    display: block;
  }
  /* 用户资料版头(文本)基本信息响应式样式 */
  .nsc-commonBlockWrp .basicProfileText {
    width: 190px;
    line-height: 30px;
    padding-left: 25px;
    margin: 0 auto;
  }
  /* 用户资料版头(文本)基本信息Github链接样式 */
  .nsc-commonBlockWrp .basicProfileText .user-github {
    font-size: 0.9rem!important;
  }
}
@media only screen and (min-width: 900px) {
  /* 用户资料版头Avatar响应式样式 */
  .nsc-commonBlockWrp .author-avatar.author-avatar-response {
    border-radius: 5px;
    margin-right: 30px;
    display: inline-block;
  }
  /* 用户资料版头(文本)基本信息响应式样式 */
  .nsc-commonBlockWrp .basicProfileText {
    line-height: 30px;
    position: absolute;
    display: inline-block;
  }
  /* 收藏板块查看更多按钮的hover */
  .nsc-commonBlockWrp .nsc-commonBlockBody .showMoreContent:hover {
    color: #175199;
  }
}
</style>
