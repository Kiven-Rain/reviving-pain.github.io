<template>
  <div class="userProfile">
    <div>
      <img v-bind:src='userInfo.avatar_url' v-bind:title='userInfo.loginname'>
      <span>{{userInfo.loginname}}</span>
    </div>
    <div>
      <span class="fa fa-gg-circle"></span>
      <span>积分：{{userInfo.score}}</span>
    </div>
    <div>
      <span class="fa fa-github"></span>
      <span>GitHub：https://github.com/{{userInfo.githubUsername}}</span>
    </div>
    <div>
      <span class="fa fa-clock-o"></span>
      <span>注册时间：{{(userInfo.create_at).slice(0,10) + ' ' + (userInfo.create_at).slice(11,20)}}</span>
    </div>
    <div>
      <div v-for='(item, index) in userInfo.recent_topics' v-bind:key='index'>
        <img v-bind:src='item.author.avatar_url' v-bind:title='item.author.loginname'>
        <router-link v-bind:to='{name: "ArticleRoute", params: {id: item.id}}'>
          <span>{{item.title}}</span>
        </router-link>
      </div>
    </div>
    <div>
      <div v-for='(item, index) in userInfo.recent_replies' v-bind:key='index'>
        <img v-bind:src='item.author.avatar_url' v-bind:title='item.author.loginname'>
        <router-link v-bind:to='{name: "ArticleRoute", params: {id: item.id}}'>
          <span>{{item.title}}</span>
        </router-link>
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
