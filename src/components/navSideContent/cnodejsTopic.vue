<template>
  <div class='cnodeTopicsWrp' ref="cnodeTopics">
    <loading v-if="loading"></loading>
    <div v-show="showTabbar" class="topicTabWrp">
      <div @click="selectTab" class="tabBar">
        <span v-for="(tab, index) in tabs" :key="index" :id="tab.type" :class="{'tabBarActive': tab.type === currentTab}">
          {{tab.name}}
        </span>
      </div>
    </div>
    <button class="backToTopBtn" v-show="backToTopBtn" @click="backToTop">回到顶部</button>
    <div class='cnodeTopicsContent'>
      <div v-for='item of content' :key='item.id' class="topicItem">
        <router-link v-bind:to='{name: "UserRoute", params:{name: item.author.loginname}}'>
          <img v-bind:src='item.author.avatar_url' v-bind:title='item.author.loginname' />
        </router-link>
        <div class='articleTextInfo'>
          <router-link v-bind:to='{name:"ArticleRoute", params:{id:item.id}}'>{{item.title}}</router-link>
          <div class='articleSubInfo'>
            <span>回复：{{item.reply_count}}</span>
            <span>创建于：{{String(item.create_at).slice(0, 10)}}</span>
            <span></span>
          </div>
        </div>
      </div>
      <div v-show="loadingBlock" class="loadingBlock">
        <img src="../../assets/loadingBlock.gif">
      </div>
    </div>
  </div>
</template>

<script>
import loading from './loading.vue'
import http from '../../assets/apiUtil.js'

var scrollPosition = sessionStorage['scrollPosition']

