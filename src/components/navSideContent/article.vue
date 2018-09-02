<template>
  <div>
    <div class="articleHead">
      <h3>{{article.title}}</h3>
      <span>发布于：{{(article.create_at).slice(0, 10)}}</span>
      <router-link v-bind:to='{name: "UserRoute", params: {name: article.author.loginname}}'>
        作者：{{article.author.loginname}}
      </router-link>
      <span>浏览量：{{article.visit_count}}</span>
      <span>总回复量：{{article.reply_count}}</span>
      <span>来自：{{article.tab}}</span>
    </div>
    <div class="articleContent" v-html='article.content'></div>
    <div class="articleComments">
      <div v-for='(comment, index) in article.replies' v-bind:key='index'>
        <router-link v-bind:to='{name: "UserRoute", params: {name: comment.author.loginname}}'>
          <img class="comment_avatar" v-bind:src='comment.author.avatar_url'>
        </router-link>
        <div>
          <span>{{comment.author.loginname}}</span>
          <span>{{(comment.create_at).slice(0,10) + ' ' + (comment.create_at).slice(11,20)}}</span>
          <span class="fa fa-thumbs-up">{{comment.ups.length}}</span>
          <p v-html='comment.content'></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      article: {
        title: '',
        author: {
          loginname: 'temp'
        },
        visit_count: '',
        tab: '',
        content: '',
        create_at: '',
        replies: ''
      }
    }
  },
  beforeCreate: function () {
    var _this = this
    _this.$http({
      url: 'https://cnodejs.org/api/v1/topic/' + this.$route.path.split('/')[3],
      method: 'get'
    }).then(function (res) {
      if (res.data.success === true) {
        _this.article = res.data.data
      } else {
        _this.article = '数据请求出错了~'
      }
    }).catch(function (res) {
      console.log('article.vue: ', res)
    })
  }
}
</script>

<style scoped>
.comment_avatar {
  width: 50px;
  height: 50px;
}
</style>
