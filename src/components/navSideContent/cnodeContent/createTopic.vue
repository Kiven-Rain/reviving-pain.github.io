<template>
  <div class="publishBackground">
    <div class="publishWrp">
      <!-- 作为编辑文章组件时添加的标题 -->
      <div class="componentTitle">
        <slot name="modifyBlockTitle">
          <span>发布文章</span>
        </slot>
      </div>
      <div class="selectType">
        <span>选择板块：</span>
        <select name="topicTab" v-model="publishData.topicTab">
          <option value="default_select">请选择</option>
          <option value="share">分享</option>
          <option value="ask">问答</option>
          <option value="job">招聘</option>
          <option value="dev">客户端测试</option>
        </select>
      </div>
      <div class="topicTitle">
        <input type="text" v-model.trim="publishData.topicTitle" placeholder="标题字数10字以上">
      </div>
      <div class="topicContent">
        <textarea v-model.trim="publishData.topicContent" placeholder="(支持markdown语法) 测试帖请选择“客户端测试”板块！"></textarea>
        <span>发布内容预览：</span>
        <vue-markdown :source="publishData.topicContent.replace('](www', '](https://www')" class="markdownDisplay"></vue-markdown>
      </div>
      <!-- newPublish按钮 -->
      <button v-if="!isModify" :disabled="subLoading" @click="publishTopic('newPublish')" class="publishBtn">
        <span v-if="!subLoading">发布</span>
        <span v-if="subLoading"><span class="fa fa-spinner fa-spin"></span> 发布中…</span>
      </button>
      <!-- modifyPublish按钮 -->
      <button v-if="isModify" :disabled="subLoading" @click="publishTopic('modify')" class="publishBtn">
        <span v-if="!subLoading">提交修改</span>
        <span v-if="subLoading"><span class="fa fa-spinner fa-spin"></span> 提交中…</span>
      </button>
    </div>
  </div>
</template>

<script>
import request from '../../../util/apiRequest.js'
import vueMarkdown from 'vue-markdown'

export default {
  props: {
    'topicTab': String,
    'topicTitle': String,
    'topicContent': String
  },
  components: {
    'vue-markdown': vueMarkdown
  },
  data: function () {
    return {
      subLoading: false,
      publishData: {
        topicTab: 'default_select',
        topicTitle: '',
        topicContent: ''
      },
      // 选择显示哪一种提交按钮
      isModify: false,
      // url输入https补全
      inputUrlPrefix: ''
    }
  },
  methods: {
    // 发布文章or修改文章(根据传入参数判断是发布文章还是修改文章)
    publishTopic: function (publishType) {
      if (!(this.publishData.topicTab === 'default_select')) {
        if (this.publishData.topicTitle) {
          // 正则验证，标题字数10~50字之间
          var re = new RegExp('^.{10,50}$')
          if (re.test(this.publishData.topicTitle)) {
            console.log('正则验证通过')
            if (this.publishData.topicContent) {
              // 预处理发布文本，将url中的'www'改为'https://www'
              this.publishData.topicContent = this.publishData.topicContent.replace('](www', '](https://www')
              if (publishType === 'newPublish') {
                if (confirm('确认发布？')) {
                  this.subLoading = true
                  this.createTopic()
                } else {
                  console.log('发布已取消')
                }
              } else if (publishType === 'modify') {
                if (confirm('确认提交修改吗？')) {
                  this.subLoading = true
                  this.modifyTopic()
                } else {
                  console.log('提交已取消，可以继续修改')
                }
              } else {
                console.log('未传入正确参数')
              }
            } else {
              alert('内容不能为空')
            }
          } else {
            alert('标题太短或太长')
          }
        } else {
          alert('标题不能为空')
        }
      } else {
        alert('请选择分类')
      }
    },
    // 新文章发布请求与相关逻辑
    createTopic: function () {
      request.createTopic({
        accesstoken: sessionStorage['accesstoken'],
        title: this.publishData.topicTitle,
        tab: this.publishData.topicTab,
        content: this.publishData.topicContent
      }, (res) => {
        this.subLoading = false
        if (confirm('发布成功，需要查看刚发布的文章吗？')) {
          this.$router.push({path: '/cnodeCommunity/cnodejsTopic/' + res.data.topic_id})
        } else {
          // 重新加载该子组件，清空填入内容
          this.$parent.reload()
        }
      }, (err) => {
        alert(err.response.data.error_msg)
      })
    },
    // 修改好的文章提交请求与相关逻辑
    modifyTopic: function () {
      var topicId = this.$route.path.split('/').pop()
      request.modifyTopic({
        accesstoken: sessionStorage['accesstoken'],
        topic_id: topicId,
        title: this.publishData.topicTitle,
        tab: this.publishData.topicTab,
        content: this.publishData.topicContent
      }, (res) => {
        this.subLoading = false
        this.$parent.$parent.reload()
        console.log()
      }, (err) => {
        alert(err)
      })
    }
  },
  created: function () {
    // 判断组件使用区域，回填表单，替换提交按钮
    if (this.topicTab) {
      this.isModify = true
      this.publishData.topicTab = this.topicTab
      this.publishData.topicTitle = this.topicTitle
      this.publishData.topicContent = this.topicContent
    }
  }
}
</script>

<style scoped>
.publishBackground {
  min-height: 100%;
  padding: 0px 10px 0px 10px;
  background: linear-gradient(#f6f6f6, #fff);
  overflow: hidden;
}
.publishWrp {
  max-width: 800px;
  box-shadow: 0px 0px 10px #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  background: #fff;
}
.publishWrp .componentTitle {
  border-bottom: 1px solid #999;
  padding-bottom: 10px;
  margin: 10px;
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
}
.selectType {
  margin: 10px ;
  font-size: 1.2rem;
}
.selectType select {
  width: 150px;
  height: 30px;
  padding-left: 5px;
  border-radius: 5px;
  font-size: 1.2rem;
  background: #fff;
}
.topicTitle {
  padding: 10px 20px 10px 10px;
}
.topicTitle input {
  width: 100%;
  height: 30px;
  padding-left: 10px;
  border: 1px solid #aaa;
  border-radius: 5px;
  font-size: 1.2rem;
  outline: none;
}
.topicContent {
  padding: 10px 23px 10px 10px;
}
.topicContent textarea {
  width: 100%;
  height: 260px;
  padding-left: 10px;
  border: 1px solid #aaa;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 1.1rem;
  font-family: '微软雅黑';
  outline: none;
  resize: none;
}
.topicContent .markdownDisplay {
  width: 100%;
  height: 260px;
  padding-left: 10px;
  border: 1px solid #aaa;
  box-shadow: 0px 0px 10px #ccc;
  border-radius: 5px;
  margin: 5px 0px 10px 0px;
  font-size: 0.8rem;
  font-family: '微软雅黑';
  overflow-y: auto;
}
.topicContent .markdownDisplay >>> img {
  max-width: 85%;
  display: block;
  margin: 0 auto;
}
.publishBtn {
  width: 100%;
  max-width: 600px;
  height: 50px;
  line-height: 50px;
  border: none;
  border-radius: 5px;
  margin: 0 auto;
  background: #c60023;
  display: block;
  text-align: center;
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
  user-select: none;
}
</style>
