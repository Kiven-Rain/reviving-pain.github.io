<template>
  <div class="userMsgWrp">
    <loading v-if="loading"></loading>
    <div v-show="!loading" class="userMsgFrame">
      <div class="commonBlockWrp">
        <h2>未读消息</h2>
        <span>{{msgData.hasnotReadMsgs}}</span>
      </div>
      <div class="commonBlockWrp">
        <h2>已读消息</h2>
        <span>{{msgData.hasReadMsgs}}</span>
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
      }
    }
  },
  methods: {
    // put some function here
  },
  created: function () {
    this.loading = true
    request.getUserMsg({
      accesstoken: sessionStorage['accesstoken']
    }, (res) => {
      this.loading = false
      this.msgData.hasReadMsgs = res.data.data.has_read_messages
      this.msgData.hasnotReadMsgs = res.data.data.hasnot_read_messages
      if (this.msgData.hasnotReadMsgs.length === 0) {
        this.msgData.hasnotReadMsgs = '暂无消息'
      }
      if (this.msgData.hasReadMsgs.length === 0) {
        this.msgData.hasReadMsgs = '暂无消息'
      }
      console.log(this.msgData.hasnotReadMsgs)
      console.log(this.msgData.hasReadMsgs)
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
</style>
