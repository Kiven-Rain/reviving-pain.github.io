import Vue from 'vue'
import Router from 'vue-router'
import cnodeWrp from '../components/navSideContent/cnodeWrp.vue'
import cnodejsTopics from '../components/navSideContent/cnodeContent/cnodejsTopics.vue'
import user from '../components/navSideContent/cnodeContent/user.vue'
import article from '../components/navSideContent/cnodeContent/article.vue'
import createTopic from '../components/navSideContent/cnodeContent/createTopic.vue'
import cnodeProfile from '../components/navSideContent/cnodeContent/cnodeProfile.vue'
import messages from '../components/navSideContent/cnodeContent/messages.vue'
import mockWrp from '../components/navSideContent/mockWrp.vue'
import getMockdata from '../components/navSideContent/mockTestContent/getMockdata.vue'
import defaultContent from '../components/navSideContent/defaultContent.vue'
import notFoundComponent from '../components/navSideContent/notFoundComponent.vue'

Vue.use(Router)

export default new Router({
  // 打开此模式之后，由于没有服务端支持，打包的项目运行时刷新可能会出现404错误
  // mode: 'history',
  routes: [
    // (欢迎页)根路由配置
    {
      path: '/',
      components: {
        defaultContent: defaultContent
      }
    },
    // 除已配置路由之外的路由配置
    {
      path: '*',
      components: {
        notFoundComponent: notFoundComponent
      }
    },
    // CnodeJS社区路由配置
    {
      path: '/cnodeCommunity',
      components: {
        cnodeWrp: cnodeWrp
      },
      children: [{
        path: 'cnodejsTopics',
        components: {
          cnodejsTopics: cnodejsTopics
        }
      }, {
        path: 'cnodejsTopics/:id',
        name: 'ArticleRoute',
        components: {
          article: article
        }
      }, {
        path: 'user/:name',
        name: 'UserRoute',
        components: {
          user: user
        }
      }, {
        path: 'createTopic',
        components: {
          createTopic: createTopic
        }
      }, {
        path: 'profile',
        components: {
          cnodeProfile: cnodeProfile
        }
      }, {
        path: 'messages',
        components: {
          messages: messages
        }
      }]
    },
    // Mock数据测试子菜单路由配置
    {
      path: '/mockDataTest',
      components: {
        mockWrp: mockWrp
      },
      children: [{
        path: 'getMockdata',
        components: {
          getMockdata: getMockdata
        }
      }]
    }
  ]
})
