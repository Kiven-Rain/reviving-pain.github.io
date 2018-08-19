<template>
  <div v-bind:class="['nav-side-wrp', {'nav-side-pc': pcSidebar, 'show-mobil-sidebar': mobilSidebarOrder, 'hide-mobil-sidebar': pcSidebar}]">
    <!-- 一级菜单选项 -->
    <transition-group name="tabs" class="tabs" tag="ul">
      <li @click="selectTabItem(index+1, tab)" v-for="(tab, index) in tabs" v-bind:key="index" class="tabs-item">
        {{tab.menu}}<i v-if="tab.subTabs" v-bind:class="['fa', 'fa-chevron-right', {'chevron-right-rotate': index+1 === selectedTabNum}]"></i>
        <!-- 二级菜单选项 -->
        <ul v-if="tab.subTabs" v-show="index+1 === selectedTabNum" class="subTabs">
          <router-link @click.native.stop="selectSubtabItem()"
          v-for="(subTab, subIndex) in tab.subTabs" v-bind:key="subIndex" tag="li" class="subTabs-item"
          :to="{path: tab.path + subTab.path}">
            {{subTab.subMenu}}
          </router-link>
        </ul>
      </li>
    </transition-group>
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
      tabs: navSidebarData
    }
  },
  methods: {
    selectTabItem: function (tabNum, tab) {
      if ((this.selectedTabNum !== tabNum) && (tab.subTabs)) {
        this.selectedTabNum = tabNum
      } else if ((this.selectedTabNum === tabNum) && (tab.subTabs)) {
        this.selectedTabNum = 0
      } else {
        this.$router.push({path: tab.path})
        this.selectedTabNum = tabNum
      }
      // console.log(this)
    },
    // 防止二级菜单的点击事件冒泡
    selectSubtabItem: function () {
    },
    // 当刷新或通过url直接访问的时候，以及，当浏览器前进后退浏览器rul发生变化的时候，检测url并决定展开哪个一级菜单
    urlVerify: function (self) {
      // 由于'$route'改变后触发方法是有默认形参传入的，这个默认形参是一个包含'当前路由发生变化的部分'的对象，这个对象里没有selectedTabNum这个数据字段，所以可以使用self.selectedTabNum值判定避开第一个判定选项的操作，null是不等于0的。
      // 然而页面刷新或者通过url直接访问的时候，通过mounted去呼唤urlVerify()方法，如果不将this缓存并传过来，直接在urlVerify里使用this是拿不到vue对象实例的，这里的this指的是当前方法所处的宿主对象，即……methods对象！！！，所以这里只能用在mounted()里定义的真实的vue实例对象，即self
      // console.log('观察this对象和self对象的变化', this, self)
      var url = window.location.href
      var browserTabUrl = '/' + url.split('/').slice(url.split('/').indexOf('#') + 1, url.split('/').indexOf('#') + 2)
      // alert(url.split('/').slice(url.split('/').indexOf('vue-reviving')+1, url.split('/').indexOf('vue-reviving')+2))
      for (var i = 0; i < navSidebarData.length; i++) {
        if (navSidebarData[i].path === browserTabUrl) {
          if (self.selectedTabNum === 0) {
            // 通过url直接访问或者刷新页面，菜单展开样式的回填
            self.selectedTabNum = i + 1
          } else {
            // 使用浏览器前进后退按钮，检测到router的变化，执行菜单展开样式的回填
            this.selectedTabNum = i + 1
            // alert(self.selectedTabNum)
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
    // 处理点击contentWrap区域隐藏侧边栏后，顶部的侧边栏呼出按钮需要点两次才可以才可以再次打开侧边栏的问题，需要对顶部的侧边栏呼出按钮的呼出命令进行复位
    // 不复位的话点完左侧区域再点顶部侧边栏呼出按钮是无效的，因为它此时发出的命令是false(关闭侧边栏)，而用户需要发出的命令是true(呼出侧边栏)
    bus.$on('hide-mobil-sidebar', function (msg) {
      self.navHeadBtnMsg = !msg
      bus.$emit('resetMobilsideBtn', msg)
    })
    self.$options.methods.urlVerify(self)
    // console.log(this)
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
}
.tabs .tabs-item .subTabs .subTabs-item:hover {
  background-color: #ddd;
  color: #fff;
}
.router-link-active {
  background-color: #bbb;
  color: #fff;
}
</style>
