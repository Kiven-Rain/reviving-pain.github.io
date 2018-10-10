<template>
  <div ref="article" class="articleBackground">
    <loading v-if="loading"></loading>
    <!-- 锚点定位快速跳转按钮 -->
    <div v-show="!eidtWindow" class="anchorPosition">
      <span @click="anchorPosition('top')" class="fa fa-arrow-circle-up" title="回到顶部"></span>
      <span @click="anchorPosition('comments')" class="fa fa-commenting" title="查看评论"></span>
    </div>
    <!-- 文章详情页 -->
    <div v-show="displayArticleContent" class="articleWrp">
      <!-- 文章详情页版头 -->
      <div class="articleHead commonBlockWrp">
        <h3>{{article.title}}</h3>
        <!-- 编辑按钮 -->
        <div @click="editController('edit')" v-if="article.author.loginname === $store.state.loginUsername" class="editBtn" title="点击编辑">
          <span class="fa fa-edit"></span>
        </div>
        <!-- 收藏按钮 -->
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
      <div ref="comments" class="articleComments commonBlockWrp">
        <!-- 发表评论 -->
        <div class="publishCommnetWrp">
          <div v-if="!loginStatus" class="unLogin">
            <span class="tipText">发表评论需先</span>
            <div @click="openLoginWindow" class="commentBtn" title="点此登录">登录</div>
          </div>
          <div v-if="loginStatus">
            <textarea @keyup.enter="publishComment" class="commentArea" placeholder="写下你的评论…(支持markdown语法，请不要在非测试话题里发表测试评论，后果自负)" v-model.trim="commentContent"></textarea>
            <span class="tipText">Ctrl+Enter 发表</span>
            <button :disabled="subLoading.commentLoading" @click="publishComment" class="commentBtn" title="点此发送">
              <span v-if="!subLoading.commentLoading">发表评论</span>
              <span v-if="subLoading.commentLoading">发送中…</span>
            </button>
          </div>
        </div>
        <!-- 已发表的评论 -->
        <h2>{{article.reply_count}} 条评论</h2>
        <span v-if="!article.replies.length">
          <img class="sofa" src="../../../assets/sofa.svg" alt="抢沙发" title="抢沙发">
        </span>
        <div v-if="article.replies.length" v-for='(comment, index) in article.replies' v-bind:key='index' class="commentCell">
          <router-link v-bind:to='{name: "UserRoute", params: {name: comment.author.loginname}}'  class="commentAvatar">
            <img v-bind:src='comment.author.avatar_url' :title="comment.author.loginname">
          </router-link>
          <div class="commentContent">
            <router-link v-bind:to='{name: "UserRoute", params: {name: comment.author.loginname}}'>
              <span class="commentUsername">{{comment.author.loginname}}</span>
              <span v-if="article.author.loginname === comment.author.loginname" class="authorTag">作者</span>
            </router-link>
            <vue-markdown :emoji="true" :source="comment.content.replace('(/user/', '(' + currentUrlPrefix + 'cnodeCommunity/user/')" class="userComment"></vue-markdown>
            <span class="commentDate">{{comment.create_at}}</span>
            <button :disabled="subLoading.likeLoading" @click="likeController(index)" v-bind:class="['fa', 'like', {'likeActive': comment.is_uped, 'fa-thumbs-o-up': !comment.is_uped, 'fa-thumbs-up': comment.is_uped}]">
              {{comment.ups.length}}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 文章编辑部分 -->
    <edit-topic :topicTab="article.tab" :topicTitle="article.title" :topicContent="article.content"
    v-if="eidtWindow" class="editTopic">
      <div slot="modifyBlockTitle">
        <span>文章编辑</span>
        <span @click="editController('cancelEdit')" class="cancelEdit">取消编辑</span>
      </div>
    </edit-topic>
  </div>
</template>

<script>
import vueMarkdown from 'vue-markdown'
import loading from '../../common/loading.vue'
import editTopic from './createTopic.vue'
import request from '../../../util/apiRequest.js'
import commonUtil from '../../../util/common.js'

