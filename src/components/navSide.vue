<template>
  <div :class="['nav-side-wrp', 'nav-side-response', {'nav-side-control': this.$store.state.showNavside}]">
    <!-- 一级菜单选项 -->
    <transition-group class="tabs" tag="ul">
      <li @click="selectTabItem(index, tab)" class="tabs-item"
      v-for="(tab, index) in tabs" :key="index">
        {{tab.menu}}
        <span v-if="tab.subTabs" :class="['fa', 'fa-chevron-right', {'chevron-right-rotate': index+1 === selectedTabNum}]"></span>
        <!-- 二级菜单选项 -->
        <ul v-if="tab.subTabs" :class="['subTabs', {'subTabsOpen': index+1 === selectedTabNum}]">
          <li @click.stop="selectSubtabItem(tab.path, subTab.path)" :class="['subTabs-item', {'subTab-active': subTab.path === selectedSubTabPath}]"
          v-for="(subTab, subIndex) in tab.subTabs" :key="subIndex">
            <span :class="['fa', subTab.iconMark, ' fa-fw']">&nbsp;</span>
            {{subTab.subMenu}}
          </li>
        </ul>
      </li>
    </transition-group>
  </div>
</template>

<script>
import {navSidebarData} from '../data/navSidebarData.js'

export default {
  data: function () {
    return {
      // 记录当前选中的侧边栏一级菜单的序号
      selectedTabNum: 0,
      // 记录当前选中的侧边栏二级菜单的路由
      selectedSubTabPath: '',
      // 侧边导航菜单的数据
      tabs: navSidebarData,
      // 点击二级菜单选项时设为true，让路由变化遵循手动操作
      isClick: false,
      shouldLoginComponents: [
        'createTopic',
        'profile'
      ]
    }
  },
  methods: {
    // 选中一级菜单时触发的事件
    selectTabItem: function (tabIndex, tab) {
      let tabNum = tabIndex + 1
      if ((this.selectedTabNum !== tabNum) && (tab.subTabs)) {
        this.selectedTabNum = tabNum
      } else if ((this.selectedTabNum === tabNum) && (tab.subTabs)) {
        this.selectedTabNum = 0
      } else {
        this.$router.push({path: tab.path})
        this.selectedTabNum = tabNum
        this.selectedSubTabPath = ''
      }
    },
    // 选中二级菜单时(阻止事件冒泡导致导致的一级菜单收起问题)
    selectSubtabItem: function (tabPath, subTabPath) {
      this.isClick = true
      let shouldLogin = this.shouldLoginComponents.indexOf(subTabPath.slice(1)) + 1
      if (this.loginStatus) {
        this.$router.push({path: tabPath + subTabPath})
        this.activeSubTab()
      } else {
        if (shouldLogin) {
          sessionStorage['lastOpenPath'] = tabPath + subTabPath
          this.$store.commit('openLoginCard', true)
          // 先提示需要登录，然后记录当前点的菜单，如果用用户登录了，则转回来
          alert('您尚未登陆，请先登录')
        } else {
          this.$router.push({path: tabPath + subTabPath})
          this.activeSubTab()
        }
      }
    },
    // 选择性展开一级菜单并做二级菜单选中样式的回填
    openTabMenu: function () {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].path === this.currentTabPath) {
          this.selectTabItem(i, this.tabs[i])
          break
        }
      }
    },
    // 回填二级菜单选中样式
    activeSubTab: function () {
      if (this.$route.path.split('/')[2]) {
        this.selectedSubTabPath = '/' + this.$route.path.split('/')[2]
      }
    }
  },
  computed: {
    // 计算当前一级菜单路径
    currentTabPath: function () {
      return '/' + this.$route.path.split('/')[1]
    },
    loginStatus: function () {
      return this.$store.state.loginStatus
    }
  },
  watch: {
    // 监听一级菜单路径变化，选择性展开一级菜单
    currentTabPath: function () {
      if (this.isClick) {
        this.isClick = false
      } else {
        if (this.currentTabPath === '/') {
          this.selectedTabNum = 0
        } else {
          this.openTabMenu()
        }
      }
    }
  },
  mounted: function () {
    // 选择性展开一级菜单
    this.openTabMenu()
    // 回填二级菜单选中样式
    this.activeSubTab()
  }
}
</script>

<style scoped>
/*侧边导航的基础样式*/
.nav-side-wrp {
  width: 259px;
  border-right: 1px solid #e6e6e6;
  box-shadow: 3px 0px 10px #e6e6e6;
  background: #f9f9f9;
  position: absolute;
  top: 0px;
  bottom: 0px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 150;
  transition: all 0.5s ease;
}

/* 侧边导航调控样式 */
.nav-side-wrp.nav-side-response.nav-side-control {
  transform: translateX(0px);
}

/*一级菜单样式*/
.tabs {
  padding: 0px;
  margin: 0px;
  list-style: square;
  text-align: left;
}
.tabs .tabs-item {
  width: 229px;
  line-height: 50px;
  border-bottom: 1px solid #e6e6e6;
  padding-left: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #a8a8a8;
  cursor: pointer;
  user-select: none;
}
.tabs .tabs-item .fa.fa-chevron-right {
  line-height: 50px;
  padding-right: 5px;
  float: right;
  transition: all 0.4s ease;
}
.chevron-right-rotate {
  transform: rotate(90deg);
  transform-origin: 25% 50%;
}

/*二级菜单样式*/
.tabs .tabs-item .subTabs {
  width: 200px;
  max-height: 0px;
  padding: 0px;
  list-style: none;
  overflow: hidden;
  transition: all 0.5s ease;
}
.tabs .tabs-item .subTabs.subTabsOpen {
  max-height: 100px;
  margin-bottom: 10px;
}
.tabs .tabs-item .subTabs .subTabs-item {
  height: 30px;
  width: 93%;
  line-height: 30px;
  padding-left: 15px;
  font-size: 18px;
  font-weight: normal;
  float: left;
}

/* 二级菜单选项激活后的样式 */
.subTab-active {
  background-color: #bbb;
  color: #fff;
}

/* 响应式样式 */
@media only screen and (max-width: 900px) {
  /* 侧边导航响应式样式 */
  .nav-side-wrp.nav-side-response {
    transform: translateX(-260px);
  }
}
@media only screen and (min-width: 900px) {
  /* 侧边导航响应式样式 */
  .nav-side-wrp.nav-side-response {
    transform: translateX(0px);
  }
  /* 一级菜单hover样式 */
  .nav-side-wrp .tabs .tabs-item:hover {
    color: #555;
  }
  /* 二级菜单hover样式 */
  .nav-side-wrp .tabs .tabs-item .subTabs .subTabs-item:hover {
    background-color: #ddd;
    color: #fff;
  }
}
</style>
