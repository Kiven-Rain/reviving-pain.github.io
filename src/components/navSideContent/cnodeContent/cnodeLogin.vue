<template>
  <div class="loginWrp">
    <!-- 登录面板 -->
    <div class="loginCard loginCard-response">
      <!-- 登录面板关闭按钮 -->
      <div @click="closeLoginCard" class="close">×</div>
      <!-- 登录面板头部选项卡 -->
      <div class="loginCardTitle">
        <div @click="loginTab" :class="['titleCell', {'titleCellActive': loginTabActive}]">登录</div>
        <b class="titlePoint">·</b>
        <div @click="registerTab" :class="['titleCell', {'titleCellActive': registerTabActive}]">注册</div>
      </div>
      <!-- 登录面板头部选项卡对应的内容区 -->
      <div class="loginCardBody">
        <!-- 登录内容区 -->
        <div v-show="loginTabActive">
          请输入认证码<br>
          <input @keyup.enter="verifyIdentifyInfo" placeholder="cnode社区token" class="identityInfo" v-model.trim="accesstoken" type="password">
          <div @click="loginTips" class="loginTips">如何获取token？</div>
          <div class="rememberToken">
            <input type="checkbox" id="rememberToken" v-model="storeToekn">
            <label for="rememberToken">十天免登陆</label>
          </div>
          <!-- 登录提交按钮 -->
          <button :disabled="loading" @click="verifyIdentifyInfo" class="submitIdentifyInfo">
            <span v-if="!loading">检测认证信息</span>
            <span v-if="loading"><span class="fa fa-spinner fa-spin"></span> 正在登录，请稍候…</span>
          </button>
        </div>
        <!-- 注册内容区 -->
        <div v-show="registerTabActive">
          <span>使用第三方CNode社区服务</span><br><br>
          <span>点击下方链接注册，需要github账号</span><br><br>
          <a href="https://cnodejs.org/" target="_blank">https://cnodejs.org/</a>
        </div>
      </div>
    </div>
    <!-- 登录面板底部遮罩层 -->
    <div @click="closeLoginCard" class="loginCardMask"></div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      loginTabActive: true,
      registerTabActive: false,
      accesstoken: '',
      loading: false,
      storeToekn: false
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
        if (this.storeToekn === true) {
          // 确认存储token，执行setCookie方法
          this.$commonUtil.setCookie('accesstoken', this.accesstoken, 240)
        }
        // 存储token并验证
        sessionStorage['accesstoken'] = this.accesstoken
        this.$root.$children[0].verifyToken()
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
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  text-align: center;
  z-index: 290;
  user-select: none;
}

/* 登录面板样式 */
.loginWrp .loginCard {
  background: #fff;
  position: absolute;
  z-index: 1;
}

/* 登录面板底部遮罩层样式 */
.loginWrp .loginCardMask {
  width: 100%;
  height: 100%;
  background: #ccc;
  opacity: 0.5;
}

/* 登录面板关闭按钮样式 */
.loginWrp .loginCard .close {
  height: 4rem;
  width: 4rem;
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 4rem;
  color: #ddd;
  cursor: pointer;
}

/* 登录面板头部选项卡样式 */
.loginWrp .loginCard .loginCardTitle {
  width: 200px;
  height: 50px;
  margin: 0 auto;
}
.loginWrp .loginCard .loginCardTitle .titleCell {
  width: 80px;
  height: 45px;
  line-height: 45px;
  border-bottom: 5px solid #fff;
  font-size: 1.2rem;
  cursor: pointer;
  float: left;
}
.loginWrp .loginCard .loginCardTitle .titleCell.titleCellActive {
  border-bottom:  5px solid #c60023;
  font-weight: bold;
  color: #c60023;
}
.loginWrp .loginCard .loginCardTitle .titlePoint {
  width: 40px;
  height: 45px;
  line-height: 45px;
  float: left;
}

/* 登录面板头部选项卡对应的内容区域样式 */
.loginWrp .loginCard .loginCardBody {
  margin-top: 30px;
}
.loginWrp .loginCard .loginCardBody .identityInfo {
  width: 100%;
  height: 30px;
  margin-top: 10px;
  border: 1px solid #999;
  border-radius: 3px;
  font-size: 1.2rem;
  text-align: center;
}
.loginWrp .loginCard .loginCardBody .loginTips {
  margin-top: 5px;
  color: #777;
  float: left;
  cursor: pointer;
}
.loginWrp .loginCard .loginCardBody .rememberToken {
  margin-top: 5px;
  float: right;
}
.loginWrp .loginCard .loginCardBody .submitIdentifyInfo {
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

/* 响应式样式 */
@media only screen and (max-width: 900px) {
  /* 登录面板响应式样式 */
  .loginWrp .loginCard.loginCard-response {
    padding: 50px 30px 0px 30px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
}
@media only screen and (min-width: 900px) {
  /* 登录面板响应式样式 */
  .loginWrp .loginCard.loginCard-response {
    width: 300px;
    height: 400px;
    padding: 50px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px #333;
    margin-left: -200px;
    margin-top: -250px;
    left: 50%;
    top: 50%;
  }
  /* 登录面板关闭按钮hover样式 */
  .loginWrp .loginCard .close:hover {
    color: #c60023;
  }
  /* 登录面板头部选项卡hover样式 */
  .loginWrp .loginCard .loginCardTitle .titleCell:hover {
    font-weight: bold;
    color: #c60023;
  }
  /* 登录输入框下方tips的hover样式 */
  .loginWrp .loginCard .loginCardBody .loginTips:hover {
    color: #000;
    text-decoration: underline;
  }
}
</style>
