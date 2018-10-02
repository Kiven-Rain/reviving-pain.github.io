
> 使用vue构建的第三方社区网站

[源码github](https://github.com/Reviving-Pain/reviving-pain.github.io)

[在线预览](https://reviving-pain.github.io/dist/#/)

## Build Setup

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

4. 然后就可以进行话题发布，编辑话题，收藏话题，发表评论，给评论点赞，等等活动啦~


## 接下来准备完成的

1、查看未读消息、已读消息

2、文章以及评论日期显示的优化，从详细日期改为刚刚，xx分钟前，xx小时前，xx天，周，月，年等等
