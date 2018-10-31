
# 使用vue构建的第三方社区网站

## 功能介绍
这是一个国内的nodejs技术交流社区，可以适应移动端和PC端，主要包含以下功能:  
1、【分类浏览】分类浏览社区中各种类型的话题，包括技术分享，问题讨论，招聘信息等等板块  
2、【个人中心】用户个人中心查看用户最近参与的话题，发表的话题，以及收藏的话题  
3、【文章互动】可在各类话题中发表自己的评论，为他人的评论点赞，以及收藏自己喜欢的话题  
4、【话题发表】可以发表自己的话题，编辑自己已经发表的话题，在发表话题与编辑话题的过程中可以实时预览发表后的格式排版  
5、【接收消息】当有其他用户@你或者在你的话题下方添加评论的时候，可以接收到相应的消息提醒(消息提醒60秒刷新一次)  

[[---github源码---]](https://github.com/Reviving-Pain/reviving-pain.github.io) [[---码云源码---]](https://gitee.com/Reviving-Pain/CnodeJS-community)

[[---github在线预览---]](https://reviving-pain.github.io/dist/#/cnodeCommunity/cnodejsTopics) [[---码云在线预览---]](https://reviving-pain.gitee.io/cnodejs-community/#/cnodeCommunity/cnodejsTopics)

## 技术栈

[Vue.js](https://cn.vuejs.org/)  

[Vue-router](https://router.vuejs.org/zh/)  

[Vuex](https://vuex.vuejs.org/zh/)  

[Vue-markdown](https://www.npmjs.com/package/vue-markdown)  

[Axios](https://www.jianshu.com/p/7a9fbcbb1114)  

[CnodeJS社区 API](https://cnodejs.org/api)  


## 项目本地运行操作流程

```
# 下载代码到本地目录
git clone

# 进入到项目目录下执行
npm install

# 运行项目
npm run dev

# 打包项目
npm run build
```

## 关于项目运行起来之后如何登录的问题
> 在这里说明一下，由于cnode社区没有提供用户名密码登录返回token的登录形式接口，所以,这里只能直接使用token进行登录，请保存好自己的token

1. 用自己的github账号在CnodeJS社区进行注册，具体网址是https://cnodejs.org/ ,如果注册后登录失败，请点击自己的github页面右上角头像打开setting，将setting页面中的Profile选项卡中的Public email设置好，同时取消勾选在Emails选项卡中下方的"Keep my email address private"选项。

2. 注册并登录成功之后点击右上角的设置，在页面的最下方找到自己的 Access Token 字符串

3. 在项目主页的登录弹窗中输入自己的token码，检测认证信息(没有弹窗可以点击页面顶部的头像在弹出菜单中选择进行登录)


## 接下来准备完成的

1、用户发表完品论刷新文章组件后跳转到自己刚刚发表的评论位置，查看新回复的消息同时跳转到文章对应的回复位置。

2、做移动端二维码登录（完成之后添加到上方的"功能介绍中"）

3、为各种alert与confirm，以及提示信息做虚拟弹窗

4、修改评论区整体显示结构，评论反序排序显示，最新评论显示在上方，增加热评板块（点赞数量大于等于5个）

5、修改评论区主评论与回复评论的显示结构，回复评论时，在主评论旁边新增回复按钮，展开回复专用输入框


# 未来计划

## 将CNode社区搬到微信小程序上  
>只保留 『CNodejs社区主页』、『文章详情』、『用户主页』  
（微信小程序版CNode社区暂不设定用户登录功能，具体的运营规范还不是很清楚）
