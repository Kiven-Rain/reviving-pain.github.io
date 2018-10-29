<template>
  <div ref="article" class="nsc-commonWrp">
    <!-- 文章详情页主体 -->
    <div v-show="displayArticleContent" class="nsc-commonBody">
      <!-- 文章头部板块 -->
      <div class="nsc-commonBlockWrp">
        <h2 class="block-center" >{{article.title}}</h2>
        <div class="articleHeadBody">
          <!-- 文章头部板块作者头像 -->
          <router-link :to='{name: "UserRoute", params: {name: article.author.loginname}}'>
            <img class="articleAuthorAvatar" :src='article.author.avatar_url' :title="article.author.loginname">
          </router-link><br v-show="true">
          <!-- 文章头部板块基本信息 -->
          <div class="articleBaseInfo font-green">
            <i class="fa fa-user fa-fw"></i>
            <span>{{newLoginname}}</span><br>
            <i class="fa fa-clock-o fa-fw"></i>
            <span>{{(article.create_at).slice(0, 10)}}</span><br>
            <i class="fa fa-tags fa-fw"></i>
            <span>{{articleTag}}</span><br>
            <i class="fa fa-eye fa-fw"></i>
            <span>{{article.visit_count}}</span><br>
            <i class="fa fa-commenting fa-fw"></i>
            <span>{{article.reply_count}}</span>
          </div>
          <!-- 文章头部板块按钮控制面板 -->
          <div class="articleControlPanel">
            <!-- 收藏按钮 -->
            <button :disabled="subLoading.collectLoading" @click="collectController()" :class="['mid-submit-btn', 'bgc-green', 'float-r', {'bgc-lGray': collectBtnActive}]" :title="collect">
              <span v-if="!subLoading.collectLoading">{{collect}}</span>
              <span v-if="subLoading.collectLoading" class="fa fa-spinner fa-spin"></span>
            </button>
            <!-- 编辑按钮 -->
            <button @click="editController('edit')" v-if="article.author.loginname === $store.state.loginUsername" class="mid-submit-btn float-r bgc-lGray" title="点击编辑">
              <span class="fa fa-edit"></span>
            </button>
          </div>
        </div>
      </div>
      <!-- 文章详情页文章内容板块 -->
      <vue-markdown class="nsc-commonBlockWrp md-content" :source="article.content"></vue-markdown>
      <!-- 文章详情页评论板块 -->
      <div ref="comments" class="nsc-commonBlockWrp">
        <!-- 新建评论区域 -->
        <div class="publishCommnetWrp">
          <div v-if="!loginStatus" class="unLogin">
            <span class="tip-text">发表评论需先</span>
            <div @click="$store.commit('openLoginCard', true)" class="mid-submit-btn-ato bgc-green float-r" title="点此登录">登录</div>
          </div>
          <div v-if="loginStatus">
            <textarea @keyup.enter="publishComment" class="commentArea" placeholder="写下你的评论…(支持markdown语法，请不要在非测试话题里发表测试评论，后果自负)" v-model.trim="commentContent"></textarea>
            <span v-if="!$store.state.isMobile" class="tip-text">Ctrl+Enter 发表</span>
            <button :disabled="subLoading.commentLoading" @click="publishComment" class="mid-submit-btn bgc-wineRed float-r" title="点此发送">
              <span v-if="!subLoading.commentLoading">发表评论</span>
              <span v-if="subLoading.commentLoading">发送中…</span>
            </button>
          </div>
        </div>
        <!-- 评论展示区域 -->
        <h2>{{article.reply_count}} 条评论</h2>
        <div class="nsc-commonBlockBody">
          <!-- 无评论时的填充内容 -->
          <span v-if="!article.replies.length">
            <img class="sofa" src="../../../assets/img/sofa.svg" alt="抢沙发" title="抢沙发">
          </span>
          <!-- 有评论时的内容 -->
          <div v-if="article.replies.length" v-for='(comment, index) in article.replies' :key='index' class="commentCell">
            <div>
              <router-link :to='{name: "UserRoute", params: {name: comment.author.loginname}}' class="flex-box-row float-l">
                <img :src='comment.author.avatar_url' :title="comment.author.loginname" class="commentAvatar">
                <span class="commentUsername">{{comment.author.loginname}}</span>
                <span v-if="article.author.loginname === comment.author.loginname" class="mark-tag bgc-green">作者</span>
              </router-link>
            </div>
            <vue-markdown :emoji="true" :source="comment.content.replace('(/user/', '(' + currentUrlPrefix + 'cnodeCommunity/user/')" class="md-content commentContent"></vue-markdown>
            <div>
              <span class="tip-text float-l">{{comment.create_at}}</span>
              <button :disabled="subLoading.likeLoading" @click="likeController(index)" :class="['tip-text', 'float-r', 'fa', 'like', {'likeActive': comment.is_uped, 'fa-thumbs-o-up': !comment.is_uped, 'fa-thumbs-up': comment.is_uped}]">
                {{comment.ups.length}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 文章编辑组件 -->
    <edit-topic :topicTag="article.tab" :topicTitle="article.title" :topicContent="article.content"
    v-if="eidtWindow">
      <div slot="modifyBlockTitle">
        <h2>话题编辑</h2>
        <span @click="editController('cancelEdit')" class="mid-submit-btn bgc-white cancelEdit">取消编辑</span>
      </div>
    </edit-topic>
    <!-- 锚点定位快速跳转按钮 -->
    <div v-show="!eidtWindow" class="anchorBtnWrp">
      <span @click="anchorPosition('top')" class="fa fa-arrow-circle-up circle-btn bgc-wineRed" title="回到顶部"></span>
      <span @click="anchorPosition('comments')" class="fa fa-commenting circle-btn bgc-wineRed" title="查看评论"></span>
    </div>
    <!-- 页面加载loading -->
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import {topicTags} from '../../../data/topicClassify.js'
import vueMarkdown from 'vue-markdown'
import loading from '../../common/loading.vue'
import editTopic from './createTopic.vue'

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
      articleTag: '',
      collect: '收藏',
      collectBtnActive: false,
      commentContent: '',
      newCommentContent: '',
      newLoginname: '',
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
        this.$apiRequest.commentLike(replyId, {
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
          this.$apiRequest.deCollectTopic({
            accesstoken: sessionStorage['accesstoken'],
            topic_id: articleId
          }, (res) => {
            this.subLoading.collectLoading = false
            console.log(res.data)
            this.collect = '收藏'
            this.collectBtnActive = false
          }, (err) => {
            this.$commonUtil.netErrorTips(err)
            this.subLoading.collectLoading = false
          })
        } else {
          this.subLoading.collectLoading = true
          // 文章添加收藏
          this.$apiRequest.collectTopic({
            accesstoken: sessionStorage['accesstoken'],
            topic_id: articleId
          }, (res) => {
            this.subLoading.collectLoading = false
            console.log(res.data)
            this.collect = '取消收藏'
            this.collectBtnActive = true
          }, (err) => {
            this.$commonUtil.netErrorTips(err)
            this.subLoading.collectLoading = false
          })
        }
      } else {
        alert('要添加收藏请先登录')
        this.$store.commit('openLoginCard', true)
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
          // 给评论末尾添加推广链接
          this.newCommentContent = this.commentContent.concat('\n\n来自 [Vue版CNode客户端](https://reviving-pain.github.io/dist/#/cnodeCommunity/cnodejsTopics)')
          var topicId = this.$route.path.split('/').pop()
          this.$apiRequest.createComment(topicId, {
            accesstoken: sessionStorage['accesstoken'],
            content: this.newCommentContent
          }, (res) => {
            this.subLoading.commentLoading = false
            alert('评论发布成功')
            console.log(res.data)
            // 调用父组件contentWrp的reload方法
            this.$parent.reload()
          }, (err) => {
            this.$commonUtil.netErrorTips(err)
            this.subLoading.commentLoading = false
          })
        }
      }
    },
    // 打开or关闭文章编辑组件
    editController: function (controlType) {
      if (controlType === 'edit') {
        console.log('准备打开编辑组件')
        this.$commonUtil.exchangePageTitle(this.article.title, 'editArticle')
        // 隐藏文章主体，显示编辑组件
        this.displayArticleContent = false
        this.eidtWindow = true
      } else if (controlType === 'cancelEdit') {
        this.$commonUtil.exchangePageTitle(this.article.title, 'article')
        this.displayArticleContent = true
        this.eidtWindow = false
      } else {
        console.log('未传入正确参数')
      }
    },
    // 锚点定位
    anchorPosition: function (position) {
      if (position === 'comments') {
        this.$commonUtil.smoothScroll(this.$refs.comments.offsetTop, this.$refs.article)
      } else if (position === 'top') {
        if (this.$refs.article.scrollTop === 0) {
          alert('已经到顶部了哦')
        } else {
          this.$commonUtil.smoothScroll(0, this.$refs.article)
        }
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
      // 登录状态变化时刷新文章组件
      this.$parent.reload()
    }
  },
  created: function () {
    // 获取文章详情(包括文章和评论)
    var articleId = this.$route.path.split('/')[3]
    this.$apiRequest.getTopicDetail(articleId, {
      mdrender: 'false',
      accesstoken: sessionStorage['accesstoken']
    }, (res) => {
      this.article = res.data.data
      // 转换文章tab字段为汉字
      for (let i = 0; i < topicTags.length; i++) {
        if (topicTags[i].value === this.article.tab) {
          this.articleTag = topicTags[i].name
          break
        }
      }
      // 移动端显示时切除过长的用户名
      if (this.$store.state.isMobile) {
        this.newLoginname = this.$commonUtil.cutString(this.article.author.loginname, 10)
      } else {
        this.newLoginname = this.article.author.loginname
      }
      // 转换评论的时间显示模式
      for (let i = 0; i < this.article.replies.length; i++) {
        this.article.replies[i].create_at = this.$commonUtil.transformTimeInterval(this.article.replies[i].create_at)
      }
      // 更改页面标题
      this.$commonUtil.exchangePageTitle(this.article.title, 'article')
      this.loading = false
      this.displayArticleContent = true
      if (this.loginStatus) {
        if (res.data.data.is_collect) {
          this.collect = '取消收藏'
          this.collectBtnActive = true
        }
      } else {
        console.log('当前不在登录状态，无法发表评论，无法获取文章收藏与点赞状态，也无法判断是否可编辑')
      }
    }, (err) => {
      this.$commonUtil.netErrorTips(err)
      this.$router.push({path: '/cnodeCommunity/cnodejsTopics'})
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
/* 文章头部板块布局样式 */
.nsc-commonBlockWrp .articleHeadBody {
  padding: 5px;
  border: 1px solid #eee;
  box-shadow: 0px 0px 7px #ccc;
  border-radius: 8px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  position: relative;
}
/* 文章头部板块作者头像样式 */
.nsc-commonBlockWrp .articleHeadBody .articleAuthorAvatar {
  border-radius: 5px;
  box-shadow: 0px 0px 10px #999;
  display: inline-block;
}
/* 文章头部板块基本信息样式 */
.nsc-commonBlockWrp .articleHeadBody .articleBaseInfo {
  padding-left: 3px;
  border-left: 1px solid forestgreen;
  margin-left: 7px;
  display: inline-block;
}
/* 文章头部板块按钮控制面板样式 */
.nsc-commonBlockWrp .articleHeadBody .articleControlPanel {
  height: 80px;
  padding: 10px 0px 10px 0px;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  top: 0px;
  right: 0px;
}
.nsc-commonBlockWrp .articleHeadBody .articleControlPanel button:nth-child(2) {
  font-size: 1.3rem;
  color: #666;
}

/* 评论板块编辑区样式 */
.nsc-commonBlockWrp .publishCommnetWrp {
  width: 100%;
  overflow: hidden;
}
.nsc-commonBlockWrp .publishCommnetWrp .commentArea {
  width: 100%;
  height: 100px;
  border-radius: 3px;
  box-shadow: 0px 0px 10px #999;
  box-sizing: border-box;
  margin-bottom: 5px;
  resize: none;
  font-size: 1.1rem;
  font-family: '微软雅黑';
  outline: none;
}
.nsc-commonBlockWrp .publishCommnetWrp .unLogin {
  width: 150px;
  height: 60px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 评论板块评论展示区样式 */
.nsc-commonBlockWrp .nsc-commonBlockBody .commentCell {
  padding-bottom: 5px;
  margin: 20px 0px 20px 0px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
}
.nsc-commonBlockWrp .nsc-commonBlockBody .commentCell .commentAvatar {
  display: block;
  width: 3rem;
  height: 3rem;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #999;
  font-size: 0.8rem;
}
.nsc-commonBlockWrp .nsc-commonBlockBody .commentCell .commentUsername {
  height: 1rem;
  line-height: 1rem;
  padding: 0px 4px 0px 10px;
  display: inline-block;
  color: #3399cc;
  font-size: 1.2rem;
}
.nsc-commonBlockWrp .nsc-commonBlockBody .commentCell .commentContent {
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #eee;
  box-sizing: border-box;
  margin: 10px 0px 5px 0px;
  background: #fafafa;
}
.nsc-commonBlockWrp .nsc-commonBlockBody .commentCell .like {
  border: none;
  background: none;
  font-size: 1.1rem;
  color: #333;
  cursor: pointer;
  outline: none;
}
.nsc-commonBlockWrp .nsc-commonBlockBody .commentCell .likeActive {
  color: #c60023;
}
.nsc-commonBlockWrp .nsc-commonBlockBody .sofa {
  height: 100px;
  width: 100px;
  display: block;
  margin: 0 auto;
  user-select: none;
}

/* 文章编辑组件的"取消编辑按钮"css(校准)样式 */
.cancelEdit {
  position: relative;
  top: -35px;
  float: right;
}

/* 文章锚点定位控制板 */
.anchorBtnWrp {
  height: 90px;
  margin-top: -45px;
  position: fixed;
  top: 50%;
  right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 响应式样式 */
@media only screen and (min-width: 900px) {
  /* 文章标题响应式样式 */
  .nsc-commonBlockWrp h2 {
    font-size: 1.4rem;
  }
  /* 作者Avatar响应式样式 */
  .nsc-commonBlockWrp .articleHeadBody .articleAuthorAvatar {
    width: 5.5rem;
    height: 5.5rem;
  }
}
@media only screen and (max-width: 900px) {
  /* 文章标题响应式样式 */
  .nsc-commonBlockWrp h2 {
    font-size: 1.2rem;
  }
  /* 作者Avatar响应式样式 */
  .nsc-commonBlockWrp .articleHeadBody .articleAuthorAvatar {
    width: 3.5rem;
    height: 3.5rem;
  }
}
</style>
