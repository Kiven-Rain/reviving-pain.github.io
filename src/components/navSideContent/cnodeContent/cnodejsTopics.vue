<template>
  <div class='nsc-commonWrp' ref="cnodeTopics">
    <!-- cnode主页文章分类导航 -->
    <div v-show="showTabbar" class="topicTabWrp topicTabWrp-response">
      <div class="tabBar">
        <button :disabled="!isTabBarActive" @click="selectTab" :class="{'tabBarBtnActive': tab.type === currentTab}"
        v-for="(tab, index) in topicTabs" :key="index" :id="tab.type">
          {{tab.name}}
        </button>
      </div>
    </div>
    <!-- 整体文章列表 -->
    <div class='nsc-commonBody cnodeTopicsBody'>
      <!-- 文章条目 -->
      <div v-for='item of content' :key='item.id' class="topicItem a-link-b">
        <router-link :to='{name: "UserRoute", params: {name: item.author.loginname}}' tag='div' class="authorAvatarWrp">
          <img :src='item.author.avatar_url' :title='item.author.loginname'/>
        </router-link>
        <div class='topicItemTextInfo'>
          <router-link :to='{name:"ArticleRoute", params:{id:item.id}}'>
            <div v-if="item.top" class="mark-tag bgc-wineRed">置顶</div>
            {{item.title}}
          </router-link>
          <div class='articleSubInfo'>
            <span>回复：{{item.reply_count}}</span>
            <span>创建于：{{item.create_at}}</span>
          </div>
        </div>
      </div>
      <!-- 瀑布流loading -->
      <div v-show="loadingBlock" class="loadingBlock">
        <span class="fa fa-spinner fa-pulse"></span>
      </div>
    </div>
    <!-- 返回顶部按钮 -->
    <button v-show="backToTopBtn" @click="backToTop" class="backToTopBtn">回到顶部</button>
    <!-- 切换tab选项卡时的loading -->
    <loading v-if="loading" class="loading loadingResponse"></loading>
  </div>
</template>

<script>
import {topicTabs} from '../../../data/topicClassify.js'
import loading from '../../common/loading.vue'

export default {
  components: {
    'loading': loading
  },
  name: 'MainSection',
  data: function () {
    return {
      content: [],
      topicTabs: topicTabs,
      // 页面初次加载时默认的展示分类
      currentTab: topicTabs[0].type,
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
      var totalHeight = this.$refs.cnodeTopics.scrollHeight
      // 判断向上或者向下的滚动事件
      if (this.scrollTopBefore < scrollTop) {
        // 向下滚动时
        this.showTabbar = true
      } else {
        // 向上滚动时
        if (scrollTop < 150) {
          // 快接近顶部时显示(如果判断scrollTop=0则出现的很突兀，体验不好)
          this.showTabbar = true
        } else {
          this.showTabbar = false
        }
      }
      this.scrollTopBefore = scrollTop
      // 向下滚动距离大于500显示回到顶部按钮
      if (scrollTop > 500) {
        this.backToTopBtn = true
      } else {
        this.backToTopBtn = false
      }
      // 瀑布流底部请求,路由跳转之后高度会变为0,滚动事件依然触发,不参与此判定
      if ((viewHeight + scrollTop >= totalHeight) && (viewHeight !== 0)) {
        // 半透明loading出现时阻止瀑布流loadingBlock加载
        if (!this.loading) {
          this.loadingBlock = true
        }
        this.getData(this.currentTab)
      }
    },
    // 发送接口请求，获取返回数据
    getData: function (currentTab, type) {
      this.limit += 3
      // 开始请求cnode社区主页数据
      this.$apiRequest.getCnodeTopics({
        page: 1,
        limit: this.limit,
        tab: currentTab
      }, (res) => {
        // 日期转换
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].create_at = this.$commonUtil.transformTimeInterval(res.data.data[i].create_at)
        }
        // 如果是切换tab选项卡操作则将页面拉到顶部
        if (type === 'switch') {
          this.$refs.cnodeTopics.scrollTop = 0
        }
        this.content = res.data.data
        this.loading = false
        this.loadingBlock = false
        // 请求成功后，稍等0.5秒释放按钮disabled(预防出现刚请求完成时点击过快而内容不切换的问题)
        setTimeout(() => {
          this.isTabBarActive = true
        }, 500)
      }, (err) => {
        console.log(err.response.data.success)
      })
    },
    // 将滚动条拉到顶部
    backToTop: function () {
      this.$commonUtil.smoothScroll(0, this.$refs.cnodeTopics)
    },
    // 点击cnode主页头部的浮动tab标签触发的事件
    selectTab: function (e) {
      if (this.currentTab !== e.target.id) {
        // 在请求之前做一些初始化工作，初始化limit防止反复点击叠加
        this.loading = true
        this.limit = 12
        this.currentTab = e.target.id
        // 存储目标标签的id，用于刷新回填
        sessionStorage['currentTab'] = this.currentTab
        this.isTabBarActive = false
        // 开始请求
        this.getData(this.currentTab, 'switch')
      } else {
        console.log('为什么要反复点呢？')
      }
    }
  },
  created: function () {
    this.loading = true
    // 初次或重新加载的时候回填上次选择的tab分类标签
    if (!sessionStorage['currentTab']) {
      sessionStorage['currentTab'] = this.currentTab
    } else {
      this.currentTab = sessionStorage['currentTab']
    }
    this.getData(this.currentTab)
  },
  mounted: function () {
    // loadingBlock出现的时候停用监控(第三个参数设置为false[冒泡时执行]时,监听停止)
    window.addEventListener('scroll', this.scrollMethod, !this.loadingBlock)
  },
  beforeRouteLeave: function (to, from, next) {
    // 切换路由时更新滚动条浏览位置的数据
    sessionStorage['scrollPosition'] = this.$refs.cnodeTopics.scrollTop
    next()
  },
  beforeRouteEnter: function (to, from, next) {
    // 切换至其他路由又切回来时还原上次的浏览位置(beforeRoutEnter无法直接拿到this)
    next(vm => {
      vm.$commonUtil.exchangePageTitle('CNodeJS社区主页')
      vm.$refs.cnodeTopics.scrollTop = sessionStorage['scrollPosition']
    })
  }
}
</script>

