<template>
  <div class="articleBackground">
    <loading v-if="loading"></loading>
    <div v-show="displayArticleContent" class="articleWrp">
      <!-- 文章详情页版头 -->
      <div class="articleHead commonBlockWrp">
        <h3>{{article.title}}</h3>
        <div @click="editController('edit')" v-if="(article.author.loginname === loginName) && loginStatus" class="editBtn" title="点击编辑">
          <span class="fa fa-edit"></span>
        </div>
        <button :disabled="subLoading.collectLoading" @click="collectController()" v-bind:class="['collectBtn', {'collectBtnActive': collectBtnActive}]" :title="collect">
          <span v-if="!subLoading.collectLoading">{{collect}}</span>
          <span v-if="subLoading.collectLoading" class="fa fa-spinner fa-spin"></span>
        </button>
        <router-link v-bind:to='{name: "UserRoute", params: {name: article.author.loginname}}'>
          <img class="authorAvatar" v-bind:src='article.author.avatar_url' :title="article.author.loginname">
          <span class="authorName">{{article.author.loginname}}</span>
        </router-link><br v-show="true">
        <span>发布于：{{(article.create_at).slice(0, 10)}}</span><br>
        <span class="fa fa-eye"> {{article.visit_count}}</span>
        <span class="fa fa-tags"> {{tab[article.tab]}}</span>
        <span class="fa fa-commenting"> {{article.reply_count}}</span>
      </div>
      <!-- 文章详情页文章内容部分 -->
      <vue-markdown class="articleContent commonBlockWrp" :source="article.content"></vue-markdown>
      <!-- 文章详情页评论部分 -->
      <div class="articleComments commonBlockWrp">
        <!-- 发表评论 -->
        <div class="publishCommnetWrp">
          <div v-if="!loginStatus" class="unLogin">
            <span class="tipText">发表评论需先</span>
            <div @click="openLoginWindow" class="commentBtn" title="点此登录">登录</div>
          </div>
          <div v-if="loginStatus">
            <textarea @keyup.enter="publishComment" class="commentArea" placeholder="写下你的评论…(支持markdown语法，请不要在非测试话题里发表测试评论，后果自负)" v-model.trim="commentContent"></textarea>
            <span class="tipText">Ctr+Enter 发表</span>
            <button :disabled="subLoading.commentLoading" @click="publishComment" class="commentBtn" title="点此发送">
              <span v-if="!subLoading.commentLoading">发表评论</span>
              <span v-if="subLoading.commentLoading">发送中…</span>
            </button>
          </div>
        </div>
        <!-- 已发表的评论 -->
        <h2>{{article.reply_count}} 条评论</h2>
        <div v-for='(comment, index) in article.replies' v-bind:key='index' class="commentCell">
          <router-link v-bind:to='{name: "UserRoute", params: {name: comment.author.loginname}}'  class="commentAvatar">
            <img v-bind:src='comment.author.avatar_url' :title="comment.author.loginname">
          </router-link>
          <div class="commentContent">
            <router-link v-bind:to='{name: "UserRoute", params: {name: comment.author.loginname}}'>
              <span class="commentUsername">{{comment.author.loginname}}</span>
              <span v-if="article.author.loginname === comment.author.loginname" class="authorTag">作者</span>
            </router-link>
            <vue-markdown :emoji="true" :source="comment.content.replace('(/user/', '(http://localhost:8080/#/cnodeCommunity/user/')" class="userComment"></vue-markdown>
            <span class="commentDate">{{(comment.create_at).slice(0,10) + ' ' + (comment.create_at).slice(11,20)}}</span>
            <button :disabled="subLoading.likeLoading" @click="likeController(index)" v-bind:class="['fa', 'fa-thumbs-o-up', 'like', {'likeActive': comment.ups.indexOf(loginId) + 1, 'fa-thumbs-up': comment.ups.indexOf(loginId) + 1}]">
              {{comment.ups.length}}
            </button>
          </div>
        </div>
      </div>
    </div>
    <create-topic :topicTab="article.tab" :topicTitle="article.title" :topicContent="article.content"
    ref="createTopic" v-if="eidtWindow" class="createTopic">
      <div slot="modifyBlockTitle">
        <span>文章编辑</span>
        <span @click="editController('cancelEdit')" class="cancelEdit">取消编辑</span>
      </div>
    </create-topic>
  </div>
</template>

<script>
import loading from '../common/loading.vue'
import request from '../../util/apiRequest.js'
import createTopic from './createTopic.vue'
import bus from '../../util/eventBus.js'
import vueMarkdown from 'vue-markdown'

