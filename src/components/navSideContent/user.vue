<template>
  <div class="userBackground">
    <div class="userProfile">
      <div class="basicProfile commonBlockWrp">
        <img v-bind:src='userInfo.avatar_url' v-bind:title='userInfo.loginname'>
        <div class="basicProfileText">
          <span class="fa fa-user"> 用户名：{{userInfo.loginname}}</span><br>
          <span class="fa fa-gg-circle"></span>
          <span>积分：{{userInfo.score}}</span><br>
          <span class="fa fa-github"></span>
          <span>GitHub：https://github.com/{{userInfo.githubUsername}}</span><br>
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
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      userInfo: {
        create_at: ''
      }
    }
  },
  beforeCreate: function () {
    // console.log(this.$route.path)
    var _this = this
    this.$http({
      url: 'https://cnodejs.org/api/v1/user/' + (_this.$route.path).split('/')[3],
      method: 'get'
    }).then(function (res) {
      _this.userInfo = res.data.data
    }).catch(function (err) {
      console.log('出错了,错误信息是：' + err)
    })
  }
}
</script>

<style scoped>
a {
  /* text-decoration: none; */
  /* font-weight: bold; */
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
  box-shadow: 5px 5px 4px #eee, 5px -5px 4px #eee, -5px 5px 15px #eee;
}
.userBackground {
  background: #f6f6f6;
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
.basicProfile img {
  width: 8rem;
  border-radius: 1rem;
  margin-right: 30px;
  display: block;
  float: left;
}
.basicProfile .basicProfileText {
  line-height: 30px;
  float: left;
}

/* 与用户相关的话题 */
.relatedTopics {
  padding: 15px;
  margin-top: 15px;
}
.relatedTopics .topicItem {
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
}
.relatedTopics .topicItem img {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
}
.relatedTopics .topicItem a {
  line-height: 3rem;
  padding-left: 10px;
}
</style>
