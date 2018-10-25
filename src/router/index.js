import Vue from 'vue'
import Router from 'vue-router'
import cnodejsTopics from '../components/navSideContent/cnodeContent/cnodejsTopics.vue'
import user from '../components/navSideContent/cnodeContent/user.vue'
import article from '../components/navSideContent/cnodeContent/article.vue'
import createTopic from '../components/navSideContent/cnodeContent/createTopic.vue'
import cnodeProfile from '../components/navSideContent/cnodeContent/cnodeProfile.vue'
import messages from '../components/navSideContent/cnodeContent/messages.vue'
import getMockdata from '../components/navSideContent/mockTestContent/getMockdata.vue'
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
      path: '/cnodeCommunity/cnodejsTopics',
      components: {
        cnodejsTopics: cnodejsTopics
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
      path: '/cnodeCommunity/cnodejsTopics/:id',
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
      path: '/cnodeCommunity/messages',
      components: {
        messages: messages
      }
    },
    {
      path: '/mockDataTest/getMockdata',
      components: {
        getMockdata: getMockdata
      }
    }
  ]
})
