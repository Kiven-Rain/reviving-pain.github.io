<template>
  <div class="header" ref="navHead">
    <!-- 移动显示模式下侧边导航控制按钮 -->
    <span @click="mobilSidebarController" class="fa fa-th-list"></span>
    <!-- 头像相关内容 -->
    <div @click="hidemenu" v-show="showMenuMask" class="avataMenuMask"></div>
    <div @click="showMenu" class="userAvatar">
      <span v-if="!loginStatus" class="defalutAvatar fa fa-user-circle" title="点击登录"></span>
      <img v-if="loginStatus" :src="$store.state.loginAvatarUrl" :title="$store.state.loginUsername">
    </div>
    <div v-show="showAvatarMenu" class="avatarMenu">
      <div class="menuHead"></div>
      <div class="menuBody">
        <ul @click="avataMenuMethod">
          <li id="login" v-if="!loginStatus" class="fa fa-user"> 登 录</li>
          <li id="userCenter" v-if="loginStatus" class="fa fa-user-circle-o"> 个人中心</li>
          <li id="logout" v-if="loginStatus" class="fa fa-sign-out"> 退出登录</li>
        </ul>
      </div>
    </div>
    <!-- 消息提醒 -->
    <router-link :to="{path: '/cnodeCommunity/messages'}" class="messageTipsWrp" title="我的消息">
      <span v-if="hasMsg" class="tipsNum">{{msgNum}}</span>
      <span v-if="hasMsg" class="fa fa-envelope"></span>
      <span v-if="!loginStatus" class="fa fa-envelope"></span>
      <span v-if="!hasMsg & loginStatus" class="fa fa-envelope-open"></span>
    </router-link>
  </div>
</template>

<script>
import request from '../util/apiRequest.js'

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
    mobilSidebarController: function () {
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
      request.getUserMsgNum({
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
        // 当变为登录状态后先获取一次消息数量
        this.getUserMsgNum()
        // 当接收到来自于根组件的用户信息时，挂载定时请求方法,定时接收消息
        this.timer = setInterval(() => {
          // 每1分钟请求一次
          this.getUserMsgNum()
        }, 60000)
      } else {
        // 在失去登录状态时清除请求计时器，同时清除消息提示
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

/* 点击头像后展开的菜单栏的样式 */
.header .userAvatar {
  height: 40px;
  width: 40px;
  border: 2px solid #57cbde;
  border-radius: 6px;
  margin: 8px;
  float: right;
  background: #fff;
  cursor: pointer;
  user-select: none;
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
@media only screen and (min-width: 900px) {
  .header .avatarMenu {
    position: relative;
    display: inline-block;
    left: 20px;
    top: 52px;
    position: absolute;
  }
  .header .avatarMenu .menuHead {
    height: 0px;
    width: 0px;
    border-right: 10px solid rgba(0, 0, 0, 0);
    border-left: 10px solid rgba(0, 0, 0, 0);
    border-bottom: 8px solid #fff;
    position: relative;
    left: 18px;
    bottom: -1px;
  }
}
@media only screen and (max-width: 900px) {
  .header .avatarMenu {
    position: relative;
    display: inline-block;
    right: 5px;
    top: 52px;
    position: absolute;
  }
  .header .avatarMenu .menuHead {
    height: 0px;
    width: 0px;
    border-right: 10px solid rgba(0, 0, 0, 0);
    border-left: 10px solid rgba(0, 0, 0, 0);
    border-bottom: 8px solid #fff;
    position: relative;
    left: 117px;
    bottom: -2px;
  }
}
.header .avatarMenu .menuBody {
  width: 150px;
  border: 1px solid #999;
  box-shadow: 0px 0px 20px #333;
  border-radius: 10px;
  background: #fff;
}
.menuBody ul {
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.menuBody ul li {
  height: 30px;
  line-height: 30px;
  margin: 5px;
  font-size: 1.2rem;
  display: block;
  cursor: pointer;
  user-select: none;
}
.menuBody ul li:hover {
  background: #ccc;
  color: #fff;
}
.header .userAvatar > img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
.avataMenuMask {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
}

/* 移动端按钮样式 */
.header .fa.fa-th-list {
  margin: 10px;
  color: #fff;
  left: 0px;
  font-size: 40px;
  position: fixed;
  transform: rotate(-90deg);
}
@media only screen and (min-width: 900px) {
  .header .fa.fa-th-list {
    transition: all 0.5s ease;
    transform: rotate(-90deg);
    left: -60px;
  }
  .header .userAvatar {
    float: left;
    margin-left: 25px;
  }
}
@media only screen and (max-width: 900px) {
  .header .fa.fa-th-list {
    transition: all 0.5s ease;
    transform: rotate(0deg);
    left: 0px;
  }
}

/* 消息提醒提示区域样式 */
.messageTipsWrp {
  width: 40px;
  height: 40px;
  margin: 10px 20px 10px 10px;
  position: relative;
  float: right;
  cursor: pointer;
}
.messageTipsWrp .tipsNum {
  width: 18px;
  height: 16px;
  border-radius: 9px;
  padding-top: 2px;
  display: block;
  position: absolute;
  right: 0px;
  top: 2px;
  background: red;
  font-size: 0.9rem;
  color: #fff;
  user-select: none;
  z-index: 1;
}
.messageTipsWrp .fa {
  font-size: 1.5rem;
  color: #fff;
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
