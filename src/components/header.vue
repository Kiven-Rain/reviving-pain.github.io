<template>
  <div class="header" ref="navHead">
    <!-- 移动显示模式下侧边导航控制按钮 -->
    <span @click="mobileSidebarController" :class="['fa', 'fa-th-list', 'fa-th-list-response', {'navSide-appear': $store.state.showNavside}]"></span>
    <!-- 头像相关内容 -->
    <div @click="showMenu" class="userAvatar userAvatar-response">
      <span v-if="!loginStatus" class="defalutAvatar fa fa-user-circle" title="点击登录"></span>
      <img v-if="loginStatus" :src="$store.state.loginAvatarUrl" :title="$store.state.loginUsername">
    </div>
    <!-- 头像展开菜单 -->
    <div v-show="showAvatarMenu" class="avatarMenu avatarMenu-response">
      <div class="menuHead menuHead-response"></div>
      <div class="menuBody">
        <ul @click="avataMenuMethod">
          <li id="login" v-if="!loginStatus" class="fa fa-user"> 登 录</li>
          <li id="userCenter" v-if="loginStatus" class="fa fa-user-circle-o"> 个人中心</li>
          <li id="logout" v-if="loginStatus" class="fa fa-sign-out"> 退出登录</li>
        </ul>
      </div>
    </div>
    <!-- 头像展开菜单遮罩层 -->
    <div @click="hidemenu" v-show="showMenuMask" class="avataMenuMask"></div>
    <!-- CNode社区消息提醒 -->
    <div @click="loadMsgPage" class="messageTipsWrp" title="我的消息">
      <span v-if="hasMsg" class="tipsNum">{{msgNum}}</span>
      <span v-if="hasMsg" class="fa fa-envelope"></span>
      <span v-if="!loginStatus" class="fa fa-envelope"></span>
      <span v-if="!hasMsg & loginStatus" class="fa fa-envelope-open"></span>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      showAvatarMenu: false,
      showMenuMask: false,
      hasMsg: false,
      msgNum: 0
    }
  },
  methods: {
    mobileSidebarController: function () {
      this.$store.commit('navSideController', !(this.$store.state.showNavside))
    },
    showMenu: function () {
      this.showAvatarMenu = !this.showAvatarMenu
      this.showMenuMask = true
    },
    hidemenu: function () {
      this.showAvatarMenu = false
      this.showMenuMask = false
    },
    avataMenuMethod: function (e) {
      this.hidemenu()
      switch (e.target.id) {
        case 'login':
          console.log('打开登录窗口')
          this.$store.commit('openLoginCard', true)
          break
        case 'userCenter':
          console.log('前往个人中心')
          this.$router.push({path: '/cnodeCommunity/profile'})
          break
        case 'logout':
          var logout = confirm('确认要注销登录吗？')
          if (logout === true) {
            console.log('执行注销登陆')
            this.$store.commit('changeLoginStatus', {
              success: false
            })
            // 注销登录时如果有存储cookie则清除cookie
            if (this.$commonUtil.getCookie('accesstoken')) {
              this.$commonUtil.removeCookie('accesstoken')
            }
            sessionStorage['accesstoken'] = ''
            alert('您已注销登录')
          } else {
            console.log('注销登陆操作已取消')
          }
          break
      }
    },
    // 获取用户未读消息数量
    getUserMsgNum: function () {
      this.$apiRequest.getUserMsgNum({
        accesstoken: sessionStorage['accesstoken']
      }, (res) => {
        if (res.data.data > 9) {
          this.msgNum = '9+'
        } else {
          this.msgNum = res.data.data
        }
        if (this.msgNum) {
          this.hasMsg = true
        } else {
          this.hasMsg = false
        }
      }, (err) => {
        console.log(err)
      })
    },
    // 加载用户消息列表
    loadMsgPage: function () {
      if (this.$store.state.loginStatus) {
        this.$router.push({path: '/cnodeCommunity/messages'})
      } else {
        alert('您尚未登陆，请先登录')
        sessionStorage['lastOpenPath'] = '/cnodeCommunity/messages'
        this.$store.commit('openLoginCard', true)
      }
    }
  },
  computed: {
    // 获取登录状态
    loginStatus: function () {
      return this.$store.state.loginStatus
    }
  },
  watch: {
    loginStatus: function () {
      if (this.loginStatus) {
        // 当取得登录状态后先获取一次消息数量
        this.getUserMsgNum()
        // 挂载定时请求方法,定时接收消息
        this.timer = setInterval(() => {
          // 每1分钟请求一次
          this.getUserMsgNum()
        }, 60000)
      } else {
        // 当失去登录状态时清除请求计时器，同时清除消息提示
        clearInterval(this.timer)
        this.hasMsg = false
      }
    }
  },
  beforeDestroy: function () {
    // 在实例销毁之前清除请求计时器
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.header {
  height: 100%;
  width: 100%;
  background: #2a303c;
}

/* header头像的样式 */
.header .userAvatar {
  height: 40px;
  width: 40px;
  border: 2px solid #57cbde;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  user-select: none;
}
.header .userAvatar img {
  width: 100%;
  height: 100%;
  font-size: 0.8rem;
  word-break: break-all;
  border-radius: 4px;
}
.header .userAvatar .defalutAvatar {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  background: #272636;
  color: #fff;
  font-size: 2.2rem;
}

/* 头像(点击)菜单样式 */
.header .avatarMenu {
  display: inline-block;
  position: absolute;
  top: 52px;
  z-index: 1;
}
.header .avatarMenu .menuHead {
  height: 0px;
  width: 0px;
  border-right: 10px solid rgba(0, 0, 0, 0);
  border-left: 10px solid rgba(0, 0, 0, 0);
  border-bottom: 8px solid #fff;
  position: relative;
}
.header .avatarMenu .menuBody {
  width: 150px;
  border: 1px solid #999;
  box-shadow: 0px 0px 20px #333;
  border-radius: 10px;
  background: #fff;
}
.header .avatarMenu .menuBody ul {
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.header .avatarMenu .menuBody ul li {
  height: 30px;
  line-height: 30px;
  margin: 5px;
  font-size: 1.2rem;
  display: block;
  cursor: pointer;
  user-select: none;
}
.header .avatarMenu .menuBody ul li:hover {
  border-radius: 6px;
  background: #ccc;
  color: #fff;
}

/* 头像(点击)菜单遮罩层样式 */
.header .avataMenuMask {
  background: rgba(204, 204, 204, 0.1);
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 0;
}

/* 侧边栏控制按钮样式 */
.header .fa.fa-th-list {
  margin: 10px 10px 10px 13px;
  color: #fff;
  font-size: 40px;
  position: fixed;
  transition: all 0.5s ease;
}
.header .fa.fa.fa-th-list.navSide-appear {
  transform: rotate(180deg);
}

/* 消息提醒提示区域样式 */
.header .messageTipsWrp {
  width: 40px;
  height: 40px;
  margin: 10px 20px 10px 10px;
  position: relative;
  float: right;
  cursor: pointer;
}
.header .messageTipsWrp .tipsNum {
  width: 18px;
  height: 16px;
  border-radius: 9px;
  padding-top: 2px;
  background: red;
  font-size: 0.9rem;
  color: #fff;
  position: absolute;
  right: 0px;
  top: 2px;
  user-select: none;
  z-index: 1;
}
.header .messageTipsWrp .fa {
  font-size: 1.5rem;
  color: #fff;
  position: absolute;
  right: 10px;
  top: 10px;
}

/* 响应式样式 */
@media only screen and (min-width: 900px) {
  /* 侧边栏控制按钮响应式样式 */
  .header .fa.fa-th-list.fa-th-list-response {
    transform: rotate(-90deg);
    left: -60px;
  }
  .header .userAvatar.userAvatar-response {
    margin: 8px 8px 8px 25px;
    float: left;
  }
  /* 头像(点击)菜单响应式样式 */
  .header .avatarMenu.avatarMenu-response {
    left: 20px;
  }
  .header .avatarMenu .menuHead.menuHead-response {
    left: 18px;
    bottom: -1px;
  }
}
@media only screen and (max-width: 900px) {
  /* 侧边栏控制按钮响应式样式 */
  .header .fa.fa-th-list.fa-th-list-response {
    transform: rotate(0deg);
    left: 0px;
  }
  .header .userAvatar.userAvatar-response {
    margin: 8px;
    float: right;
  }
  /* 头像(点击)菜单响应式样式 */
  .header .avatarMenu.avatarMenu-response {
    right: 5px;
  }
  .header .avatarMenu .menuHead.menuHead-response {
    left: 117px;
    bottom: -2px;
  }
}
</style>