export default {
  props: ['loginStatus'],
  components: {
    'loading': loading,
    'create-topic': createTopic,
    'vue-markdown': vueMarkdown
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
      tab: {
        share: '分享',
        good: '精华',
        ask: '问答',
        job: '招聘',
        dev: '客户端测试'
      },
      collect: '收藏',
      collectBtnActive: false,
      commentContent: '',
      loginName: '',
      loginId: '',
      loading: true,
      subLoading: {
        collectLoading: false,
        commentLoading: false,
        likeLoading: false
      },
      displayArticleContent: false,
      eidtWindow: false
    }
  },
  methods: {
    // 给评论点赞与取消点赞
    likeController: function (replyIndex) {
      var replyId = this.article.replies[replyIndex].id
      if (!this.loginStatus) {
        alert('需要登录')
      } else if (sessionStorage['loginUsername'] === this.article.replies[replyIndex].author.loginname) {
        alert('呵呵，不能给自己点赞')
      } else {
        this.subLoading.likeLoading = true
        // 点赞&取消点赞请求
        request.commentLike(replyId, {
          accesstoken: sessionStorage['accesstoken']
        }, (res) => {
          if (res.data.action === 'up') {
            this.article.replies[replyIndex].ups.push(sessionStorage['loginId'])
          } else {
            this.article.replies[replyIndex].ups.pop()
          }
          this.subLoading.likeLoading = false
        }, (err) => {
          console.log(err.response.data.error_msg)
        })
      }
    },
    // 文章添加收藏与取消收藏
    collectController: function () {
      var articleId = this.$route.path.split('/')[3]
      // 判断当前是否登录
      if (sessionStorage['loginUsername']) {
        // 判断当前文章收藏状态
        if (this.collectBtnActive) {
          this.subLoading.collectLoading = true
          // 文章取消收藏
          request.deCollectTopic({
            accesstoken: sessionStorage['accesstoken'],
            topic_id: articleId
          }, (res) => {
            this.subLoading.collectLoading = false
            console.log(res.data)
            this.collect = '收藏'
            this.collectBtnActive = false
          }, (err) => {
            console.log(err.response.data.error_msg)
          })
        } else {
          this.subLoading.collectLoading = true
          // 文章添加收藏
          request.collectTopic({
            accesstoken: sessionStorage['accesstoken'],
            topic_id: articleId
          }, (res) => {
            this.subLoading.collectLoading = false
            console.log(res.data)
            this.collect = '取消收藏'
            this.collectBtnActive = true
          }, (err) => {
            console.log(err.response.data.error_msg)
          })
        }
      } else {
        alert('要添加收藏请先登录')
        this.openLoginWindow()
      }
    },
    // 发表评论
    publishComment: function (e) {
      // enter+ctrl组合键 或者 点击发表评论按钮
      if ((e.code === 'Enter' && e.ctrlKey === true) || !e.code) {
        if (this.commentContent === '') {
          alert('评论不能为空！')
        } else {
          this.subLoading.commentLoading = true
          // 提交评论
          var topicId = this.$route.path.split('/').pop()
          request.createComment(topicId, {
            accesstoken: sessionStorage['accesstoken'],
            content: this.commentContent
          }, (res) => {
            this.subLoading.commentLoading = false
            alert('评论发布成功')
            console.log(res.data)
            // 调用父组件contentWrp的reload方法
            this.$parent.reload()
          }, (err) => {
            console.log(err.response.data.error_msg)
          })
        }
      }
    },
    // 打开or关闭文章编辑组件
    editController: function (controlType) {
      if (controlType === 'edit') {
        console.log('准备打开编辑组件')
        // 隐藏文章主体，显示编辑组件
        this.displayArticleContent = false
        this.eidtWindow = true
      } else if (controlType === 'cancelEdit') {
        this.displayArticleContent = true
        this.eidtWindow = false
      } else {
        console.log('未传入正确参数')
      }
    },
    // 打开登录弹窗
    openLoginWindow: function () {
      bus.$emit('openLoginCard', true)
    }
  },
  watch: {
    // 处理loginStatus状态同步延迟的问题，回填收藏与点赞状态
    loginStatus: function () {
      if (this.loginStatus) {
        console.log('已在登录状态，重新获取文章状态')
        this.$parent.reload()
      }
    }
  },
  created: function () {
    // 获取文章详情(包括文章和评论)
    var articleId = this.$route.path.split('/')[3]
    request.getTopicDetail(articleId, {
      mdrender: 'false'
    }, (res) => {
      this.article = res.data.data
      this.loading = false
      this.displayArticleContent = true
    }, (err) => {
      console.log('文章被删除了,错误信息是：' + err)
    })
    // 获取当前登录者的文章收藏并遍历
    this.loginName = sessionStorage['loginUsername']
    if (this.loginStatus) {
      this.loginId = sessionStorage['loginId']
      request.getUserCollectedTopic(this.loginName, (res) => {
        for (var i = 0; i < res.data.data.length; i++) {
          var collectedId = res.data.data[i].id
          if (collectedId === articleId) {
            // 这里处理已经收藏的初始化逻辑
            this.collect = '取消收藏'
            this.collectBtnActive = true
          }
        }
      }, (err) => {
        console.log(err.response)
      })
    } else {
      console.log('尚未登录，无法发表评论，无法获取文章收藏与点赞状态，也无法判断是否可编辑')
    }
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
  overflow: hidden;
}
@media only screen and (max-width: 375px) {
  .articleHead .authorAvatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 5px;
    box-shadow: 0px 0px 10px #999;
    margin: 10px 10px 5px 5px;
    float: left;
  }
  .articleHead .authorName {
    line-height: 4rem;
    font-size: 0.9rem;
    display: inline-block;
  }
}
@media only screen and (min-width: 375px) {
  .articleHead .authorAvatar {
    width: 5rem;
    height: 5rem;
    border-radius: 5px;
    box-shadow: 0px 0px 10px #999;
    margin: 10px 10px 5px 5px;
    float: left;
  }
  .articleHead .authorName {
    line-height: 3.4rem;
    font-size: 1.1rem;
  }
}
.articleHead .collectBtn {
  width: 70px;
  height: 35px;
  line-height: 35px;
  padding: 0px;
  border: none;
  border-radius: 5px;
  margin: 10px 5px 5px 5px;
  background: green;
  text-align: center;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  float: right;
}
.articleHead .collectBtnActive {
  background: #ccc;
  color: #777;
}
.articleHead .editBtn {
  width: 35px;
  height: 35px;
  line-height: 35px;
  border-radius: 5px;
  margin: 10px 5px 5px 5px;
  background: #999;
  text-align: center;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  user-select: none;
  float: right;
}
.articleHead > span {
  margin-right: 10px;
}

