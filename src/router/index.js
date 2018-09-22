// 我是路由配置中心，页面显示不同的内容对应不同的url是由我来配置的
import Vue from 'vue'
import Router from 'vue-router'
import cnodejsTopic from '../components/navSideContent/cnodejsTopic.vue'
import user from '../components/navSideContent/user.vue'
import article from '../components/navSideContent/article.vue'
import createTopic from '../components/navSideContent/createTopic.vue'
import cnodeProfile from '../components/navSideContent/cnodeProfile.vue'
import css3Animation from '../components/navSideContent/css3Animation.vue'
import defaultContent from '../components/navSideContent/defaultContent.vue'
import notFoundComponent from '../components/navSideContent/notFoundComponent.vue'

Vue.use(Router)

export default new Router({
  // 打开此模式之后，由于没有服务端支持，打包的项目运行时刷新可能会出现404错误
  // mode: 'history',
  routes: [
    {
      path: '/',
      components: {
        defaultContent: defaultContent
      }
    },
    {
      path: '*',
      components: {
        notFoundComponent: notFoundComponent
      }
    },
    {
      // 这里做自定义path, 要与router-link里拼接出来的path一一对应
      path: '/cnodeCommunity/cnodejsTopic',
      // 冒号的前面对应cnodejsTopic里面的router-view里面的name
      // 冒号后面的cnodejsTopic是引入的cnodejsTopic子组件
      // 如果二者名字相同的话，写一个就可以
      components: {
        cnodejsTopic: cnodejsTopic
      }
    },
    {
      path: '/cnodeCommunity/user/:name',
      name: 'UserRoute',
      components: {
        user: user
      }
    },
    {
      path: '/cnodeCommunity/cnodejsTopic/:id',
      name: 'ArticleRoute',
      components: {
        article: article
      }
    },
    {
      path: '/cnodeCommunity/createTopic',
      components: {
        createTopic: createTopic
      }
    },
    {
      path: '/cnodeCommunity/profile',
      components: {
        cnodeProfile: cnodeProfile
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
