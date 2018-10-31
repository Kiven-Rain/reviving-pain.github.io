<template>
  <div class="nsc-commonWrp">
    <loading v-if="loading"></loading>
    <div v-show="!loading" class="nsc-commonBody">
      <div class="nsc-commonBlockWrp">
        <h2>未读消息</h2>
        <div v-if="msgData.hasnotReadMsgs.length" class="nsc-commonBlockBody">
          <button @click="markMsg" class="mid-submit-btn-ato bgc-lGray">
            <span v-if="!this.isCheckedAll">全选</span>
            <span v-if="this.isCheckedAll">取消全选</span>
          </button>
          <button @click="markHasReadMsg" class="mid-submit-btn-ato bgc-lGray">标记选中为已读</button>
          <div v-for="(notReadMsg, notReadMsgIndex) in msgData.hasnotReadMsgs" :key="notReadMsgIndex" class="msgItem">
            <!-- 展示未读消息 -->
            <input ref="checkMsg" @click="markMsg(notReadMsgIndex)" type="checkbox" v-model="checkedMsg[notReadMsgIndex]">
            <router-link :to='{name: "UserRoute", params: {name: notReadMsg.author.loginname}}'>
              {{notReadMsg.author.loginname}}
            </router-link>
            <span v-if="notReadMsg.type === 'reply'">回复了你的话题</span>
            <span v-if="notReadMsg.type === 'at'">在话题</span>
            <router-link @click.native="markOneMsgToRead(notReadMsgIndex)"
            :to='{name: "ArticleRoute", params: {id: notReadMsg.topic.id}}'>{{notReadMsg.topic.title}}</router-link>
            <span v-if="notReadMsg.type === 'at'">中@了你</span>
          </div>
        </div>
        <span v-if="!msgData.hasnotReadMsgs.length">暂无消息</span>
      </div>
      <div class="nsc-commonBlockWrp">
        <h2>已读消息</h2>
        <div class="nsc-commonBlockBody">
          <div v-if="msgData.hasReadMsgs.length"
          v-for="(readMsg, readMsgIndex) in msgData.hasReadMsgs" :key="readMsgIndex" class="msgItem">
            <!-- 展示已读消息 -->
            <router-link :to='{name: "UserRoute", params: {name: readMsg.author.loginname}}'>
              {{readMsg.author.loginname}}
            </router-link>
            <span v-if="readMsg.type === 'reply'">回复了你的话题</span>
            <span v-if="readMsg.type === 'at'">在话题</span>
            <router-link :to='{name: "ArticleRoute", params: {id: readMsg.topic.id}}'>{{readMsg.topic.title}}</router-link>
            <span v-if="readMsg.type === 'at'">中@了你</span>
          </div>
          <span v-if="!msgData.hasReadMsgs.length">暂无消息</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from '../../common/loading.vue'

export default {
  components: {
    'loading': loading
  },
  data: function () {
    return {
      loading: false,
      msgData: {
        hasReadMsgs: [],
        hasnotReadMsgs: []
      },
      checkedMsg: [],
      isCheckedAll: false
    }
  },
  methods: {
    // checkbox的消息标记操作
    markMsg: function (checked) {
      if (checked.type === 'click') {
        if (this.isCheckedAll === false) {
          // 如果是未全选状态，执行全选操作
          this.selectAll(true)
        } else {
          // 如果已经全选，执行取消全选操作
          this.selectAll(false)
        }
      } else {
        // 处理数组元素更新延迟的问题，等待主线程事件执行完毕
        setTimeout(() => {
          // 判断全选状态，改变按钮显示名称
          if (!(this.checkedMsg.indexOf(false) + 1)) {
            // 如果checkedMsg数组中没有false元素，就是全选
            this.isCheckedAll = true
          } else {
            this.isCheckedAll = false
          }
        }, 0)
      }
    },
    // 全选&取消全选方法
    selectAll: function (status) {
      for (var i = 0; i < this.$refs.checkMsg.length; i++) {
        this.$refs.checkMsg[i].checked = status
        this.checkedMsg[i] = status
      }
      this.isCheckedAll = status
    },
    // 将选中消息标记为已读
    markHasReadMsg: function () {
      if (this.checkedMsg.indexOf(true) + 1) {
        if (this.isCheckedAll) {
          // 发送全选标记请求
          this.loading = true
          this.$apiRequest.markAllMsgToRead({
            accesstoken: this.$commonUtil.getCookie('accesstoken')
          }, (res) => {
            alert('操作成功')
            this.loading = false
            this.$parent.reload()
            // 请求header的获取消息数量的方法刷新剩余未读消息数量
            this.$root.$children[0].$children[0].getUserMsgNum()
          }, (err) => {
            this.$commonUtil.netErrorTips(err)
            this.loading = false
          })
        } else {
          // 循环标记
          // console.log(this.checkedMsg)
          for (let i = 0; i < this.checkedMsg.length; i++) {
            if (this.checkedMsg[i] === true) {
              setTimeout(() => {
                this.markOneMsgToRead(i)
              }, 0)
            }
            // 将重新加载的方法加到所有请求事件队列的最后，请求完毕，重新加载子组件
            console.log(i)
            setTimeout(() => {
              if (i === (this.checkedMsg.length - 1)) {
                console.log('已将当前点击的消息标记为已读')
                this.$parent.reload()
              }
            }, 0)
          }
        }
      } else {
        alert('请选择要标记的消息')
      }
    },
    // 发送单条消息标记请求
    markOneMsgToRead: function (msgIndex) {
      this.$apiRequest.markOneMsgToRead(this.msgData.hasnotReadMsgs[msgIndex].id, {
        accesstoken: this.$commonUtil.getCookie('accesstoken')
      }, (res) => {
        // 调用header的消息数量请求，刷新数量显示
        this.$root.$children[0].$children[0].getUserMsgNum()
      }, (err) => {
        this.$commonUtil.netErrorTips(err)
      })
    }
  },
  computed: {
    loginStatus: function () {
      return this.$store.state.loginStatus
    }
  },
  watch: {
    loginStatus: function () {
      if (!this.loginStatus) {
        this.$router.push({path: '/cnodeCommunity/cnodejsTopics'})
      }
    }
  },
  created: function () {
    this.$commonUtil.exchangePageTitle('我的社区消息')
    this.loading = true
    this.$apiRequest.getUserMsg({
      accesstoken: this.$commonUtil.getCookie('accesstoken')
    }, (res) => {
      this.loading = false
      this.msgData.hasReadMsgs = res.data.data.has_read_messages
      this.msgData.hasnotReadMsgs = res.data.data.hasnot_read_messages
      // 初始化状态标记数组
      for (var i = 0; i < this.msgData.hasnotReadMsgs.length; i++) {
        this.checkedMsg[i] = false
      }
    }, (err) => {
      this.$commonUtil.netErrorTips(err)
      this.$router.push({path: '/cnodeCommunity/cnodejsTopics'})
    })
  }
}
</script>

<style scoped>
/* 处理未读消息的操作按钮(修正)样式 */
.nsc-commonBlockBody button {
  height: 30px;
  line-height: 30px;
  margin-right: 5px;
}

/* 消息item样式 */
.nsc-commonBlockBody .msgItem {
  padding: 10px 0px 10px 0px;
  border-bottom: 1px solid #eee;
}
.nsc-commonBlockBody .msgItem a {
  text-decoration: none;
  color: #0099cc;
}

/* 响应式样式 */
@media only screen and (min-width: 900px) {
  /* 消息item的hover样式 */
  .nsc-commonBlockBody .msgItem a:hover {
    text-decoration: underline;
  }
}
</style>
