<template>
  <div>
    <loading class="loading" v-if="loading"></loading>
    <div class='cnodeTopicsWrp' ref="cnodeTopics">
      <!-- cnode主页文章分类导航 -->
      <div v-show="showTabbar" class="topicTabWrp">
        <div class="tabBar">
          <button :disabled="!isTabBarActive" @click="selectTab" v-for="(tab, index) in tabs" :key="index" :id="tab.type" :class="{'tabBarActive': tab.type === currentTab}">
            {{tab.name}}
          </button>
        </div>
      </div>
      <!-- 返回顶部按钮 -->
      <button class="backToTopBtn" v-show="backToTopBtn" @click="backToTop">回到顶部</button>
      <!-- cnode主页文章列表 -->
      <div class='cnodeTopicsContent'>
        <div v-for='item of content' :key='item.id' class="topicItem">
          <router-link v-bind:to='{name: "UserRoute", params: {name: item.author.loginname}}'>
            <img v-bind:src='item.author.avatar_url' v-bind:title='item.author.loginname' />
          </router-link>
          <div class='articleTextInfo'>
            <router-link v-bind:to='{name:"ArticleRoute", params:{id:item.id}}'>
              <div v-if="item.top" class="topTag">置顶</div>
              {{item.title}}
            </router-link>
            <div class='articleSubInfo'>
              <span>回复：{{item.reply_count}}</span>
              <!-- <span>创建于：{{String(item.create_at).slice(0, 10)}}</span> -->
              <span>创建于：{{item.create_at}}</span>
            </div>
          </div>
        </div>
        <div v-show="loadingBlock" class="loadingBlock">
          <img src="../../../assets/loadingBlock.gif">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from '../../common/loading.vue'
import request from '../../../util/apiRequest.js'
import commonUtil from '../../../util/common.js'

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
      limit: 12,
      loading: false,
      loadingBlock: false,
      backToTopBtn: false,
      showTabbar: true,
      scrollTopBefore: 0,
      // 阻止连续快速切换tabbar选项卡操作
      isTabBarActive: true
    }
  },
  methods: {
    scrollMethod: function () {
      var viewHeight = this.$refs.cnodeTopics.offsetHeight
      var scrollTop = this.$refs.cnodeTopics.scrollTop
      var scrollHeight = this.$refs.cnodeTopics.scrollHeight
      sessionStorage['scrollPosition'] = this.$refs.cnodeTopics.scrollTop
      // console.log('【测量结果】' + '显示区域的高:' + viewHeight + ', ' + '网页被卷去的高:' + scrollTop + ', ' + '区域内所有元素的总高为:' + scrollHeight)
      // 判断向上或者向下的滚动事件
      if (this.scrollTopBefore < scrollTop) {
        // 向下滚动时
        this.showTabbar = true
      } else {
        // 向上滚动时
        if (scrollTop < 100) {
          // 快接近顶部时显示(如果判断scrollTop=0则出现的很突兀，体验不好)
          this.showTabbar = true
        } else {
          this.showTabbar = false
        }
      }
      // 瀑布流底部请求
      this.scrollTopBefore = scrollTop
      if ((viewHeight + scrollTop >= scrollHeight) && (viewHeight !== 0)) {
        // 半透明loading出现时阻止瀑布流loading加载
        if (!this.loading) {
          this.loadingBlock = true
        }
        this.getData(this.currentTab)
      }
      // 向下滚动距离大于1000显示回到顶部按钮
      if (scrollTop > 500) {
        this.backToTopBtn = true
      } else {
        this.backToTopBtn = false
      }
    },
    // 发送接口请求，获取返回数据
    getData: function (currentTab) {
      this.limit += 3
      // 开始请求cnode社区主页数据
      request.getCnodeTopics({
        page: 1,
        limit: this.limit,
        tab: currentTab
      }, (res) => {
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].create_at = commonUtil.transformTimeInterval(res.data.data[i].create_at)
        }
        this.content = res.data.data
        this.loading = false
        this.loadingBlock = false
        this.isTabBarActive = true
      }, (err) => {
        console.log(err.response.data.success)
      })
    },
    // 将滚动条拉到顶部
    backToTop: function () {
      commonUtil.smoothScroll(0, this.$refs.cnodeTopics)
      // this.$refs.cnodeTopics.scrollTop = 0
    },
    // 点击cnode主页头部的浮动tab标签触发的事件
    selectTab: function (e) {
      if (this.currentTab !== e.target.id) {
        // 在请求之前做一些初始化工作，初始化limit防止反复点击叠加
        // 如果要记忆上次滚动位置和请求数量的话每个选项卡需要单独的字段来存储,还有刷新时是否要记忆tab选中状态和请求状态
        this.$refs.cnodeTopics.scrollTop = 0
        this.loading = true
        this.limit = 12
        this.currentTab = e.target.id
        // 存储目标标签的id，用于刷新回填
        sessionStorage['currentTab'] = this.currentTab
        this.isTabBarActive = false
        // 开始请求
        this.getData(this.currentTab)
      } else {
        console.log('为什么要反复点呢？')
      }
    }
  },
  // created在实例创建完成后立即被调用，当前已完成数据观测，属性和方法的运算，watch/event事件回调，但挂载阶段还没开始
  created: function () {
    // vue实例被创建之后，调用一次接口请求方法
    this.loading = true
    // 初次或重新加载的时候回填上次选择的
    if (!sessionStorage['currentTab']) {
      sessionStorage['currentTab'] = this.currentTab
    } else {
      this.currentTab = sessionStorage['currentTab']
    }
    this.getData(this.currentTab)
  },
  // 所有模板渲染完成并基本完成挂载时，添加一个scroll鼠标滚动事件的监听器
  mounted: function () {
    window.addEventListener('scroll', this.scrollMethod, true)
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
.loading {
  background: rgba(255, 255, 255, 0.5);
  z-index: 99!important;
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
    z-index: 110;
  }
  .tabBar > button:hover {
    background: #c60023;
    color: #fff;
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
    z-index: 110;
  }
}
.tabBar {
  width: 100%;
  border: 1px solid #bbb;
  margin: 0 auto;
  box-shadow: 0px 0px 10px #ccc;
  background: #fff;
  display: block;
  position: relative;
  overflow: hidden;
}
 .tabBar > button {
  width: 14.66%;
  height: 40px;
  line-height: 40px;
  border: none;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 1%;
  margin-right: 1%;
  background: #fff;
  text-align: center;
  display: block;
  float: left;
  cursor: pointer;
  user-select: none;
  outline: none;
 }
 .tabBarActive {
  background: #c60023!important;
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
  border-radius: 5px;
  box-shadow: 0px 0px 10px #ccc;
  margin-right: 2rem;
}
.articleTextInfo {
  display: flex;
  flex-direction: column;
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
.topTag {
  height: 1.0rem;
  line-height: 1.1rem;
  width: 35px;
  border-radius: 3px;
  margin-right: 5px;
  background: #c60023;
  font-size: .7rem;
  color: #fff;
  text-align: center;
  float: left;
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
/* 回到顶部按钮的样式 */
.backToTopBtn {
  width: 2rem;
  height: 6rem;
  border: 2px solid black;
  border-radius: 5px;
  background: rgba(85, 85, 85, 0.5);
  position: fixed;
  right: 2rem;
  top: 50%;
  bottom: 12rem;
  outline: none;
  color: #fff;
  font-size: 1rem;
}
.backToTopBtn:hover {
  background: #c60023;
}
</style>