window.onbeforeunload = function () {}
export default {
  components: {
    'loading': loading
  },
  name: 'MainSection',
  data: function () {
    return {
      content: [],
      tabs: [
        { type: 'all', name: '全部' },
        { type: 'good', name: '精华' },
        { type: 'share', name: '分享' },
        { type: 'ask', name: '问答' },
        { type: 'job', name: '招聘' },
        { type: 'dev', name: '测试' }
      ],
      // tab可选的有 all, good, share, ask, job, dev
      currentTab: 'all',
      // 初次请求的数据条目数量
      limit: 10,
      loading: false,
      loadingBlock: false,
      backToTopBtn: false,
      showTabbar: true,
      scrollTopBefore: 0
    }
  },
  methods: {
    scrollMethod: function () {
      var viewHeight = this.$refs.cnodeTopics.offsetHeight
      var scrollTop = this.$refs.cnodeTopics.scrollTop
      var scrollHeight = this.$refs.cnodeTopics.scrollHeight
      // 使用sessionStorage对象存储 “滚动距离” 和 “请求文章简讯数量”
      sessionStorage['scrollPosition'] = this.$refs.cnodeTopics.scrollTop
      sessionStorage['refreshApplyCount'] = this.limit
      // console.log('【测量结果】' + '显示区域的高:' + viewHeight + ', ' + '网页被卷去的高:' + scrollTop + ', ' + '区域内所有元素的总高为:' + scrollHeight)
      // 判断向上或者向下的滚动事件
      if (this.scrollTopBefore < scrollTop) {
        this.showTabbar = true
      } else {
        if (scrollTop === 0) {
          this.showTabbar = true
        } else {
          this.showTabbar = false
        }
      }
      this.scrollTopBefore = scrollTop
      if ((viewHeight + scrollTop >= scrollHeight) && (viewHeight !== 0)) {
        this.loadingBlock = true
        this.getData()
      }
      if (scrollTop > 1000) {
        this.backToTopBtn = true
      } else {
        this.backToTopBtn = false
      }
    },
    // 发送接口请求，获取返回数据
    getData: function () {
      this.limit += 3
      // 开始请求cnode社区主页数据
      http.ajaxRequest('/topics', 'get', {
        page: 1,
        limit: this.limit,
        mdrender: 'false',
        tab: this.currentTab
      }, (res) => {
        this.content = res.data.data
        this.loading = false
        this.loadingBlock = false
      }, (err) => {
        console.log(err.response.data.success)
      })
    },
    // 将滚动条拉到顶部
    backToTop: function () {
      this.$refs.cnodeTopics.scrollTop = 0
    },
    // 点击cnode主页头部的浮动tab标签触发的事件
    selectTab: function (e) {
      if (this.currentTab !== e.target.id) {
        // 在请求之前做一些初始化工作
        // 如果要记忆上次滚动位置和请求数量的话每个选项卡需要单独的字段来存储,还有刷新时是否要记忆tab选中状态和请求状态
        this.$refs.cnodeTopics.scrollTop = 0
        this.loading = true
        this.limit = 10
        this.currentTab = e.target.id
        // 开始请求
        this.getData()
      } else {
        console.log('为什么要反复点呢？')
      }
    },
    // 页面刷新之后的浏览浏览位置定位
    scrollReadPosition: function () {
    }
  },
  // created在实例创建完成后立即被调用，当前已完成数据观测，属性和方法的运算，watch/event事件回调，但挂载阶段还没开始
  created: function () {
    // vue实例被创建之后，调用一次接口请求方法
    this.loading = true
    this.getData()
  },
  // 所有模板渲染完成并基本完成挂载时，添加一个scroll鼠标滚动事件的监听器
  mounted: function () {
    window.addEventListener('scroll', this.scrollMethod, true)
  },
  updated: function () {
    // 上次记录的scrollTop距离大于0, 当前的scrollTop为0
    if ((sessionStorage['scrollPosition'] > 0) && (this.$refs.cnodeTopics.scrollTop === 0)) {
      // console.log('刷新前最后的滚动距离大于0，值为：' + sessionStorage['scrollPosition'])
      this.scrollReadPosition()
    }
  },
  beforeRouteLeave: function (to, from, next) {
    // 切换路由时更新滚动条浏览位置的数据
    scrollPosition = this.$refs.cnodeTopics.scrollTop
    next()
  },
  beforeRouteEnter: function (to, from, next) {
    // 切换至其他路由又切回来时还原上次的浏览位置
    next(vm => {
      vm.$refs.cnodeTopics.scrollTop = scrollPosition
    })
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
.cnodeTopicsWrp {
  padding: 10px;
  background: #f6f6f6;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  position: absolute;
  overflow-y: auto;
}
/* tab选项卡样式 */
@media only screen and (min-width: 900px) {
  .topicTabWrp{
    max-width: 900px;
    height: 70px;
    padding: 10px;
    margin: 0 auto;
    position: fixed;
    transition: left 0.4s ease;
    top: 60px;
    left: 250px;
    right: 0px;
    box-sizing: border-box;
  }
}
@media only screen and (max-width: 900px) {
  .topicTabWrp{
    max-width: 900px;
    height: 70px;
    padding: 10px 18px 10px 10px;
    margin: 0 auto;
    position: fixed;
    transition: left 0.4s ease;
    top: 60px;
    left: 0px;
    right: 0px;
    box-sizing: border-box;
  }
}
.tabBar {
  border: 1px solid #bbb;
  margin: 0 auto;
  box-shadow: 0px 0px 10px #ccc;
  background: #fff;
  position: relative;
  overflow: hidden;
}
 .tabBar > span {
  width: 14.66%;
  height: 40px;
  line-height: 40px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 1%;
  margin-right: 1%;
  text-align: center;
  display: block;
  float: left;
  cursor: pointer;
  user-select: none;
 }
 .tabBar > span:hover {
  background: #c60023;
  color: #fff;
 }
 .tabBarActive {
  background: #c60023;
  color: #fff;
 }

/* cnode话题区样式 */
.cnodeTopicsContent {
  max-width: 800px;
  height: auto;
  margin: 0 auto;
  margin-top: 60px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px #ccc;
  background: #fff;
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
}
.cnodeTopicsContent>div {
  padding: 0.5rem;
  border-bottom: 1px solid #c4c4c4;
  display: flex;
  flex-direction: row;    /* flex-direction属性默认是row */
  align-items: center;    /* flex布局中，子元素中心线(水平or垂直)居中于父容器 */
}
.loadingBlock {
  width: 90%;
  height: 4rem;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
}
.loadingBlock img {
  width: 50%;
  margin: 0 auto;
}
.cnodeTopicsContent .topicItem img {
  width: 4rem;
  height: 4rem;
  margin-right: 2rem;
}
.articleTextInfo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
}
/* 帖子标题样式  */
.articleTextInfo a {
  color: #000;
  font-size: 1rem;
  font-weight: bold;
}
/* 帖子标题被点击之后的样式  */
.articleTextInfo a:visited {
  color: #999;
}

/* 帖子标题下方部分样式  */
.articleSubInfo {
  font-size: 0.7rem;
  margin-top: 1rem;
  color: #666;
}
.articleSubInfo span:first-child {
  margin-right: 1.5rem;
}

.backToTopBtn {
  width: 6rem;
  height: 3rem;
  border: 2px solid black;
  border-radius: 20px;
  background: #009966;
  position: fixed;
  right: 2rem;
  bottom: 4rem;
  outline: none;
  color: #fff;
  font-weight: bold;
  font-size: 1.2rem;
}
.backToTopBtn:hover {
  background: #c60023;
}
</style>
