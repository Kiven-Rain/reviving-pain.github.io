<template>
  <div class="header">
    <div @click="hidemenu" v-show="showMenuMask" class="avataMenuMask"></div>
    <span @click="mobilSidebarBtn" class="fa fa-th-list"></span>
    <!-- <a href="https://cn.vuejs.org/v2/guide/" target="_blank" title="VUE doc"><img class="vue-logo" src="../assets/logo.png"></a> -->
    <div @click="showMenu" class="userAvatar">
      <img v-if="!isLogin" src="../assets/default_avatar.png" title="点击登录">
      <img v-if="isLogin" :src="this.baseUserInfo.avatar_url" :title="this.baseUserInfo.loginname">
    </div>
    <div v-show="showAvatarMenu" class="avatarMenu">
      <div class="menuHead"></div>
      <div class="menuBody">
        <ul @click="avataMenuMethod">
          <li id="login" v-if="!isLogin" class="fa fa-user"> 登 录</li>
          <li id="userCenter" v-if="isLogin" class="fa fa-home"> 个人中心</li>
          <li id="logout" v-if="isLogin" class="fa fa-sign-out"> 退出登录</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../util/eventBus.js'

export default {
  data: function () {
    return {
      baseUserInfo: [],
      mobilSidebarOrder: true,
      showAvatarMenu: false,
      showMenuMask: false,
      isLogin: false
    }
  },
  methods: {
    mobilSidebarBtn: function () {
      bus.$emit('show-mobil-sidebar', this.mobilSidebarOrder)
      if (this.mobilSidebarOrder === true) {
        this.mobilSidebarOrder = false
      } else if (this.mobilSidebarOrder === false) {
        this.mobilSidebarOrder = true
      }
      // alert('现在移动侧边导航按钮命令已转变为：' + this.mobilSidebarOrder)
      bus.$emit('displayContentMask', !(this.mobilSidebarOrder))
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
          console.log('执行登录程序')
          bus.$emit('openLoginCard', true)
          break
        case 'userCenter':
          console.log('通过url跳转到个人中心')
          this.$router.push({path: '/cnodeCommunity/profile'})
          break
        case 'logout':
          var logout = confirm('确认要注销登录吗？')
          if (logout === true) {
            console.log('执行注销登陆')
            sessionStorage['accesstoken'] = ''
            sessionStorage['loginUsername'] = ''
            sessionStorage['loginId'] = ''
            location.reload()
            this.$router.push({path: '/cnodeCommunity/cnodejsTopic'})
          } else {
            console.log('注销登陆操作已取消')
          }
          break
      }
    }
  },
  created: function () {
    // 获取来自于content遮罩层传来的侧边栏按钮复位信息
    bus.$on('resetMobilsideBtn', (msg) => {
      this.mobilSidebarOrder = msg
    })
    // 获取从根组件传来的登录用户基本信息
    bus.$on('userBasicInfo', (userBasicInfo) => {
      this.baseUserInfo = userBasicInfo
      this.isLogin = this.baseUserInfo.success
    })
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
  border-radius: 5px;
  margin: 8px;
  float: right;
  background: #fff;
  cursor: pointer;
  user-select: none;
}
@media only screen and (min-width: 900px) {
  .header .avatarMenu {
    position: relative;
    z-index: 200;
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
    z-index: 200;
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
}
.avataMenuMask {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 160;

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
</style>
