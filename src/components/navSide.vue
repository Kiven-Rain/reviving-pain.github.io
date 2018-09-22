<template>
  <div v-bind:class="['nav-side-wrp', {'nav-side-pc': pcSidebar, 'show-mobil-sidebar': mobilSidebarOrder, 'hide-mobil-sidebar': pcSidebar}]">
    <!-- 一级菜单选项 -->
    <transition-group name="tabs" class="tabs" tag="ul">
      <li @click="selectTabItem(index+1, tab)" v-for="(tab, index) in tabs" v-bind:key="index" class="tabs-item">
        {{tab.menu}}<i v-if="tab.subTabs" v-bind:class="['fa', 'fa-chevron-right', {'chevron-right-rotate': index+1 === selectedTabNum}]"></i>
        <!-- 二级菜单选项 -->
        <ul v-if="tab.subTabs" v-show="index+1 === selectedTabNum" class="subTabs">
          <router-link @click.native.stop="selectSubtabItem(tab, subTab)"
          v-for="(subTab, subIndex) in tab.subTabs" v-bind:key="subIndex" tag="li" class="subTabs-item"
          :to="{path: tab.path + subTab.path}">
            {{subTab.subMenu}}
          </router-link>
        </ul>
      </li>
    </transition-group>
    <a class="github" href='https://github.com/Reviving-Pain/reviving-pain.github.io' target="_blank">Github</a>
  </div>
</template>

<script>
import bus from '../assets/eventBus.js'
import {navSidebarData} from '../assets/navSidebarData.js'
export default {
  data: function () {
    return {
      // 控制侧边导航移动显示模式下的css样式
      mobilSidebarOrder: false,
      // 控制@media监控的侧边栏css样式
      pcSidebar: true,
      // 接收来自于header的移动端侧边导航按钮的指令
      navHeadBtnMsg: null,
      // 记录当前选中的侧边栏一级菜单的序号
      selectedTabNum: 0,
      // 侧边导航菜单的数据
      tabs: navSidebarData,
      // 页面标题数据
      selectedSubTabName: 'vue-reviving'
    }
  },
  methods: {
    // 选中一级菜单时触发的事件
    selectTabItem: function (tabNum, tab) {
      if ((this.selectedTabNum !== tabNum) && (tab.subTabs)) {
        this.selectedTabNum = tabNum
      } else if ((this.selectedTabNum === tabNum) && (tab.subTabs)) {
        this.selectedTabNum = 0
      } else {
        this.$router.push({path: tab.path})
        this.selectedTabNum = tabNum
      }
      // 处理无二级菜单的一级菜单选中时，修改对应的页面标题
      if (!tab.subTabs) {
        document.title = tab.menu
      }
    },
    // 选中二级菜单时触发的事件，同时防止二级菜单的点击事件冒泡
    selectSubtabItem: function (tab, subtab) {
      // 选中二级菜单更改页面标题
      this.selectedSubTabName = subtab.subMenu
      document.title = subtab.subMenu
    },
    // 当组件第一次or重新加载的时候，或者当前路由发生变化的时候，回填侧边栏展开样式，更改页面标题
    urlVerify: function (self) {
      var tabUrl = ''
      var currentPath = ''
      // '$route'的变化调用此方法默认传入参数不是vue对象，mounted调用此方法传入的是提前缓存的vue对象
      if (self.path) {
        currentPath = self.path
      } else {
        currentPath = self.$route.path
      }
      tabUrl = '/' + currentPath.split('/')[1]
      for (var i = 0; i < navSidebarData.length; i++) {
        if (navSidebarData[i].path === tabUrl) {
          if (self.selectedTabNum === 0) { // 通过url直接访问或者刷新页面，菜单展开样式的回填
            self.selectedTabNum = i + 1
            // 刷新页面时更改标题
            if (self.tabs[i].path.substr(1) === currentPath.split('/').pop()) { // 如果选中的是无下拉菜单的一级选项卡
              document.title = self.tabs[i].menu
            } else { // 如果选中的是有下拉菜单的二级选项卡
              for (var j = 0; j < self.tabs[i].subTabs.length; j++) {
                if (self.tabs[i].subTabs[j].path.substr(1) === currentPath.split('/').pop()) {
                  document.title = self.tabs[i].subTabs[j].subMenu
                }
              }
            }
          } else { // 使用浏览器前进后退按钮，检测到router的变化，执行菜单展开样式的回填
            this.selectedTabNum = i + 1
          }
        }
      }
    }
  },
  mounted: function () {
    var self = this
    // 接收来自于顶部的侧边栏呼出按钮的命令
    bus.$on('show-mobil-sidebar', function (msg) {
      self.navHeadBtnMsg = msg
    })
    // 复位header里菜单栏控制按钮的呼出命令
    bus.$on('hide-mobil-sidebar', function (msg) {
      self.navHeadBtnMsg = !msg
      bus.$emit('resetMobilsideBtn', msg)
    })
    self.$options.methods.urlVerify(self)
  },
  watch: {
    // 当从header传过来的侧边栏显示命令改变时，更改侧边导航的整体css样式
    navHeadBtnMsg: function () {
      this.mobilSidebarOrder = this.navHeadBtnMsg
      this.pcSidebar = !(this.navHeadBtnMsg)
    },
    // 监听路由的变化，执行自定义方法
    '$route': 'urlVerify'
  }
}
</script>

