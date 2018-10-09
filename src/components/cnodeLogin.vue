<template>
  <div class="loginWrp">
    <div @click="closeLoginCard" class="loginCardMask"></div>
    <div class="loginCard">
      <div @click="closeLoginCard" class="close">×</div>
      <div class="loginCardTitle">
        <div @click="loginTab" :class="['titleCell', {'titleCellActive': loginTabActive}]">登录</div>
        <b class="titlePoint">·</b>
        <div @click="registerTab" :class="['titleCell', {'titleCellActive': registerTabActive}]">注册</div>
      </div>
      <div class="loginCardBody">
        <div v-show="loginTabActive">
          请输入认证码<br>
          <input @keyup.enter="verifyIdentifyInfo" placeholder="cnode社区token" class="identityInfo" v-model.trim="accesstoken" type="password">
          <div @click="loginTips" class="loginTips">如何获取token？</div>
          <button :disabled="loading" @click="verifyIdentifyInfo" class="submitIdentifyInfo">
            <span v-if="!loading">检测认证信息</span>
            <span v-if="loading"><span class="fa fa-spinner fa-spin"></span> 正在登录，请稍候…</span>
          </button>
        </div>
        <div v-show="registerTabActive">
          <span>使用第三方CNode社区服务</span><br><br>
          <span>点击下方链接注册，需要github账号</span><br><br>
          <a href="https://cnodejs.org/" target="_blank">https://cnodejs.org/</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      loginTabActive: true,
      registerTabActive: false,
      accesstoken: '',
      loading: false
    }
  },
  methods: {
    loginTab: function () {
      this.registerTabActive = false
      this.loginTabActive = true
    },
    loginTips: function () {
      alert('1.搜索引擎搜索CNode社区\n2.使用自己的github账号登入该社区\n3.打开右上角设置\n4.在页面最下方找到自己的token')
    },
    registerTab: function () {
      this.loginTabActive = false
      this.registerTabActive = true
    },
    closeLoginCard: function () {
      this.$store.commit('openLoginCard', false)
    },
    verifyIdentifyInfo: function () {
      if (this.accesstoken === '') {
        alert('请先填入认证码')
      } else {
        this.loading = true
        // 存储token并验证
        sessionStorage['accesstoken'] = this.accesstoken
        this.$parent.verifyToken()
      }
    }
  },
  computed: {
    loginStatus: function () {
      return this.$store.state.loginStatus
    }
  },
  watch: {
    loginStatus: function () {
      if (this.loginStatus) {
        alert('认证成功，欢迎' + this.$store.state.loginUsername)
        this.loading = false
        this.$store.commit('openLoginCard', false)
      }
    }
  }
}
</script>

<style scoped>
.loginWrp {
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  position: absolute;
  z-index: 290;
  user-select: none;
}
.loginCardMask {
  width: 100%;
  height: 100%;
  background: #ccc;
  opacity: 0.5;
  position: absolute;
}
@media only screen and (max-width: 900px) {
  .loginCard {
  padding: 50px 30px 0px 30px;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  position: absolute;
  background: white;
  position: absolute;
  }
}
@media only screen and (min-width: 900px) {
  .loginCard {
  width: 300px;
  height: 400px;
  padding: 50px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px #333;
  margin-left: -200px;
  margin-top: -250px;
  left: 50%;
  top: 50%;
  position: absolute;
  background: #fff;
  }
}
.close {
  height: 4rem;
  width: 4rem;
  top: 0px;
  right: 0px;
  position: absolute;
  font-size: 4rem;
  color: #ddd;
  cursor: pointer;
}
.close:hover {
  color: #c60023;
}
.loginCardTitle {
  width: 200px;
  height: 50px;
  margin: 0 auto;
}
.titleCell {
  width: 80px;
  height: 45px;
  line-height: 45px;
  border-bottom: 5px solid #fff;
  float: left;
  font-size: 1.2rem;
  cursor: pointer;
}
.titleCell:hover {
  font-weight: bold;
  color: #c60023;

}
.titleCellActive {
  border-bottom:  5px solid #c60023;
  font-weight: bold;
  color: #c60023;
}
.titlePoint {
  width: 40px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  float: left;
}
.loginCardBody{
  margin-top: 30px;
}
.identityInfo {
  width: 100%;
  height: 30px;
  margin-top: 10px;
  border: 1px solid #999;
  border-radius: 3px;
  font-size: 1.2rem;
  text-align: center;
}
.loginTips {
  margin-top: 5px;
  float: left;
  cursor: pointer;
  color: #777;
}
.loginTips:hover {
  color: #000;
  text-decoration: underline;
}
.submitIdentifyInfo {
  width: 100%;
  height: 35px;
  margin-top: 10px;
  border: none;
  border-radius: 3px;
  background: #c60023;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
}
</style>