export default {
  components: {
    'loading': loading,
    'edit-topic': editTopic,
    'vue-markdown': vueMarkdown
  },
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
      loading: true,
      subLoading: {
        collectLoading: false,
        commentLoading: false,
        likeLoading: false
      },
      displayArticleContent: false,
      eidtWindow: false,
      // 处理文章和评论中@用户对应的a标签跳转的字段
      currentUrlPrefix: ''
    }
  },
  methods: {
    // 给评论点赞与取消点赞
    likeController: function (replyIndex) {
      var replyId = this.article.replies[replyIndex].id
      if (!this.loginStatus) {
        alert('需要登录')
      } else if (this.$store.state.loginUsername === this.article.replies[replyIndex].author.loginname) {
        alert('呵呵，不能给自己点赞')
      } else {
        this.subLoading.likeLoading = true
        // 点赞&取消点赞请求
        request.commentLike(replyId, {
          accesstoken: sessionStorage['accesstoken']
        }, (res) => {
          if (res.data.action === 'up') {
            this.article.replies[replyIndex].is_uped = true
            this.article.replies[replyIndex].ups.length += 1
          } else {
            this.article.replies[replyIndex].is_uped = false
            this.article.replies[replyIndex].ups.length -= 1
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
      if (this.loginStatus) {
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
          // 提交评论，预处理提交内容中的链接
          this.commentContent = this.commentContent.replace('](www', '](https://www')
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
        commonUtil.exchangePageTitle(this.article.title, 'editArticle')
        // 隐藏文章主体，显示编辑组件
        this.displayArticleContent = false
        this.eidtWindow = true
      } else if (controlType === 'cancelEdit') {
        commonUtil.exchangePageTitle(this.article.title, 'article')
        this.displayArticleContent = true
        this.eidtWindow = false
      } else {
        console.log('未传入正确参数')
      }
    },
    // 打开登录弹窗
    openLoginWindow: function () {
      this.$store.commit('openLoginCard', true)
    },
    // 锚点定位
    anchorPosition: function (position) {
      if (position === 'comments') {
        // this.$refs.comments.scrollIntoView()
        commonUtil.smoothScroll(this.$refs.comments.offsetTop, this.$refs.article)
      } else if (position === 'top') {
        // this.$refs.article.scrollTop = 0
        commonUtil.smoothScroll(0, this.$refs.article)
      }
    }
  },
  computed: {
    loginStatus: function () {
      return this.$store.state.loginStatus
    }
  },
  watch: {
    loginStatus: function () {
      this.$parent.reload()
    }
  },
  created: function () {
    // 获取文章详情(包括文章和评论)
    var articleId = this.$route.path.split('/')[3]
    request.getTopicDetail(articleId, {
      mdrender: 'false',
      accesstoken: sessionStorage['accesstoken']
    }, (res) => {
      for (let i = 0; i < res.data.data.replies.length; i++) {
        res.data.data.replies[i].create_at = commonUtil.transformTimeInterval(res.data.data.replies[i].create_at)
      }
      this.article = res.data.data
      commonUtil.exchangePageTitle(this.article.title, 'article')
      this.loading = false
      this.displayArticleContent = true
      if (this.loginStatus) {
        if (res.data.data.is_collect) {
          this.collect = '取消收藏'
          this.collectBtnActive = true
        }
      } else {
        alert('当前尚未登录\n无法发表评论，无法获取文章收藏与点赞状态，也无法判断是否可编辑')
      }
    }, (err) => {
      console.log('文章获取失败了，错误信息是：' + err)
    })
    // 解析当前url，替换文章与评论中出现的@用户链接
    var tempUrlPart = window.location.href
    if (RegExp(/localhost:/).test(tempUrlPart)) {
      // 当域名是localhost:xxxx时,先取出端口号
      let port = tempUrlPart.split('/')[2].split(':')[1]
      this.currentUrlPrefix = 'http://localhost:' + port + '/#/'
    } else if (RegExp(/localhost\//).test(tempUrlPart)) {
      // 当域名是localhost时
      this.currentUrlPrefix = '#/'
    } else if (RegExp(/reviving-pain\.github/).test(tempUrlPart)) {
      // 当域名是https://reviving-pain.github.io时
      this.currentUrlPrefix = 'https://reviving-pain.github.io/dist/#/'
    } else if (RegExp(/reviving-pain\.gitee/).test(tempUrlPart)) {
      // 当前域名是https://reviving-pain.gitee.io时
      this.currentUrlPrefix = 'https://reviving-pain.gitee.io/cnodejs-community/#/'
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
  background: #f6f6f6;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  position: absolute;
  overflow-y: auto;
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
  padding-left: 0.5rem;
  border-left: .2rem solid #0099cc;
  margin-left: 0.5rem;
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
.sofa {
  height: 100px;
  width: 100px;
  display: block;
  margin: 0 auto;
  user-select: none;
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
/* 点赞样式 */
.like {
  border: none;
  background: none;
  font-size: 1.1rem;
  float: right;
  cursor: pointer;
  outline: none;
}
.likeActive {
  color: #c60023;
}
/* 设置按钮的disabled状态样式 */
.like[disabled] {
  color: #000;
}
.likeActive[disabled] {
  color: #c60023;
}

/* 文章编辑组件css样式 */
.editTopic {
  background: #f6f6f6 !important;
}
.editTopic .cancelEdit {
  margin: 3px 10px 0px 0px;
  float: right;
  font-size: 1rem;
  color: #000;
  font-weight: normal;
  cursor: pointer;
  user-select: none;
}
.editTopic .cancelEdit:hover {
  color: #c60023;
}

/* 锚点定位按钮 */
.anchorPosition {
  margin-top: -40px;
  position: fixed;
  top: 50%;
  right: 20px;
}
.anchorPosition span {
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  box-shadow: 0px 0px 10px #ccc;
  margin-top: 10px;
  background: #c60023;
  text-align: center;
  font-size: 1.5rem;
  color: #fff;
  display: block;
  user-select: none;
  cursor: pointer;
}
</style>
