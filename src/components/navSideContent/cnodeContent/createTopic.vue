<template>
  <div class="nsc-commonWrp">
    <div class="nsc-commonBody">
      <!-- 作为编辑文章组件时添加的标题 -->
      <div class="nsc-commonBlockWrp">
        <slot name="modifyBlockTitle">
          <h2>发布话题</h2>
        </slot>
        <div class="nsc-commonBlockBody">
          <div class="selectType">
            <span>选择板块：</span>
            <select name="topicTag" v-model="publishData.topicTag">
              <option value="default_select">请选择</option>
              <option v-for="(topicTag, tagIndex) in topicTags" :key="tagIndex" :value="topicTag.value">
                {{topicTag.name}}
              </option>
            </select>
          </div>
          <div class="topicTitle">
            <input type="text" v-model.trim="publishData.topicTitle" placeholder="标题字数10字以上">
          </div>
          <!-- 选项卡切换按钮 -->
          <div @click="switchCard('edit')" :class="['switchCard', {'switchCardActive': !isPreview}]">编辑内容</div>
          <div @click="switchCard('preview')" :class="['switchCard', {'switchCardActive': isPreview}]">预览内容</div>
          <div class="topicContent">
            <textarea v-show="!isPreview" v-model.trim="publishData.topicContent" placeholder="(支持markdown语法) 测试帖请选择“客户端测试”板块！"></textarea>
            <vue-markdown v-show="isPreview" :source="publishData.topicContent.replace('](www', '](https://www')" class="markdownDisplay md-content"></vue-markdown>
          </div>
          <!-- newPublish按钮 -->
          <button v-if="!isModify" :disabled="subLoading" @click="publishTopic('newPublish')" class="big-submit-btn bgc-wineRed block-center">
            <span v-if="!subLoading">发布</span>
            <span v-if="subLoading"><span class="fa fa-spinner fa-spin"></span> 发布中…</span>
          </button>
          <!-- modifyPublish按钮 -->
          <button v-if="isModify" :disabled="subLoading" @click="publishTopic('modify')" class="big-submit-btn bgc-wineRed block-center">
            <span v-if="!subLoading">提交修改</span>
            <span v-if="subLoading"><span class="fa fa-spinner fa-spin"></span> 提交中…</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {topicTags} from '../../../data/topicClassify.js'
import vueMarkdown from 'vue-markdown'

