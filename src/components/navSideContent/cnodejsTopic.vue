<template>
  <div class='serverRequestWrp' ref="myReference">
    <loading v-if="loading"></loading>
    <div class='serverRequestContent'>
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
// import {data} from '@/mock/mock.js'
// // 测试输出结果
// console.log(JSON.stringify(data, null, 2))
import loading from './loading.vue'
export default {
  components: {
    'loading': loading
  },
  name: 'MainSection',
  data: function () {
    return {
      content: [],
      // 初次请求的数据条目数量
      limit: 10,
      loading: false,
      loadingBlock: false
    }
  },
  methods: {
    // 当滚动到底部时继续请求数据，这一部分写的有问题
    scrollMethod: function () {
      var viewHeight = this.$refs.myReference.offsetHeight
      var scrollTop = this.$refs.myReference.scrollTop
      var scrollHeight = this.$refs.myReference.scrollHeight
      // console.log('【测量结果】' + '显示区域的高:' + viewHeight + ', ' + '网页被卷去的高:' + scrollTop + ', ' + '区域内所有元素的总高为:' + scrollHeight)
      if ((viewHeight + scrollTop >= scrollHeight) && (viewHeight !== 0)) {
        this.loadingBlock = true
        this.getData()
      }
    },
    // 发送接口请求，获取返回数据
    getData: function () {
      this.loading = true
      this.limit += 3
      this.$http({
        url: 'https://cnodejs.org/api/v1/topics',
        method: 'get',
        params: {
          page: 1,
          limit: this.limit,
          mdrender: 'false'
        }
      }).then((res) => {
        this.content = res.data.data
        this.loading = false
        this.loadingBlock = true
      }).catch((res) => {
        console.log('MaiSec.vue: ', res)
      })
    }
  },
  // 所有模板渲染完成并基本完成挂载时，添加一个scroll鼠标滚动事件的监听器
  mounted: function () {
    // console.log(this.refs)
    window.addEventListener('scroll', this.scrollMethod, true)
  },
  // created在实例创建完成后立即被调用
  // 当前已完成数据观测，属性和方法的运算，watch/event事件回调，但挂载阶段还没开始
  created: function () {
    // vue实例被创建之后，调用一次接口请求方法
    this.getData()
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
.serverRequestWrp {
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  position: absolute;
  overflow-y: auto;
}
.serverRequestContent {
  width: auto;
  height: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
}
.serverRequestContent>div {
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
.serverRequestContent .topicItem img {
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
</style>