/* 调整通过markdown渲染出的html的样式 */
.articleContent {
  margin-top: 15px;
  padding: 1px 15px 15px 15px;
}
.articleContent >>> ul {
  list-style: none;
  padding-left: 1.5rem;
}
.articleContent >>> ul:first-child li {
  margin-left: 0.5rem;
  border-left: .2rem solid #0099cc;
}
.articleContent >>> a {
  text-decoration: none;
  color: #0099cc;
  font-size: 1.1rem;
  margin-left: 5px;
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
.publishCommnetWrp {
  width: 100%;
  padding: 0px 10px 10px 0px;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
}
.publishCommnetWrp .commentArea {
  width: 100%;
  height: 100px;
  box-shadow: 0px 0px 10px #999;
  resize: none;
  font-size: 1.1rem;
  font-family: '微软雅黑';
  outline: none;
}
.publishCommnetWrp .commentBtn {
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-top: 5px;
  background: green;
  color: #fff;
  font-size: 1rem;
  text-align: center;
  float: right;
  cursor: pointer;
  user-select: none;
}
.publishCommnetWrp .unLogin {
  width: 150px;
  height: 60px;
  margin: 0 auto;
  padding-top: 20px;
}
.tipText {
  padding-top: 10px;
  margin: 5px 10px 0px 0px;
  color: #777;
  float: left;
  user-select: none;
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
  box-shadow: 0px 0px 10px #666;
}
.commentContent {
  width: 100%;
  padding-left: 10px;
}
.commentUsername {
  height: 1rem;
  line-height: 1rem;
  display: inline-block;
  color: orange;
  font-size: 1.2rem;
  font-weight: normal;
}
.authorTag {
  width: 35px;
  height: 17px;
  line-height: 17px;
  border-radius: 3px;
  background: green;
  display: inline-block;
  color: #fff;
  text-align: center;
  font-size: .9rem;
  font-weight: normal;
}
/* 强制调整评论内容的css样式 */
.userComment >>> img {
  max-width: 70%;
  margin: 0 auto;
  display: block;
}
.userComment >>> a {
  color: #0099cc;
  text-decoration: none;
}
.userComment >>> ul {
  list-style: square;
}

.like {
  border: none;
  background: none;
  float: right;
  cursor: pointer;
  outline: none;
}
/* 设置按钮的disabled状态样式 */
.like[disabled] {
  color: #000;
}
.likeActive {
  color: #c60023;
}

/* 文章编辑组件css样式 */
.createTopic {
  background: #f6f6f6 !important;
}
.createTopic .cancelEdit {
  margin: 3px 10px 0px 0px;
  float: right;
  font-size: 1rem;
  color: #000;
  font-weight: normal;
  cursor: pointer;
  user-select: none;
}
.createTopic .cancelEdit:hover {
  color: #c60023;
}
</style>