<style scoped>
/* 顶部tab选项卡样式 */
.nsc-commonWrp .topicTabWrp {
  max-width: 900px;
  height: 70px;
  padding: 10px;
  box-sizing: border-box;
  margin: 0 auto;
  position: fixed;
  top: 60px;
  z-index: 110;
  transition: left 0.4s ease;
}
.nsc-commonWrp .topicTabWrp .tabBar {
  width: 100%;
  border: 1px solid #bbb;
  margin: 0 auto;
  box-shadow: 0px 0px 10px #ccc;
  background: #fff;
  display: block;
  position: relative;
  overflow: hidden;
}
 .nsc-commonWrp .topicTabWrp .tabBar button {
  width: 14.66%;
  height: 40px;
  line-height: 40px;
  border: none;
  margin: 5px 1% 5px 1%;
  background: #fff;
  text-align: center;
  display: block;
  float: left;
  cursor: pointer;
  user-select: none;
  outline: none;
 }
 .nsc-commonWrp .topicTabWrp .tabBar button.tabBarBtnActive {
  background: #c60023!important;
  color: #fff;
 }

/* CNode社区文章条目展示区样式 */
.nsc-commonWrp .cnodeTopicsBody {
  margin-top: 60px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px #ccc;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.nsc-commonWrp .cnodeTopicsBody .topicItem {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.nsc-commonWrp .cnodeTopicsBody .topicItem .authorAvatarWrp {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px #ccc;
  margin-right: 18px;
  cursor: pointer;
  font-size: 0.8rem;
  flex: 0 0 auto;
}
.nsc-commonWrp .cnodeTopicsBody .topicItem .authorAvatarWrp img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.nsc-commonWrp .cnodeTopicsBody .topicItem .topicItemTextInfo {
  font-size: 1rem;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}
.nsc-commonWrp .cnodeTopicsBody .topicItem .topicItemTextInfo .articleSubInfo {
  font-size: 0.7rem;
  margin-top: 1rem;
  color: #666;
}
.nsc-commonWrp .cnodeTopicsBody .topicItem .topicItemTextInfo .articleSubInfo span:first-child {
  width: 80px;
  display: inline-block;
}

/* 回到顶部按钮的样式 */
.nsc-commonWrp .backToTopBtn {
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
  cursor: pointer;
}

/* 瀑布流加载的loading样式 */
.nsc-commonWrp .loadingBlock {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.nsc-commonWrp .loadingBlock span {
  width: 100%;
  text-align: center;
  font-size: 3rem;
}

/* 切换tab选项卡时的loading样式 */
.nsc-commonWrp .loading {
  position: fixed!important;
  top: 60px!important;
  bottom: 50px!important;
  z-index: 99!important;
}

/* 响应式样式 */
@media only screen and (min-width: 900px) {
  /* 顶部tabWrp响应式样式 */
  .nsc-commonWrp .topicTabWrp.topicTabWrp-response{
    right: 18px;
    left: 260px;
  }
  /* 顶部tab选项按钮激活样式 */
  .nsc-commonWrp .topicTabWrp .tabBar button:hover {
    background: #c60023;
    color: #fff;
  }
  /* 回到顶部按钮的hover样式 */
  .nsc-commonWrp .backToTopBtn:hover {
    background: #c60023;
  }
  /* 切换Tab时阻止滚动的loading响应式样式 */
  .nsc-commonWrp .loading.loadingResponse {
    left: 260px!important;
  }
}
@media only screen and (max-width: 900px) {
  /* 顶部tabWrp响应式样式 */
  .nsc-commonWrp .topicTabWrp.topicTabWrp-response{
    right: 0px;
    left: 0px;
  }
  /* 切换Tab时阻止滚动的loading响应式样式 */
  .nsc-commonWrp .loading.loadingResponse {
    left: 0px!important;
  }
}
</style>
