<template>
  <div class="articleBackground">
    <loading v-if="loading"></loading>
    <div class="articleWrp">
      <div class="articleHead commonBlockWrp">
        <h3>{{article.title}}</h3>
        <router-link v-bind:to='{name: "UserRoute", params: {name: article.author.loginname}}'>
          <img style='width: 4rem;' v-bind:src='article.author.avatar_url'>
          <span>作者：</span>
          <span>{{article.author.loginname}}</span>
        </router-link>
        <span>发布于：{{(article.create_at).slice(0, 10)}}</span>
        <span>浏览量：{{article.visit_count}}</span>
        <span>来自：{{article.tab}}</span>
      </div>
      <div class="articleContent commonBlockWrp" v-html='article.content'></div>
      <div class="articleComments commonBlockWrp">
        <h2>{{article.reply_count}} 条评论</h2>
        <div v-for='(comment, index) in article.replies' v-bind:key='index' class="commentCell">
          <router-link v-bind:to='{name: "UserRoute", params: {name: comment.author.loginname}}'  class="commentAvatar">
            <img v-bind:src='comment.author.avatar_url'>
          </router-link>
          <div class="commentContent">
            <router-link v-bind:to='{name: "UserRoute", params: {name: comment.author.loginname}}'>
              <span class="commentUsername">{{comment.author.loginname}}</span>
            </router-link>
            <p class="userComment" v-html='comment.content'></p>
            <span class="commentDate">{{(comment.create_at).slice(0,10) + ' ' + (comment.create_at).slice(11,20)}}</span>
            <span class="like fa fa-thumbs-o-up"> {{comment.ups.length}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from './loading.vue'
import http from '../../assets/apiUtil.js'

export default {
  components: {
    'loading': loading
  },
  data: function () {
    return {
      article: {
        title: '',
        author: {
          // 给loginname设置缺省值，防止vue-router在console警告
          loginname: 'temp'
        },
        visit_count: '',
        tab: '',
        content: '',
        create_at: '',
        replies: ''
      },
      loading: true
    }
  },
  created: function () {
    var articleId = this.$route.path.split('/')[3]
    http.ajaxRequest('topic/' + articleId, 'get', {}, (res) => {
      this.article = res.data.data
      this.loading = false
    }, (err) => {
      console.log('文章被删除了,错误信息是：' + err)
    })
  },
  befroeRouteLeave: function (to, from, next) {
    alert('准备离开了！')
    next(false)
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  font-weight: bold;
  color: #c60023;
}
h3 {
  height: auto;
  width: 100%;
  margin: 0px;
  border-bottom: 1px solid #c4c4c4;
  font-size: 1.5rem;
  text-align: center;
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
.articleBackground {
  min-height: 100%;
  background: #f6f6f6;
}
.articleWrp {
  max-width: 800px;
  padding: 10px;
  margin: 0 auto;
  /* 在恰当的断字点进行换行 */
  word-break: break-all;
  z-index: 1;
}
.articleWrp >>> pre {
  /* pre-wrap保留空白符序列，但是正常地进行换行,浏览器默认为nowrap */
  white-space: pre-wrap;
}

/* 文章题头样式 */
.articleHead {
  padding: 10px;
}
.articleHead img {
  margin: 5px;
}

/* 调整通过v-html引入的html文档的样式 */
.articleContent {
  margin-top: 15px;
  padding: 1px 15px 15px 15px;
}
.articleContent >>> div {
  font-size: 1.1rem;
}
.articleContent >>> ul,li {
  list-style: none;
}
.articleContent >>> ul:first-child {
  list-style: none;
  padding-left: 1rem;
  margin-left: 0.5rem;
  border-left: .2rem solid #000;
}
.articleContent >>> a {
  /* text-decoration: none; */
  color: orange;
  font-size: 1.2rem;
}
.articleContent >>> img {
  max-width:  80%;
  display: block;
  margin: 0 auto;
}

/* 评论区样式 */
.articleComments {
  padding: 15px;
  margin: 15px 0px 15px 0px;
}
.commentCell {
  margin: 20px 0px 30px 0px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: row;
  /* overflow: hidden; */
}
.commentAvatar img {
  display: block;
  width: 3rem;
  height: 3rem;
}
.commentContent {
  width: 100%;
  padding-left: 10px;
}
.commentUsername {
  height: 1rem;
  line-height: 1rem;
  display: block;
  font-size: 1.2rem;
  font-weight: normal;
  /* float: left; */
}
.userComment >>> img {
  max-width: 70%;
  margin: 0 auto;
  display: block;
}
.like {
  float: right;

}
</style>
