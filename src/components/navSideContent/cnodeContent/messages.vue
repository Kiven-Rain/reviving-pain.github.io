<template>
  <div class="userMsgWrp">
    <loading v-if="loading"></loading>
    <div v-show="!loading" class="userMsgFrame">
      <div class="commonBlockWrp">
        <h2>未读消息</h2>
        <div v-if="msgData.hasnotReadMsgs.length">
          <button class="selectMsgBtn" @click="markMsg">
            <span v-if="!this.isCheckedAll">全选</span>
            <span v-if="this.isCheckedAll">取消全选</span>
          </button>
          <button class="selectMsgBtn" @click="markHasReadMsg">标记选中为已读</button>
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
      <div class="commonBlockWrp">
        <h2>已读消息</h2>
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
</template>

<script>
import request from '../../../util/apiRequest.js'
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
          request.markAllMsgToRead({
            accesstoken: sessionStorage['accesstoken']
          }, (res) => {
            alert('操作成功')
            this.loading = false
            this.$parent.reload()
            // 请求header的获取消息数量的方法刷新剩余未读消息数量
            this.$parent.$parent.$children[0].getUserMsgNum()
          }, (err) => {
            console.log(err)
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
      request.markOneMsgToRead(this.msgData.hasnotReadMsgs[msgIndex].id, {
        accesstoken: sessionStorage['accesstoken']
      }, (res) => {
        // 调用header的消息数量请求，刷新数量显示
        this.$parent.$parent.$children[0].getUserMsgNum()
      }, (err) => {
        console.log(err)
      })
    }
  },
  created: function () {
    this.loading = true
    request.getUserMsg({
      accesstoken: sessionStorage['accesstoken']
    }, (res) => {
      this.loading = false
      this.msgData.hasReadMsgs = res.data.data.has_read_messages
      this.msgData.hasnotReadMsgs = res.data.data.hasnot_read_messages
      // 初始化状态标记数组
      for (var i = 0; i < this.msgData.hasnotReadMsgs.length; i++) {
        this.checkedMsg[i] = false
      }
    }, (err) => {
      console.log(err)
    })
  }
}
</script>

<style scoped>
h2 {
  height: auto;
  width: 100%;
  margin: 0px;
  border-bottom: 1px solid #c4c4c4;
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: #333;
}
.userMsgWrp {
  min-height: 100%;
  background: linear-gradient(#f6f6f6, #fff);
}
.userMsgFrame {
  max-width: 800px;
  padding: 10px;
  margin: 0 auto;
}
.userMsgFrame .commonBlockWrp {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0px 0px 10px #ccc;
  margin-bottom: 20px;
  background: #fff;
  /* div中文本超出时自动换行 */
  word-break: break-all;
}
.selectMsgBtn {
  height: 2rem;
  line-height: 2rem;
  padding: 0px 15px 0px 15px;
  border: none;
  border-radius: 3px;
  margin: 0px 10px 10px 0px;
  background: #ccc;
  font-size: 1rem;
  color: #444;
  cursor: pointer;
  user-select: none;
  outline: none;
}
.selectMsgBtn:hover {
  background: #c60023;
  color: #fff;
}
.msgItem {
  padding: 10px 0px 10px 0px;
  border-bottom: 1px solid #eee;
}
.msgItem a {
  text-decoration: none;
  color: #0099cc;
}
.msgItem a:hover {
  text-decoration: underline;
}
</style>