<style scoped>
/*侧边导航的基础样式*/
.nav-side-wrp {
  width: 259px;
  top: 0px;
  bottom: 0px;
  border-right: 1px solid #e6e6e6;
  background: #f9f9f9;
  position: absolute;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 3px 0px 10px #e6e6e6;
}
/*侧边导航的移动端模式样式*/
.show-mobil-sidebar {
  transition: all 0.4s ease;
  transform: translateX(0px);
  z-index: 10;
  box-shadow: 3px 0px 10px #e6e6e6;
}
.hide-mobil-sidebar {
  transition: all 0.4s ease;
  transform: translateX(-260px);
  z-index: 10;
}
/*响应式侧边导航，自适应浏览器宽度*/
@media only screen and (max-width: 900px) {
  .nav-side-pc {
    transition: all 0.4s ease;
    transform: translateX(-260px);
  }
}
@media only screen and (min-width: 900px) {
  .nav-side-pc {
    transition: all 0.4s ease;
    transform: translateX(0px);
  }
}

/*响应菜单中的v-show与v-if，为此添加默认的过渡动画*/
.tabs-move {
  transition: all 0.2s ease;
}
/*一级菜单样式*/
.tabs {
  padding: 0px;
  margin: 0px;
  list-style: none;
  text-align: left;
}
.tabs .tabs-item {
  width: 229px;
  height: auto;
  line-height: 50px;
  border-bottom: 1px solid #e6e6e6;
  padding-left: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #a8a8a8;
  cursor: pointer;
  user-select: none;
}
.tabs .tabs-item .fa {
  line-height: 50px;
  padding-right: 5px;
  float: right;
}
.chevron-right-rotate {
  transition: all 0.4s ease;
  transform: rotate(90deg);
  transform-origin: 25% 50%;
}
.tabs .tabs-item:hover {
  color: #555;
}
/*二级菜单样式*/
.tabs .tabs-item .subTabs {
  height: auto;
  width: 200px;
  padding: 0px 0px 10px 0px;
  list-style: none;
}
.tabs .tabs-item .subTabs .subTabs-item {
  height: 30px;
  line-height: 30px;
  padding-left: 15px;
  font-size: 17px;
  font-weight: normal;
}
.tabs .tabs-item .subTabs .subTabs-item:hover {
  background-color: #ddd;
  color: #fff;
}
.router-link-active {
  background-color: #bbb;
  color: #fff;
}
/* 侧边栏底部github链接 */
.github {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 10px;
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
  color: #ccc;
}
</style>