export default {
  props: {
    'topicTag': String,
    'topicTitle': String,
    'topicContent': String
  },
  components: {
    'vue-markdown': vueMarkdown
  },
  data: function () {
    return {
      subLoading: false,
      topicTags: topicTags,
      publishData: {
        topicTag: 'default_select',
        topicTitle: '',
        topicContent: ''
      },
      // 存储添加推广链接后的文章内容(补全推广链接的时候直接出现在文本框中体验不好,所以添加此字段)
      newTopicContent: '',
      // 选择显示哪一种提交按钮
      isModify: false,
      // url输入https补全
      inputUrlPrefix: '',
      isPreview: false
    }
  },
  methods: {
    // 发布文章or修改文章(根据传入参数判断是发布文章还是修改文章)
    publishTopic: function (publishType) {
      if (!(this.publishData.topicTag === 'default_select')) {
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
                  // 给发布的文章内容末尾添加推广链接
                  if (!(RegExp(/娇羞的CNode社区处女作客户端/).test(this.publishData.topicContent))) {
                    this.newTopicContent = this.publishData.topicContent.concat('\n\n由 [vue版CNode客户端](https://reviving-pain.github.io/dist/#/cnodeCommunity/cnodejsTopics) 独家发布')
                  }
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
        alert('请选择板块')
      }
    },
    // 新文章发布请求与相关逻辑
    createTopic: function () {
      this.$apiRequest.createTopic({
        accesstoken: this.$commonUtil.getCookie('accesstoken'),
        title: this.publishData.topicTitle,
        tab: this.publishData.topicTag,
        content: this.newTopicContent
      }, (res) => {
        this.subLoading = false
        if (confirm('发布成功，需要查看刚发布的文章吗？')) {
          this.$router.push({path: '/cnodeCommunity/cnodejsTopics/' + res.data.topic_id})
        } else {
          // 重新加载该子组件，清空填入内容
          this.$parent.reload()
        }
      }, (err) => {
        this.$commonUtil.netErrorTips(err)
        this.subLoading = false
      })
    },
    // 修改好的文章提交请求与相关逻辑
    modifyTopic: function () {
      var topicId = this.$route.path.split('/').pop()
      this.$apiRequest.modifyTopic({
        accesstoken: this.$commonUtil.getCookie('accesstoken'),
        topic_id: topicId,
        title: this.publishData.topicTitle,
        tab: this.publishData.topicTag,
        content: this.publishData.topicContent
      }, (res) => {
        this.subLoading = false
        this.$parent.$parent.reload()
      }, (err) => {
        this.$commonUtil.netErrorTips(err)
        this.subLoading = false
      })
    },
    switchCard: function (type) {
      if (type === 'edit') {
        this.isPreview = false
      } else if (type === 'preview') {
        this.isPreview = true
      }
    }
  },
  created: function () {
    // 更改页面标题
    if (this.$route.path.split('/').pop() === 'createTopic') {
      this.$commonUtil.exchangePageTitle('在CnodeJS社区发布话题')
    }
    // 判断组件使用区域，回填表单，替换提交按钮
    if (this.topicTag) {
      this.isModify = true
      this.publishData.topicTag = this.topicTag
      this.publishData.topicTitle = this.topicTitle
      this.publishData.topicContent = this.topicContent
    }
  }
}
</script>

<style scoped>
/* 选择板块区域 */
.nsc-commonBlockBody .selectType {
  margin: 5px 0px 5px 0px;
  font-size: 1.2rem;
}
.nsc-commonBlockBody .selectType select {
  width: 150px;
  height: 30px;
  padding-left: 5px;
  border-radius: 5px;
  font-size: 1.2rem;
  background: #fff;
  cursor: pointer;
}

/* 文章标题区域 */
.nsc-commonBlockBody .topicTitle {
  width: 100%;
  padding: 10px 0px 10px 0px;
}
.nsc-commonBlockBody .topicTitle input {
  width: 100%;
  height: 40px;
  padding-left: 10px;
  border: 1px solid #aaa;
  box-sizing: border-box;
  border-radius: 5px;
  font-size: 1.2rem;
  outline: none;
}

/* 文章内容“编辑---预览”选项卡样式 */
.nsc-commonBlockBody .switchCard {
  width: 80px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin: 0px 0px -1px 5px;
  background: #fff;
  text-align: center;
  color: #999;
  cursor: pointer;
  user-select: none;
  display: inline-block;
  z-index: 1;
}
.nsc-commonBlockBody .switchCard.switchCardActive {
  border: 1px solid #ccc;
  border-bottom: 1px solid #fafafa;
  border-top: 3px solid #c60023;
  background: #fafafa;
  color: #333;
}

/* 文章内容区展示区样式 */
.nsc-commonBlockBody .topicContent {
  width: 100%;
  height: 500px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  margin-bottom: 10px;
  background: #fafafa;
  z-index: 0;
}
.nsc-commonBlockBody .topicContent textarea {
  width: 100%;
  height: 100%;
  padding: 5px;
  border: 1px solid #aaa;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1.1rem;
  font-family: '微软雅黑';
  outline: none;
  resize: none;
}
.nsc-commonBlockBody .topicContent .markdownDisplay {
  width: 100%;
  height: 100%;
  padding: 5px;
  border: 1px solid #aaa;
  border-radius: 5px;
  box-sizing: border-box;
  background: #fff;
  overflow-y: auto;
}
</style>
