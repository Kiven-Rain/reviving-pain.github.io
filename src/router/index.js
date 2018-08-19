// 我是路由配置中心，页面显示不同的内容对应不同的url是由我来配置的
import Vue from 'vue'
import Router from 'vue-router'
import serverRequest from '../components/navSideContent/serverRequest.vue'
import user from '../components/navSideContent/user.vue'
import article from '../components/navSideContent/article.vue'
import waterfallFlow from '../components/navSideContent/waterfallFlow.vue'
import css3Animation from '../components/navSideContent/css3Animation.vue'
import defaultContent from '../components/navSideContent/defaultContent.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 这里做自定义path, 要与router-link里拼接出来的path一一对应
      path: '/',
      // 冒号的前面对应contentWrap里面的router-view里面的name
      // serverRequest是引入的serverRequest子组件
      // 如果二者名字相同的话，写一个就可以
      components: {
        defaultContent: defaultContent
      }
    },
    {
      path: '/getPublicApi/serverRequest',
      components: {
        serverRequest: serverRequest
      }
    },
    {
      path: '/getPublicApi/user',
      name: 'UserRoute',
      components: {
        user: user
      }
    },
    {
      path: '/getPublicApi/article',
      name: 'ArticleRoute',
      components: {
        article: article
      }
    },
    {
      path: '/getPublicApi/waterfallFlow',
      components: {
        waterfallFlow: waterfallFlow
      }
    },
    {
      path: '/animation/css3Animation',
      components: {
        css3Animation: css3Animation
      }
    }
  ]
})
