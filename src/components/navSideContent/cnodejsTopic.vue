<template>
  <div class='serverRequestWrp' ref="myReference">
    <div class='serverRequestContent'>
      <div v-for='item of content' :key='item.id'>
        <router-link :to='{name: "UserRoute", params:{name: item.author.loginname}}'>
          <img :src='item.author.avatar_url' :title='item.author.loginname' />
        </router-link>
        <div class='textDiv'>
          <router-link :to='{name:"ArticleRoute", params:{id:item.id}}'>{{item.title}}</router-link>
          <div class='stuff'>
            <span>回复：{{item.reply_count}}</span>
            <span>创建于：{{String(item.create_at).slice(0, 10)}}</span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import {data} from '@/mock/mock.js'
// // 测试输出结果
// console.log(JSON.stringify(data, null, 2))
export default {
  name: 'MainSection',
  data: function () {
    return {
      content: [],
      // 初次请求的数据条目数量
      limit: 15
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
        this.getData()
      }
    },
    // 发送接口请求，获取返回数据
    getData: function () {
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
.serverRequestWrp {
  overflow-y: auto;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  position: absolute;
}
.serverRequestContent {
  width: auto;
  height: auto;
  background: #F9FAFC;
  display: flex;
  flex-direction: column;
  font-size: 22px;
}

a {
  text-decoration: none;
}

.serverRequestContent>div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0.5rem 0;
  border-bottom: 2px solid #c60023;
  padding: 0px 15px 15px 15px;
}

.serverRequestContent>div img {
  width: 4rem;
  height: 4rem;
  margin-right: 2rem;
}

.textDiv {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
}

.textDiv a {
  color: black;
  font-size: 0.7em;
  font-weight: bold;
}

.textDiv a:visited {
  color: grey;
}

.stuff {
  font-size: 10px;
  margin-top: 1rem;
  color: #8492A6;
}

.stuff span:first-child {
  margin-right: 20px;
}
</style>
