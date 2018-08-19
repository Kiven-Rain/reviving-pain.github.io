<!-- 这是首页的内容，是个瀑布流！！！ -->
<template>
  <div class='serverRequestWrp'>
    <div v-for='item of content' :key='item.id'>
      <router-link :to='{name: "UserRoute", params:{name: item.author.loginname}}'>
        <img :src='item.author.avatar_url' :title='item.author.loginname' />
      </router-link>
      <div class='textDiv'>
        <router-link :to='{name:"ArticleRoute", params:{id:item.id}}'>{{item.title}}</router-link>
        <div class='stuff'>
          <span>回复：{{item.reply_count}}</span>
          <span>创建于：{{dealTime}}</span>
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
      item: {
        create_at: '2017-02-22T11:32:43.547Z'
      },
      limit: 0
    }
  },
  methods: {
    // 当滚动到底部时继续请求数据，这一部分写的有问题
    scrollMethod: function () {
      // const sumH = this.$refs.scrollHeight
      const sumH = document.body.scrollHeight || document.documentElement.scrollHeight
      // console.log(sumH)
      const viewH = document.documentElement.clientHeight
      // console.log(viewH)
      const scrollH = document.body.scrollTop || document.documentElement.scrollTop
      // console.log(scrollH)
      if (viewH + scrollH >= sumH) {
        this.getData()
      }
    },
    // 发送接口请求，获取返回数据
    getData: function () {
      this.limit += 10
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
  computed: {
    // 将获取到的create字段(帖子创建时间)直接做格式化处理
    dealTime: function () {
      return String(this.item.create_at).match(/.{10}/)[0]
    }
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
  width: auto;
  height: auto;
  border: 1px solid #ddd;
  background: #F9FAFC;
  display: flex;
  flex-direction: column;
  font-size: 22px;
  padding: 2rem;
  /* min-height: 40rem; */
}

a {
  text-decoration: none;
}

.serverRequestWrp>div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0.5rem 0;
  border-bottom: 2px solid #C0CCDA;
  padding-bottom: 1rem;
}

.serverRequestWrp>div img {
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
  margin-right: 2rem;
}
</style>
